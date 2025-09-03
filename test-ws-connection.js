/**
 * Test WebSocket Connection
 * Verifica que el servidor WebSocket esté funcionando correctamente
 */

const io = require('socket.io-client');

// Conectar al servidor WebSocket
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

console.log('🔄 Intentando conectar al servidor WebSocket en puerto 3001...');

// Eventos de conexión
socket.on('connect', () => {
  console.log('✅ Conectado exitosamente al servidor WebSocket');
  console.log('   Socket ID:', socket.id);
  console.log('   Transport:', socket.io.engine.transport.name);
  
  // Suscribirse a todos los dispositivos
  console.log('\n📡 Suscribiéndose a todos los dispositivos...');
  socket.emit('subscribe:all');
  
  // Solicitar estado de conexión
  setTimeout(() => {
    console.log('\n📊 Solicitando estado de conexión...');
    socket.emit('request:status', 1);
  }, 1000);
});

// Recibir estado de conexión
socket.on('connection:status', (data) => {
  console.log('\n📊 Estado de conexión recibido:');
  console.log('   Conectado:', data.connected);
  console.log('   MQTT Conectado:', data.mqttConnected);
  console.log('   Timestamp:', data.timestamp);
});

// Recibir actualizaciones de dispositivos
socket.on('device:update', (data) => {
  console.log('\n🔔 Actualización de dispositivo:');
  console.log('   Device ID:', data.deviceId);
  console.log('   Hostname:', data.hostname);
  console.log('   Tipo de mensaje:', data.messageType);
  console.log('   Datos:', JSON.stringify(data.data).substring(0, 100) + '...');
});

// Recibir dispositivo online
socket.on('device:online', (data) => {
  console.log('\n✅ Dispositivo ONLINE:');
  console.log('   Device ID:', data.deviceId);
  console.log('   Hostname:', data.hostname);
});

// Recibir dispositivo offline
socket.on('device:offline', (data) => {
  console.log('\n❌ Dispositivo OFFLINE:');
  console.log('   Device ID:', data.deviceId);
  console.log('   Hostname:', data.hostname);
});

// Recibir alarmas
socket.on('device:alarm', (data) => {
  console.log('\n🚨 ALARMA DE DISPOSITIVO:');
  console.log('   Device ID:', data.deviceId);
  console.log('   Hostname:', data.hostname);
  console.log('   Tipo de alarma:', data.alarmType);
  console.log('   Severidad:', data.severity);
});

// Error de conexión
socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error.message);
  console.error('   Tipo:', error.type);
  console.error('   Detalles:', error);
});

// Desconexión
socket.on('disconnect', (reason) => {
  console.log('🔌 Desconectado del servidor:', reason);
});

// Error general
socket.on('error', (error) => {
  console.error('❌ Error del WebSocket:', error);
});

// Mantener el script corriendo
console.log('\n⏳ Escuchando eventos del servidor WebSocket...');
console.log('   Presiona Ctrl+C para salir\n');

// Manejo de salida
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando conexión...');
  socket.disconnect();
  process.exit(0);
});