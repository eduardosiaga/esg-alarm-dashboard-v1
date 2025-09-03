# Plan de Implementación - Dashboard con Datos Reales

## Análisis del Dashboard Actual

### Componentes que usan datos dummy:
1. **Estadísticas principales** (4 cards)
   - Dispositivos Totales: 24 (dummy)
   - En Línea: 18 (dummy)
   - Advertencias: 3 (dummy)
   - Fuera de Línea: 3 (dummy)

2. **Alarmas Recientes** (lista)
   - 4 alarmas dummy con dispositivos ficticios

3. **Estado de Dispositivos** (gráficos de barras)
   - Porcentajes hardcodeados (75%, 12.5%, 12.5%)

## Endpoints Existentes Identificados

### Disponibles actualmente:
- `GET /api/devices` - Lista dispositivos con filtros y paginación
- `GET /api/devices/[deviceId]` - Detalles de un dispositivo
- `GET /api/devices/[deviceId]/status` - Estado actual del dispositivo
- `GET /api/groups` - Lista de grupos
- `GET /api/auth/me` - Información del usuario actual

### NO existen (necesarios para el dashboard):
- Endpoint de estadísticas generales
- Endpoint de alarmas recientes
- Endpoint de métricas del sistema

## Datos Reales Disponibles en BD

### Tablas principales:
- `device` - Información básica de dispositivos
- `device_status` - Estado actual en tiempo real
- `device_telemetry` - Datos históricos
- `device_alarms` - Registro de alarmas

### Estadísticas actuales en BD:
```sql
- Total dispositivos: 21
- En línea: 15
- Fuera de línea: 6
- Con alarmas activas: 11
```

## Plan de Implementación

### Fase 1: Crear Endpoints Necesarios

#### 1. **GET /api/dashboard/stats**
Devuelve estadísticas generales del sistema.

**Respuesta esperada:**
```json
{
  "devices": {
    "total": 21,
    "online": 15,
    "offline": 6,
    "withAlarms": 11,
    "withWarnings": 3
  },
  "trends": {
    "devicesGrowth": 8,
    "onlineGrowth": 12,
    "warningsGrowth": -5,
    "offlineGrowth": -25
  }
}
```

**Query SQL:**
```sql
SELECT 
  COUNT(*) as total_devices,
  COUNT(CASE WHEN is_online = true THEN 1 END) as online_devices,
  COUNT(CASE WHEN is_online = false THEN 1 END) as offline_devices,
  COUNT(CASE WHEN panic1 = true OR panic2 = true OR box_sw = true THEN 1 END) as devices_with_alarms,
  COUNT(CASE WHEN temperature > 35 OR humidity > 80 THEN 1 END) as devices_with_warnings
FROM device_status;
```

#### 2. **GET /api/dashboard/recent-alarms**
Devuelve las alarmas más recientes.

**Respuesta esperada:**
```json
{
  "alarms": [
    {
      "id": 1,
      "deviceId": 18,
      "hostname": "ESP32-ALARM-016",
      "location": "Ubicación GDL - Zona 1",
      "type": "Tamper",
      "timestamp": "2025-09-02T10:30:00Z",
      "severity": "warning",
      "details": {
        "temperature": 22.46,
        "humidity": 64.21
      }
    }
  ]
}
```

**Query SQL:**
```sql
SELECT 
  d.id,
  d.hostname,
  d.location_desc,
  ds.panic1,
  ds.panic2,
  ds.box_sw,
  ds.last_seen,
  ds.temperature,
  ds.humidity,
  CASE 
    WHEN ds.panic1 = true THEN 'Pánico 1'
    WHEN ds.panic2 = true THEN 'Pánico 2'
    WHEN ds.box_sw = true THEN 'Tamper'
    WHEN ds.temperature > 35 THEN 'Temperatura alta'
    WHEN ds.humidity > 80 THEN 'Humedad alta'
    ELSE 'Alerta'
  END as alarm_type
FROM device d
INNER JOIN device_status ds ON d.id = ds.device_id
WHERE ds.panic1 = true 
   OR ds.panic2 = true 
   OR ds.box_sw = true 
   OR ds.temperature > 35
   OR ds.humidity > 80
ORDER BY ds.last_seen DESC
LIMIT 10;
```

#### 3. **GET /api/dashboard/device-health**
Devuelve distribución del estado de dispositivos.

**Respuesta esperada:**
```json
{
  "distribution": {
    "online": {
      "count": 15,
      "percentage": 71.4
    },
    "withWarnings": {
      "count": 3,
      "percentage": 14.3
    },
    "offline": {
      "count": 3,
      "percentage": 14.3
    }
  }
}
```

### Fase 2: Crear Servicios de API

#### 1. **lib/services/dashboard.service.ts**
```typescript
export class DashboardService {
  async getStats()
  async getRecentAlarms(limit: number = 10)
  async getDeviceHealth()
  async getTrends(period: 'day' | 'week' | 'month')
}
```

#### 2. **lib/hooks/useDashboard.ts**
```typescript
export function useDashboard() {
  const { data: stats } = useSWR('/api/dashboard/stats')
  const { data: alarms } = useSWR('/api/dashboard/recent-alarms')
  const { data: health } = useSWR('/api/dashboard/device-health')
  
  return { stats, alarms, health }
}
```

### Fase 3: Actualizar Componente Dashboard

#### Modificaciones en `app/(dashboard)/dashboard/page.tsx`:
1. Remover datos dummy
2. Integrar hook `useDashboard()`
3. Agregar estados de carga
4. Manejar errores
5. Implementar auto-refresh cada 30 segundos

### Fase 4: Optimizaciones

1. **Caché de consultas**: Implementar Redis para cachear estadísticas (TTL: 30s)
2. **Agregaciones programadas**: Crear job para pre-calcular estadísticas cada minuto
3. **WebSocket updates**: Actualizar dashboard en tiempo real cuando hay alarmas
4. **Índices en BD**: Agregar índices en campos frecuentemente consultados

## Prioridades de Implementación

### Alta Prioridad (Implementar ahora):
1. ✅ Endpoint `/api/dashboard/stats`
2. ✅ Endpoint `/api/dashboard/recent-alarms`
3. ✅ Hook `useDashboard`
4. ✅ Actualizar componente Dashboard

### Media Prioridad (Siguiente iteración):
1. Endpoint `/api/dashboard/device-health`
2. Gráficos históricos con datos de `device_telemetry`
3. Auto-refresh cada 30 segundos

### Baja Prioridad (Futuro):
1. WebSocket para actualizaciones en tiempo real
2. Caché con Redis
3. Agregaciones programadas

## Archivos a Crear/Modificar

### Nuevos archivos:
1. `app/api/dashboard/stats/route.ts`
2. `app/api/dashboard/recent-alarms/route.ts`
3. `app/api/dashboard/device-health/route.ts`
4. `lib/services/dashboard.service.ts`
5. `lib/hooks/useDashboard.ts`
6. `lib/types/dashboard.types.ts`

### Archivos a modificar:
1. `app/(dashboard)/dashboard/page.tsx` - Integrar datos reales
2. `prisma/schema.prisma` - Asegurar relaciones correctas

## Tiempo Estimado

- **Fase 1**: 2 horas (crear endpoints)
- **Fase 2**: 1 hora (servicios y hooks)
- **Fase 3**: 1 hora (actualizar UI)
- **Fase 4**: 2 horas (optimizaciones)

**Total**: 6 horas para implementación completa

## Notas Importantes

1. Los datos de tendencias (trends) inicialmente serán calculados comparando con el período anterior
2. Para alarmas recientes, usar `device_status` para alarmas actuales y `device_alarms` para historial
3. Considerar timezone del usuario para mostrar fechas correctamente
4. Implementar paginación en alarmas recientes para mejor performance
5. Los porcentajes de dispositivos deben calcularse dinámicamente basándose en el total real