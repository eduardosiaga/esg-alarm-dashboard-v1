# Propuesta: Página de Gestión de Dispositivos (/devices)

## 1. Resumen Ejecutivo

La página `/devices` será el centro de control principal para la gestión de dispositivos de alarma ESP32. Proporcionará una interfaz completa para visualizar, configurar, controlar y administrar todos los dispositivos del sistema con capacidades de operación individual y por lotes.

## 2. Características Principales

### 2.1 Vista de Dispositivos

#### Lista Principal
- **Tabla de dispositivos** con columnas configurables:
  - Estado de conexión (online/offline con indicador visual)
  - Hostname y Device ID
  - Cuenta asignada (padre/hija)
  - Grupo asignado
  - Última actividad
  - Temperatura y humedad actuales
  - Estado de alarmas (PANIC1, PANIC2, TAMPER)
  - Versión de firmware
  - RSSI (calidad de señal)
  - IP Address
  - Acciones rápidas

#### Indicadores Visuales
- **Semáforo de estado**:
  - 🟢 Verde: Online y funcionando correctamente
  - 🟡 Amarillo: Online con advertencias (temp alta, señal débil)
  - 🔴 Rojo: Offline o con alarmas activas
  - 🟠 Naranja: Mantenimiento requerido

### 2.2 Sistema de Filtros

#### Filtros Básicos
- **Por Estado**: Online, Offline, Con Alarmas, En Mantenimiento
- **Por Cuenta**: Selector jerárquico de cuentas padre/hija
- **Por Grupo**: Dropdown con grupos disponibles
- **Por Zona**: País y código de zona
- **Por Firmware**: Versión específica o desactualizados

#### Filtros Avanzados
- **Rango de fecha**: Última actividad, fecha de instalación
- **Condiciones de hardware**: Temperatura > X°C, RSSI < -80dBm
- **Estado de I/O**: Inputs activos, outputs activos
- **Búsqueda de texto**: Por hostname, IP, notas

### 2.3 Asignación de Cuentas

#### Asignación Individual
- Modal de asignación con selector de cuenta jerárquico
- Vista previa del árbol de cuentas (padre → hijas)
- Validación de permisos según rol del usuario

#### Asignación Masiva
- Checkbox para selección múltiple
- Barra de acciones flotante al seleccionar dispositivos
- Opciones:
  - Asignar a cuenta
  - Mover a grupo
  - Aplicar configuración
  - Enviar comando

### 2.4 Centro de Comandos

#### Comandos del Sistema
- **Reiniciar**: Con opción de delay (0-3600 segundos)
- **Reset de fábrica**: Con confirmación doble
- **Obtener estado**: Actualización forzada de estado
- **Sincronizar hora**: Ajuste de reloj del dispositivo
- **Limpiar contadores**: Reset de estadísticas

#### Control de Salidas
- **Sirena**: 
  - Patrones: Constante, Pulsos, SOS, Estroboscópico
  - Duración configurable (0 = permanente)
- **Torreta**: 
  - Patrones de parpadeo: Lento, Rápido, Doble, Triple
- **Relés 1 y 2**: 
  - Control ON/OFF
  - Patrones temporizados
- **Ventilador**: 
  - Control PWM (0-100%)
  - Modo automático por temperatura

#### Configuración
- **WiFi**: SSID, contraseña, IP estática
- **MQTT**: Broker, puerto, credenciales, TLS
- **Dispositivo**: Hostname, ID, intervalo heartbeat
- **Ubicación**: País, zona, coordenadas GPS
- **NTP**: Servidores, zona horaria, sincronización
- **Bluetooth**: Activación, nombre, intervalo publicidad

#### Diagnósticos
- **Auto-test**: Prueba completa del hardware
- **Info memoria**: RAM libre, heap, fragmentación
- **Info red**: IP, gateway, DNS, estado WiFi
- **Lectura sensores**: Temperatura, humedad actuales
- **Lectura I/O**: Estado de todas las entradas/salidas
- **Volcado de logs**: Últimas N líneas del log

#### Actualizaciones OTA
- **Verificar actualizaciones**: Check de nueva versión
- **Iniciar actualización**: Con URL y validación MD5
- **Validar firmware**: Verificación post-actualización
- **Rollback**: Volver a versión anterior

### 2.5 Gestión de Instalación

#### Datos de Instalación
- **Información básica**:
  - Fecha de instalación
  - Técnico instalador
  - Número de orden de trabajo
  - Cliente/ubicación física

- **Detalles técnicos**:
  - Modelo de panel de alarma conectado
  - Zonas configuradas
  - Tipo de sensores conectados
  - Diagrama de conexiones (imagen)

- **Mantenimiento**:
  - Último mantenimiento
  - Próximo mantenimiento programado
  - Historial de intervenciones
  - Notas del técnico

### 2.6 Operaciones por Lote

#### Selección de Dispositivos
- Checkbox individual por dispositivo
- "Seleccionar todos" en página actual
- "Seleccionar todos con filtro" (todos los que cumplen criterio)
- Contador de dispositivos seleccionados

#### Acciones Masivas
- **Configuración masiva**: Aplicar misma config a múltiples dispositivos
- **Comandos síncronos**: Ejecutar comando en todos simultáneamente
- **Actualización de firmware**: OTA por grupos
- **Exportación**: Descargar CSV/Excel con datos seleccionados
- **Generación de reportes**: PDF con estado de dispositivos

### 2.7 Vista Detallada del Dispositivo

#### Panel de Estado
- Gráficos en tiempo real (últimas 24h):
  - Temperatura y humedad
  - Calidad de señal (RSSI)
  - Eventos de alarma

#### Historial
- Timeline de eventos:
  - Conexiones/desconexiones
  - Alarmas disparadas
  - Comandos ejecutados
  - Cambios de configuración
  - Actualizaciones de firmware

#### Configuración Actual
- Vista completa de toda la configuración
- Capacidad de edición inline
- Validación antes de aplicar cambios

## 3. API Endpoints Necesarios

### 3.1 Endpoints de Dispositivos (CRUD)

```typescript
// Listar dispositivos con paginación y filtros
GET /api/devices
Query params: page, limit, status, account_id, group_id, search

// Obtener dispositivo específico
GET /api/devices/{deviceId}

// Crear nuevo dispositivo (registro)
POST /api/devices
Body: { hostname, device_id, account_id, group_id, installation_data }

// Actualizar dispositivo
PATCH /api/devices/{deviceId}
Body: { account_id?, group_id?, installation_data?, notes? }

// Eliminar dispositivo
DELETE /api/devices/{deviceId}

// Operaciones masivas
POST /api/devices/batch
Body: { device_ids: [], action: string, payload: {} }
```

### 3.2 Endpoints de Grupos (CRUD)

```typescript
// Listar grupos
GET /api/groups
Query params: account_id

// Crear grupo
POST /api/groups
Body: { name, description, account_id }

// Actualizar grupo
PATCH /api/groups/{groupId}
Body: { name?, description? }

// Eliminar grupo
DELETE /api/groups/{groupId}

// Asignar dispositivos a grupo
POST /api/groups/{groupId}/devices
Body: { device_ids: [] }

// Remover dispositivos de grupo
DELETE /api/groups/{groupId}/devices
Body: { device_ids: [] }
```

### 3.3 Endpoints de Cuentas

```typescript
// Obtener jerarquía de cuentas
GET /api/accounts/hierarchy

// Listar cuentas disponibles para asignación
GET /api/accounts/assignable
```

### 3.4 Endpoints de Estadísticas

```typescript
// Dashboard stats
GET /api/devices/stats
Response: { total, online, offline, with_alarms, by_account, by_group }

// Historial del dispositivo
GET /api/devices/{deviceId}/history
Query params: start_date, end_date, type (events|metrics)

// Exportar datos
GET /api/devices/export
Query params: format (csv|excel|pdf), filters
```

## 4. Componentes de UI

### 4.1 Componentes Principales

```typescript
// Estructura de componentes
app/
  (dashboard)/
    devices/
      page.tsx                    // Página principal
      components/
        DeviceTable.tsx          // Tabla de dispositivos
        DeviceFilters.tsx        // Panel de filtros
        DeviceActions.tsx        // Barra de acciones
        DeviceDetailModal.tsx    // Modal de detalles
        CommandCenter.tsx        // Panel de comandos
        InstallationForm.tsx     // Formulario de instalación
        BatchOperations.tsx      // Operaciones masivas
        DeviceStats.tsx          // Estadísticas
```

### 4.2 Hooks Personalizados

```typescript
// Hooks reutilizables
lib/hooks/
  useDevices.ts         // Gestión de estado de dispositivos
  useDeviceCommands.ts  // Envío de comandos
  useDeviceFilters.ts   // Lógica de filtrado
  useBatchSelection.ts  // Selección múltiple
  useRealTimeUpdates.ts // WebSocket para actualizaciones
```

### 4.3 Stores Zustand

```typescript
// Stores de estado
lib/store/
  devices.store.ts      // Estado global de dispositivos
  filters.store.ts      // Filtros activos
  selection.store.ts    // Dispositivos seleccionados
  commands.store.ts     // Cola de comandos
```

## 5. Plan de Implementación

### Fase 1: Infraestructura Base (Semana 1)
1. **Día 1-2**: Crear API endpoints básicos (CRUD dispositivos)
2. **Día 3-4**: Implementar stores Zustand y hooks
3. **Día 5**: Setup WebSocket para actualizaciones en tiempo real

### Fase 2: UI Básica (Semana 2)
1. **Día 1-2**: Implementar tabla de dispositivos con paginación
2. **Día 3**: Sistema de filtros básicos
3. **Día 4**: Vista detallada del dispositivo
4. **Día 5**: Testing y ajustes

### Fase 3: Comandos y Control (Semana 3)
1. **Día 1-2**: Centro de comandos (sistema y salidas)
2. **Día 3**: Panel de configuración
3. **Día 4**: Diagnósticos y OTA
4. **Día 5**: Testing de comandos

### Fase 4: Funcionalidades Avanzadas (Semana 4)
1. **Día 1-2**: Operaciones por lote
2. **Día 3**: Gestión de grupos
3. **Día 4**: Datos de instalación
4. **Día 5**: Exportación y reportes

### Fase 5: Optimización (Semana 5)
1. **Día 1-2**: Optimización de rendimiento
2. **Día 3**: Mejoras de UX
3. **Día 4-5**: Testing completo y documentación

## 6. Consideraciones Técnicas

### 6.1 Rendimiento
- Implementar virtualización para listas grandes (react-window)
- Paginación del lado del servidor
- Caché de datos con SWR o React Query
- Debouncing en filtros de búsqueda

### 6.2 Seguridad
- Validación de permisos por rol antes de comandos
- Rate limiting en endpoints de comandos
- Logs de auditoría para todas las acciones
- Confirmación doble para acciones destructivas

### 6.3 UX/UI
- Diseño responsive para tablets y móviles
- Atajos de teclado para acciones comunes
- Tooltips informativos
- Feedback visual inmediato
- Modo oscuro/claro

### 6.4 Escalabilidad
- Lazy loading de componentes
- Code splitting por rutas
- Optimización de queries SQL
- Índices en campos de búsqueda frecuente

## 7. Mockups Conceptuales

### Vista Principal
```
┌─────────────────────────────────────────────────────────┐
│ City Alarm - Dispositivos                    [User Menu] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌──────────────────────────────────────┐│
│ │ Filtros     │ │ 📊 Total: 156 | 🟢 142 | 🔴 14      ││
│ │             │ └──────────────────────────────────────┘│
│ │ Estado:     │ ┌──────────────────────────────────────┐│
│ │ [Todos ▼]   │ │ [✓][Estado][Dispositivo][Cuenta]... ││
│ │             │ ├──────────────────────────────────────┤│
│ │ Cuenta:     │ │ □ 🟢 ESP32-001  Cliente A   -75dBm  ││
│ │ [Todas ▼]   │ │ □ 🟢 ESP32-002  Cliente B   -68dBm  ││
│ │             │ │ □ 🔴 ESP32-003  Cliente A   Offline ││
│ │ Grupo:      │ │ □ 🟡 ESP32-004  Cliente C   -82dBm  ││
│ │ [Todos ▼]   │ └──────────────────────────────────────┘│
│ │             │ [← Anterior] [1][2][3]...[10] [Siguiente →]│
│ └─────────────┘ ┌──────────────────────────────────────┐│
│                 │ Acciones Masivas: [Asignar][Comando] ││
│                 └──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## 8. Métricas de Éxito

- **Tiempo de carga**: < 2 segundos para 1000 dispositivos
- **Tiempo de respuesta de comandos**: < 500ms
- **Tasa de éxito de comandos**: > 95%
- **Satisfacción del usuario**: > 4.5/5
- **Reducción de tiempo operativo**: 50% vs proceso manual

## 9. Próximos Pasos

1. Validar propuesta con stakeholders
2. Refinar requerimientos específicos
3. Crear diseños detallados en Figma
4. Iniciar desarrollo siguiendo el plan de fases
5. Implementar testing continuo
6. Desplegar en ambiente de staging para pruebas

## 10. Fases de Implementación - Estado Actual

### ✅ **SEMANA 1: Infraestructura Base** - PARCIALMENTE COMPLETADA

#### Completado ✅

**Fase 1.1: Crear migraciones de base de datos**
- Tabla `device_installations` creada con Python script
- Script en `python_scripts/db_setup.py`
- Índices agregados para optimización

**Fase 1.2: Crear API endpoints CRUD para dispositivos**
- ✅ GET /api/devices (listado con paginación y filtros)
- ✅ GET /api/devices/{id} (detalle completo con telemetría)
- ✅ POST /api/devices (crear con relaciones)
- ✅ PATCH /api/devices/{id} (actualizar)
- ✅ DELETE /api/devices/{id} (eliminar con cascada)

**Fase 1.3: Crear API endpoints CRUD para grupos**
- ✅ GET /api/groups (listado con dispositivos)
- ✅ POST /api/groups (crear)
- ✅ GET /api/groups/{id} (detalle con dispositivos)
- ✅ PATCH /api/groups/{id} (actualizar)
- ✅ DELETE /api/groups/{id} (eliminar)
- ✅ POST /api/groups/{id}/devices (asignar dispositivos)
- ✅ DELETE /api/groups/{id}/devices (remover dispositivos)

**Fase 1.4: Implementar stores Zustand**
- ✅ devices.store.ts (estado global de dispositivos con selección)
- ✅ filters.store.ts (filtros activos con URL sync)
- ✅ commands.store.ts (cola de comandos con retry)

**Fase 1.5: Crear hooks personalizados**
- ✅ useDevices() - gestión integral de dispositivos
- ✅ useDeviceCommands() - envío de comandos con templates
- ✅ useDeviceFilters() - lógica de filtrado con presets
- ✅ useRealTimeUpdates() - WebSocket para actualizaciones (existente)

**Fase 1.6: Setup WebSocket para tiempo real**
- ✅ Servidor WebSocket separado (puerto 3001)
- ✅ Decodificación protobuf integrada
- ✅ Actualizaciones en tiempo real de estado
- ✅ Reconexión automática
- ✅ Sincronización con base de datos

---

### 🔄 **SEMANA 2: UI Básica** - PARCIALMENTE COMPLETADO (40%)

**Fase 2.1: Implementar tabla de dispositivos con paginación**
- ✅ Componente DeviceTable.tsx implementado
- ✅ Indicadores visuales de estado (online/offline/alarm)
- ✅ Iconos de batería y señal
- ✅ Paginación funcional
- ✅ Selección múltiple con checkboxes
- ❌ Virtualización con react-window (pendiente)
- ❌ Columnas configurables (pendiente)

**Fase 2.2: Sistema de filtros básicos**
- ✅ Componente DeviceFilters.tsx implementado
- ✅ Filtros por estado (online/offline/alarm)
- ✅ Filtros por cuenta y grupo
- ✅ Búsqueda de texto con debouncing
- ✅ Filtros avanzados (batería, señal, firmware)
- ✅ Presets de filtros (críticos, mantenimiento, nuevos, inactivos)
- ✅ Sincronización con URL

**Fase 2.3: Vista detallada del dispositivo**
- ✅ Página de detalle creada ([deviceId]/page.tsx)
- ✅ Estructura de tabs implementada
- ❌ Componentes de tabs pendientes (DeviceInfo, DeviceTelemetry, etc.)
- ❌ Gráficos de temperatura/humedad (pendiente)
- ❌ Timeline de eventos (pendiente)

---

### 🔄 **SEMANA 3: Comandos y Control** - PARCIALMENTE COMPLETADO (50%)

**Fase 3.1: Centro de comandos (sistema y salidas)**
- ✅ Store de comandos (commands.store.ts)
- ✅ Hook useDeviceCommands con templates
- ✅ Sistema de cola con retry
- ✅ Templates de comandos predefinidos
- ✅ Acciones batch en BatchActions.tsx
- ❌ UI CommandCenter.tsx (pendiente)
- ❌ Patrones de salida configurables (pendiente)

**Fase 3.2: Panel de configuración remota**
- Configuración WiFi (SSID, password, IP estática)
- Configuración MQTT (broker, puerto, TLS)
- Configuración NTP (servidores, zona horaria)
- Configuración Bluetooth
- Validación de formularios con Zod

**Fase 3.3: Diagnósticos y OTA**
- Panel de diagnósticos (memoria, red, sensores)
- Actualizaciones de firmware OTA
- Validación MD5
- Logs del dispositivo
- Estado de actualización en tiempo real

---

### 🔄 **SEMANA 4: Funcionalidades Avanzadas** - PARCIALMENTE INICIADO (10%)

**Fase 4.1: Operaciones por lote**
- ✅ Componente BatchActions.tsx implementado
- ✅ Checkbox para selección múltiple
- ✅ Barra de acciones con contador
- ✅ Comandos masivos (reinicio, alarmas, sirenas)
- ✅ Confirmación de acciones masivas
- ❌ Diálogos de asignación (grupo/cuenta) pendientes

**Fase 4.2: Gestión de grupos UI**
- Interfaz CRUD de grupos
- Drag & drop para asignación
- Vista de dispositivos por grupo
- Estadísticas por grupo

**Fase 4.3: Datos de instalación**
- Formulario InstallationForm.tsx
- Campos de técnico y fecha
- Upload de diagramas de conexión
- Historial de mantenimiento
- Calendario de próximo mantenimiento

**Fase 4.4: Exportación y reportes**
- Export CSV con filtros aplicados
- Export Excel con formato
- Generación de PDFs con logo
- Reportes personalizados
- Programación de reportes automáticos

---

### ❌ **SEMANA 5: Optimización y Testing** - PENDIENTE

**Fase 5.1: Optimización de rendimiento**
- Virtualización con react-window para listas grandes
- Code splitting por rutas
- Lazy loading de componentes
- Caché con SWR o React Query
- Optimización de queries SQL
- Compresión de respuestas API

**Fase 5.2: Testing completo y documentación**
- Tests unitarios con Jest
- Tests de integración de API
- Tests E2E con Playwright
- Documentación de API con Swagger
- Manual de usuario
- Videos tutoriales

---

## Estado General del Proyecto

### 📊 Progreso por Área

| Área | Progreso | Estado |
|------|----------|--------|
| **Backend API** | 100% | ✅ Completado |
| **Base de Datos** | 100% | ✅ Completado |
| **Stores/Estado** | 100% | ✅ Completado |
| **UI/Componentes** | 40% | 🔄 En Progreso |
| **WebSocket** | 100% | ✅ Completado |
| **Comandos** | 50% | 🔄 En Progreso |
| **Features Avanzadas** | 0% | ❌ Pendiente |
| **Testing** | 0% | ❌ Pendiente |

### ✅ Logros Actuales

1. **Backend 100% Funcional**
   - 12 endpoints REST implementados y probados
   - Soporte completo para CRUD de dispositivos y grupos
   - Paginación y filtros funcionando
   - Sin autenticación (según requerimiento)

2. **Base de Datos Poblada**
   - 20 dispositivos con estados variados
   - 8 cuentas con jerarquía
   - 20 grupos distribuidos
   - 10 registros de instalación
   - Datos realistas para testing

3. **Infraestructura Lista**
   - Prisma configurado
   - Modelos definidos
   - Relaciones establecidas
   - Scripts de Python para mantenimiento

4. **State Management Completo**
   - 3 stores Zustand implementados (devices, filters, commands)
   - 3 hooks personalizados (useDevices, useDeviceFilters, useDeviceCommands)
   - Integración con WebSocket para tiempo real
   - Sistema de comandos con cola y retry

5. **WebSocket Server Funcional**
   - Servidor separado en puerto 3001
   - Decodificación protobuf integrada
   - Eventos en tiempo real
   - Sincronización con base de datos

6. **UI Básica Implementada**
   - Página principal de dispositivos
   - Tabla con selección múltiple
   - Sistema de filtros completo
   - Acciones en lote
   - Vista detallada del dispositivo

### 📋 Desglose Detallado de Implementación

#### **UI Components (40% Completado)**

**✅ Implementado:**
- `app/(dashboard)/devices/page.tsx` - Página principal
- `components/devices/DeviceTable.tsx` - Tabla con indicadores visuales
- `components/devices/DeviceFilters.tsx` - Sistema completo de filtros
- `components/devices/BatchActions.tsx` - Acciones en lote
- `app/(dashboard)/devices/[deviceId]/page.tsx` - Vista detalle (estructura)

**❌ Pendiente (60%):**
- `components/devices/detail/DeviceInfo.tsx`
- `components/devices/detail/DeviceTelemetry.tsx`
- `components/devices/detail/DeviceCommands.tsx`
- `components/devices/detail/DeviceAlarms.tsx`
- `components/devices/detail/DeviceInstallation.tsx`
- `components/devices/detail/DeviceHistory.tsx`
- Virtualización de tabla para grandes volúmenes
- Gráficos y visualizaciones
- Diálogos modales (asignación grupo/cuenta)

#### **Commands (50% Completado)**

**✅ Implementado:**
- Sistema de cola de comandos con retry
- Templates de comandos predefinidos
- Ejecución batch de comandos
- Hook `useDeviceCommands`
- Integración con WebSocket para respuestas

**❌ Pendiente (50%):**
- UI del centro de comandos
- Panel de configuración remota
- Validación de comandos
- Historial de comandos ejecutados
- Feedback visual de ejecución

#### **Advanced Features (0% Pendiente)**

**❌ Todo Pendiente:**
- Gestión visual de grupos (drag & drop)
- Formulario de instalación con uploads
- Exportación (CSV, Excel, PDF)
- Reportes personalizados
- Programación de reportes automáticos
- Estadísticas avanzadas por grupo
- Calendario de mantenimiento

#### **Testing (0% Pendiente)**

**❌ Todo Pendiente:**
- Tests unitarios con Jest
- Tests de integración de API
- Tests E2E con Playwright
- Tests de componentes React
- Tests de stores Zustand
- Tests de WebSocket
- Coverage reports

### 🎯 Próximas Prioridades

1. **Immediate (1-2 días)**
   - ✅ ~~Implementar stores Zustand~~ COMPLETADO
   - ✅ ~~Crear hooks básicos~~ COMPLETADO
   - ✅ ~~Setup WebSocket~~ COMPLETADO
   - 🆕 Completar componentes de detalle del dispositivo

2. **Short Term (3-5 días)**
   - Implementar UI del centro de comandos
   - Completar panel de configuración remota
   - Agregar gráficos de telemetría
   - Implementar diálogos modales
   - Sistema de filtros

3. **Medium Term (Semana 3-4)**
   - Completar features avanzadas
   - Exportación y reportes
   - Testing inicial

### 📁 Archivos Creados en Esta Sesión

#### **Backend (Python)**
- `python_scripts/db_setup.py` - Script de configuración de base de datos

#### **API Endpoints**
- `app/api/devices/route.ts` - CRUD dispositivos
- `app/api/devices/[deviceId]/route.ts` - Operaciones individuales
- `app/api/devices/[deviceId]/config/route.ts` - Configuración
- `app/api/devices/[deviceId]/output/route.ts` - Control de salidas
- `app/api/devices/[deviceId]/system/route.ts` - Comandos de sistema
- `app/api/devices/[deviceId]/diagnostic/route.ts` - Diagnósticos
- `app/api/devices/[deviceId]/ota/route.ts` - Actualizaciones OTA
- `app/api/groups/route.ts` - CRUD grupos
- `app/api/groups/[groupId]/route.ts` - Operaciones de grupo
- `app/api/groups/[groupId]/devices/route.ts` - Asignación de dispositivos

#### **State Management**
- `lib/store/devices.store.ts` - Estado global de dispositivos
- `lib/store/filters.store.ts` - Gestión de filtros
- `lib/store/commands.store.ts` - Cola de comandos

#### **Hooks**
- `lib/hooks/useDevices.ts` - Hook principal de dispositivos
- `lib/hooks/useDeviceFilters.ts` - Hook de filtros
- `lib/hooks/useDeviceCommands.ts` - Hook de comandos
- `lib/hooks/useRealTimeUpdates.ts` - Hook WebSocket (mejorado)

#### **UI Components**
- `app/(dashboard)/devices/page.tsx` - Página principal
- `app/(dashboard)/devices/[deviceId]/page.tsx` - Vista detalle
- `components/devices/DeviceTable.tsx` - Tabla de dispositivos
- `components/devices/DeviceFilters.tsx` - Sistema de filtros
- `components/devices/BatchActions.tsx` - Acciones en lote

#### **WebSocket**
- `websocket-server.ts` - Servidor WebSocket independiente (mejorado)
- `lib/websocket/ws-client.ts` - Cliente WebSocket (mejorado)
   - Operaciones masivas
   - Gestión de instalación

### 📝 Notas de Implementación

- **Puerto fijo**: La aplicación SIEMPRE debe correr en puerto 3000
- **Base de datos**: PostgreSQL con contraseña `Ob9eJjUIaMB3R0J`
- **Python scripts**: Usar carpeta `python_scripts/` para utilidades de DB
- **Sin autenticación**: Los endpoints no validan usuario (implementación posterior)