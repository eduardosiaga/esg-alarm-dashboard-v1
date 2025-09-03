/**
 * WebSocket Server - Servidor independiente para actualizaciones en tiempo real
 * Corre en puerto 3001 y se comunica con MQTT para retransmitir eventos a clientes web
 */

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import * as mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.WS_PORT || 3001;

// Configuración MQTT (misma que server.ts)
const MQTT_CONFIG = {
  host: process.env.MQTT_HOST || 'esag-tech.com',
  port: parseInt(process.env.MQTT_PORT || '8883'),
  protocol: 'mqtts' as const,
  username: process.env.MQTT_USERNAME || 'esagtech_mqtt',
  password: process.env.MQTT_PASSWORD || 'lwcwDEBVZxD6VFU',
  rejectUnauthorized: false,
  keepalive: 60,
  reconnectPeriod: 5000,
};

// Crear servidor HTTP
const httpServer = createServer();

// Configurar Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3006", "http://localhost:3007"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Cliente MQTT
let mqttClient: mqtt.MqttClient | null = null;

// Mapa de dispositivos suscritos por socket
const socketSubscriptions = new Map<string, Set<number>>();

// Tipos de eventos WebSocket
export const WS_EVENTS = {
  // Cliente → Servidor
  SUBSCRIBE_DEVICES: 'subscribe:devices',
  UNSUBSCRIBE_DEVICES: 'unsubscribe:devices',
  SUBSCRIBE_ALL: 'subscribe:all',
  REQUEST_STATUS: 'request:status',
  
  // Servidor → Cliente
  DEVICE_UPDATE: 'device:update',
  DEVICE_ONLINE: 'device:online',
  DEVICE_OFFLINE: 'device:offline',
  DEVICE_ALARM: 'device:alarm',
  TELEMETRY_UPDATE: 'telemetry:update',
  CONNECTION_STATUS: 'connection:status',
  ERROR: 'error'
} as const;

/**
 * Conectar a MQTT broker
 */
function connectMQTT() {
  console.log('[WS-Server] Conectando a MQTT broker...');
  
  mqttClient = mqtt.connect(MQTT_CONFIG);
  
  mqttClient.on('connect', () => {
    console.log('[WS-Server] ✅ Conectado a MQTT broker');
    
    // Suscribirse a todos los topics relevantes
    const topics = [
      'esg/alarm/+/pb/d/+/hb',      // Heartbeat
      'esg/alarm/+/pb/d/+/status',   // Status
      'esg/alarm/+/pb/d/+/alarm',    // Alarmas
      'esg/alarm/+/pb/d/+/login',    // Login
      'esg/alarm/+/pb/d/+/lw'        // Last Will
    ];
    
    mqttClient?.subscribe(topics, (err) => {
      if (err) {
        console.error('[WS-Server] Error al suscribirse a topics:', err);
      } else {
        console.log('[WS-Server] Suscrito a topics MQTT');
      }
    });
  });
  
  mqttClient.on('message', handleMQTTMessage);
  
  mqttClient.on('error', (error) => {
    console.error('[WS-Server] Error MQTT:', error);
  });
  
  mqttClient.on('close', () => {
    console.log('[WS-Server] Conexión MQTT cerrada');
    // Reconectar después de 5 segundos
    setTimeout(connectMQTT, 5000);
  });
}

/**
 * Procesar mensajes MQTT y retransmitir via WebSocket
 */
async function handleMQTTMessage(topic: string, message: Buffer) {
  try {
    // Importar decodificadores dinámicamente
    const { unwrapHMAC } = await import('./lib/protobuf/hmac-wrapper');
    const { ProtobufDecoder } = await import('./lib/protobuf/decoder');
    
    // Extraer información del topic
    const topicParts = topic.split('/');
    const messageType = topicParts[topicParts.length - 1]; // hb, status, alarm, etc.
    const hostname = topicParts[topicParts.length - 2];    // Hostname del dispositivo
    
    // Buscar dispositivo en DB por hostname
    const device = await prisma.device.findFirst({
      where: { hostname },
      include: { deviceStatus: true }
    });
    
    if (!device) {
      console.log(`[WS-Server] Dispositivo no encontrado: ${hostname}`);
      return;
    }
    
    // Decodificar mensaje con HMAC y protobuf
    let decodedData: any = {};
    try {
      const decoder = new ProtobufDecoder();
      
      // Verificar y extraer payload del wrapper HMAC
      const unwrapped = unwrapHMAC(message);
      const payload = unwrapped?.payload;
      if (payload) {
        // Decodificar según el tipo de mensaje
        switch (messageType) {
          case 'hb':
            decodedData = decoder.decodeHeartbeat(payload);
            break;
          case 'status':
          case 'login':
            decodedData = decoder.decodeStatus(payload);
            break;
          case 'alarm':
            decodedData = decoder.decodeAlarmEvent(payload);
            break;
          case 'lw':
            decodedData = decoder.decodeLastWill(payload);
            break;
          case 'resp':
            decodedData = decoder.decodeCommandResponse(payload);
            break;
          default:
            console.log(`[WS-Server] Tipo de mensaje no manejado: ${messageType}`);
        }
      }
    } catch (decodeError) {
      console.error(`[WS-Server] Error decodificando mensaje protobuf:`, decodeError);
      // Continuar con data vacía si falla la decodificación
    }
    
    // Preparar payload para WebSocket
    const wsPayload = {
      deviceId: device.id,
      hostname,
      messageType,
      timestamp: new Date(),
      data: decodedData
    };
    
    // Determinar evento WebSocket según tipo de mensaje
    let wsEvent = WS_EVENTS.DEVICE_UPDATE;
    
    switch (messageType) {
      case 'hb':
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        // Actualizar telemetría en DB si es necesario
        if (decodedData.temperature !== undefined || decodedData.humidity !== undefined) {
          await updateDeviceTelemetry(device.id, decodedData);
        }
        break;
        
      case 'alarm':
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        console.log(`[WS-Server] 🚨 ALARMA detectada en dispositivo ${hostname}:`, decodedData.alarmType);
        // Guardar alarma en DB
        await saveAlarmEvent(device.id, decodedData);
        break;
        
      case 'login':
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        await updateDeviceOnlineStatus(device.id, true);
        // Actualizar información del dispositivo con los datos del login
        if (decodedData.firmwareVersion || decodedData.ipAddress) {
          await updateDeviceInfo(device.id, decodedData);
        }
        break;
        
      case 'lw':
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        await updateDeviceOnlineStatus(device.id, false);
        break;
        
      case 'status':
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        // Actualizar estado del dispositivo
        await updateDeviceStatus(device.id, decodedData);
        break;
        
      case 'resp':
        // Manejar respuesta de comando
        wsEvent = WS_EVENTS.DEVICE_UPDATE;
        wsPayload.data = { commandResponse: decodedData };
        break;
    }
    
    // Emitir a todos los clientes suscritos a este dispositivo
    io.to(`device:${device.id}`).emit('device:update' as any, { ...wsPayload, eventType: wsEvent });
    
    // También emitir a la sala 'all' para monitoring general
    io.to('all').emit('device:update' as any, { ...wsPayload, eventType: wsEvent });
    
  } catch (error) {
    console.error('[WS-Server] Error procesando mensaje MQTT:', error);
  }
}

/**
 * Actualizar telemetría del dispositivo
 */
async function updateDeviceTelemetry(deviceId: number, telemetryData: any) {
  try {
    // Aquí podrías guardar en una tabla de telemetría si existe
    console.log(`[WS-Server] Telemetría actualizada para dispositivo ${deviceId}:`, telemetryData);
  } catch (error) {
    console.error('[WS-Server] Error actualizando telemetría:', error);
  }
}

/**
 * Guardar evento de alarma
 */
async function saveAlarmEvent(deviceId: number, alarmData: any) {
  try {
    // Aquí podrías guardar en una tabla de alarmas si existe
    console.log(`[WS-Server] Alarma guardada para dispositivo ${deviceId}:`, alarmData);
  } catch (error) {
    console.error('[WS-Server] Error guardando alarma:', error);
  }
}

/**
 * Actualizar información del dispositivo
 */
async function updateDeviceInfo(deviceId: number, info: any) {
  try {
    const updates: any = {};
    if (info.firmwareVersion) updates.firmware_version = info.firmwareVersion;
    if (info.ipAddress) updates.location = `IP: ${info.ipAddress}`;
    
    if (Object.keys(updates).length > 0) {
      await prisma.device.update({
        where: { id: deviceId },
        data: updates
      });
    }
  } catch (error) {
    console.error('[WS-Server] Error actualizando info del dispositivo:', error);
  }
}

/**
 * Actualizar estado del dispositivo
 */
async function updateDeviceStatus(deviceId: number, statusData: any) {
  try {
    const updates: any = {};
    if (statusData.batteryVoltage) updates.battery_level = Math.round((statusData.batteryVoltage / 4.2) * 100);
    if (statusData.rssi) updates.signal_strength = statusData.rssi;
    
    if (Object.keys(updates).length > 0) {
      await prisma.deviceStatus.update({
        where: { deviceId },
        data: updates
      });
    }
  } catch (error) {
    console.error('[WS-Server] Error actualizando estado del dispositivo:', error);
  }
}

/**
 * Actualizar estado online/offline en base de datos
 */
async function updateDeviceOnlineStatus(deviceId: number, isOnline: boolean) {
  try {
    await prisma.deviceStatus.update({
      where: { deviceId },
      data: {
        isOnline,
        lastSeen: isOnline ? new Date() : undefined
      }
    });
    
    console.log(`[WS-Server] Device ${deviceId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
  } catch (error) {
    console.error('[WS-Server] Error actualizando estado del dispositivo:', error);
  }
}

/**
 * Configurar eventos de Socket.IO
 */
io.on('connection', (socket) => {
  console.log(`[WS-Server] Cliente conectado: ${socket.id}`);
  
  // Enviar estado de conexión
  socket.emit(WS_EVENTS.CONNECTION_STATUS, {
    connected: true,
    mqttConnected: mqttClient?.connected || false,
    timestamp: new Date()
  });
  
  // Suscribir a dispositivos específicos
  socket.on(WS_EVENTS.SUBSCRIBE_DEVICES, async (deviceIds: number[]) => {
    console.log(`[WS-Server] Cliente ${socket.id} suscribiéndose a dispositivos:`, deviceIds);
    
    // Guardar suscripciones del socket
    socketSubscriptions.set(socket.id, new Set(deviceIds));
    
    // Unir a rooms específicos de cada dispositivo
    for (const deviceId of deviceIds) {
      socket.join(`device:${deviceId}`);
      
      // Enviar estado actual del dispositivo
      try {
        const device = await prisma.device.findUnique({
          where: { id: deviceId },
          include: { deviceStatus: true }
        });
        
        if (device) {
          socket.emit(WS_EVENTS.DEVICE_UPDATE, {
            deviceId,
            data: device
          });
        }
      } catch (error) {
        console.error(`[WS-Server] Error obteniendo estado del dispositivo ${deviceId}:`, error);
      }
    }
  });
  
  // Desuscribir de dispositivos
  socket.on(WS_EVENTS.UNSUBSCRIBE_DEVICES, (deviceIds: number[]) => {
    console.log(`[WS-Server] Cliente ${socket.id} desuscribiéndose de dispositivos:`, deviceIds);
    
    for (const deviceId of deviceIds) {
      socket.leave(`device:${deviceId}`);
    }
    
    // Actualizar suscripciones
    const currentSubs = socketSubscriptions.get(socket.id);
    if (currentSubs) {
      deviceIds.forEach(id => currentSubs.delete(id));
    }
  });
  
  // Suscribir a todos los dispositivos (para dashboard general)
  socket.on(WS_EVENTS.SUBSCRIBE_ALL, () => {
    console.log(`[WS-Server] Cliente ${socket.id} suscribiéndose a TODOS los dispositivos`);
    socket.join('all');
  });
  
  // Solicitar estado actual
  socket.on(WS_EVENTS.REQUEST_STATUS, async (deviceId: number) => {
    try {
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          deviceStatus: true,
          telemetry: {
            take: 1,
            orderBy: { time: 'desc' }
          }
        }
      });
      
      if (device) {
        socket.emit(WS_EVENTS.DEVICE_UPDATE, {
          deviceId,
          data: device
        });
      }
    } catch (error) {
      socket.emit(WS_EVENTS.ERROR, {
        message: 'Error obteniendo estado del dispositivo',
        deviceId
      });
    }
  });
  
  // Limpiar al desconectar
  socket.on('disconnect', () => {
    console.log(`[WS-Server] Cliente desconectado: ${socket.id}`);
    socketSubscriptions.delete(socket.id);
  });
});

/**
 * Iniciar servidor
 */
function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`[WS-Server] 🚀 WebSocket server corriendo en puerto ${PORT}`);
    console.log(`[WS-Server] Esperando conexiones WebSocket...`);
    
    // Conectar a MQTT
    connectMQTT();
  });
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('[WS-Server] Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[WS-Server] Promesa rechazada:', reason);
});

// Limpieza al cerrar
process.on('SIGINT', async () => {
  console.log('\n[WS-Server] Cerrando servidor...');
  
  io.close();
  mqttClient?.end();
  await prisma.$disconnect();
  
  process.exit(0);
});

// Iniciar servidor
startServer();