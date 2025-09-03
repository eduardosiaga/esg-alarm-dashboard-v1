# Flujo de Mensajes Login y Last Will

## 📍 Mensaje LOGIN

### ¿Cuándo se envía?
El mensaje **LOGIN** se envía **UNA SOLA VEZ** cuando el dispositivo ESP32 se conecta exitosamente al broker MQTT por primera vez después de:
- Encendido del dispositivo (boot)
- Reconexión después de una desconexión de red
- Reconexión después de una pérdida de conexión MQTT

### Topic
```
{topic_base}/pb/d/{hostname}/login
```
Ejemplo: `esagtech/pb/d/ESG_ALARM_0483080CEDD8/login`

### Contenido
- Es un mensaje **StatusMessage** completo con toda la información del dispositivo
- Incluye contadores, estado actual, configuración, etc.
- Está envuelto con HMAC para autenticación

### Propósito
- Notificar al servidor que el dispositivo está online
- Proporcionar un snapshot completo del estado actual del dispositivo
- Permitir al servidor actualizar el campo `lastLogin` para tracking de conexiones

---

## 💀 Mensaje LAST WILL

### ¿Cuándo se envía?
El mensaje **LAST WILL** es enviado **AUTOMÁTICAMENTE por el broker MQTT** (no por el dispositivo) cuando:
- El dispositivo se desconecta inesperadamente (pérdida de red, corte de energía)
- El dispositivo no responde al keep-alive del broker
- La conexión TCP/IP se pierde sin un DISCONNECT limpio

### Topic
```
{topic_base}/pb/d/{hostname}/lw
```
Ejemplo: `esagtech/pb/d/ESG_ALARM_0483080CEDD8/lw`

### Contenido (LastWillMessage)
```protobuf
- sequence: Número de secuencia para anti-replay
- timestamp: Cuándo se conectó (NO cuando se desconectó)
- device_db_id: ID del dispositivo
- uptime_at_connect: Uptime cuando estableció la conexión
- firmware: Versión del firmware
- ip_address: IP del dispositivo
- rssi: Intensidad de señal WiFi
- hostname: Nombre del dispositivo
```

### Propósito
- Notificar al servidor que el dispositivo está offline de manera inesperada
- Proporcionar información sobre el estado del dispositivo cuando se conectó
- Permitir detección rápida de dispositivos offline sin esperar timeout

---

## 🔄 Diferencias entre STATUS y LOGIN

| Aspecto | LOGIN | STATUS |
|---------|-------|--------|
| **Frecuencia** | Una vez al conectar | Periódicamente (cada X minutos) |
| **Topic** | `/login` | `/status` |
| **Trigger** | Conexión inicial | Timer o cambio de estado |
| **Contenido** | StatusMessage completo | StatusMessage completo |
| **Propósito** | Anunciar conexión | Actualizar estado |

---

## 📊 Flujo Completo de Vida del Dispositivo

```
1. 🔌 DISPOSITIVO ARRANCA
   ↓
2. 📡 CONECTA A WIFI/ETHERNET
   ↓
3. 🔗 CONECTA A MQTT BROKER
   ↓
4. ✅ ENVÍA LOGIN (topic: /login)
   ↓
5. 💓 ENVÍA HEARTBEATS (cada 30s, topic: /hb)
   ↓
6. 📊 ENVÍA STATUS (periódicamente, topic: /status)
   ↓
7. 🚨 ENVÍA ALARMAS (cuando ocurren, topic: /alarm)
   ↓
8. ❌ DESCONEXIÓN INESPERADA
   ↓
9. 💀 BROKER ENVÍA LAST WILL (topic: /lw)
```

---

## 🔍 Cómo Verificar en el Monitor

### Para ver un LOGIN:
1. Reinicia un dispositivo ESP32
2. Observa el topic `*/login` en el monitor
3. Verás el StatusMessage inicial

### Para ver un LAST WILL:
1. Desconecta abruptamente un dispositivo (quita energía o desconecta red)
2. Espera unos segundos (timeout del broker)
3. Observa el topic `*/lw` en el monitor
4. Verás el LastWillMessage

### Logs esperados:
```
[INFO] Device LOGIN from ESG_ALARM_0483080CEDD8
[WARN] Device DISCONNECTED (Last Will) from ESG_ALARM_0483080CEDD8
```