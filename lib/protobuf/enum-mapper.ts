/**
 * Enum mappings for Protocol Buffer messages
 * Maps numeric values to human-readable strings
 */

// AlarmEvent.AlarmType enum
export const AlarmTypeMap: Record<number, string> = {
  0: 'ALARM_UNKNOWN',
  1: 'ALARM_PANIC1',
  2: 'ALARM_PANIC2',
  3: 'ALARM_TAMPER',
  4: 'ALARM_FIRE',
  5: 'ALARM_INTRUSION',
  6: 'ALARM_MEDICAL',
  7: 'ALARM_DURESS',
  10: 'OUTPUT_EVENT'
};

// AlarmEvent.EventState enum
export const EventStateMap: Record<number, string> = {
  0: 'STATE_INACTIVE',
  1: 'STATE_ACTIVE',
  2: 'STATE_TEST',
  3: 'STATE_STARTING',
  4: 'STATE_STOPPING'
};

// AlarmEvent.Priority enum
export const PriorityMap: Record<number, string> = {
  0: 'PRIORITY_LOW',
  1: 'PRIORITY_MEDIUM',
  2: 'PRIORITY_HIGH',
  3: 'PRIORITY_CRITICAL'
};

// OutputType enum (for output events)
export const OutputTypeMap: Record<number, string> = {
  0: 'OUTPUT_NONE',
  1: 'OUTPUT_SIREN',
  2: 'OUTPUT_TURRET',
  3: 'OUTPUT_RELAY1',
  4: 'OUTPUT_RELAY2',
  5: 'OUTPUT_ALL'
};

// PatternType enum (for output patterns)
export const PatternTypeMap: Record<number, string> = {
  0: 'PATTERN_NONE',
  1: 'PATTERN_SOLID',
  2: 'PATTERN_PULSE',
  3: 'PATTERN_FAST_BLINK',
  4: 'PATTERN_SLOW_BLINK',
  5: 'PATTERN_DOUBLE_PULSE',
  6: 'PATTERN_SOS',
  7: 'PATTERN_CUSTOM'
};

// CommandType enum
export const CommandTypeMap: Record<number, string> = {
  0: 'CMD_NONE',
  1: 'CMD_SYSTEM',
  2: 'CMD_CONFIG',
  3: 'CMD_OUTPUT',
  4: 'CMD_DIAGNOSTIC',
  5: 'CMD_OTA'
};

// SystemCommand enum
export const SystemCommandMap: Record<number, string> = {
  0: 'SYS_NONE',
  1: 'SYS_REBOOT',
  2: 'SYS_FACTORY_RESET',
  3: 'SYS_CLEAR_ALARMS',
  4: 'SYS_SILENCE',
  5: 'SYS_TEST_MODE'
};

// DiagnosticCommand enum
export const DiagnosticCommandMap: Record<number, string> = {
  0: 'DIAG_NONE',
  1: 'DIAG_SELF_TEST',
  2: 'DIAG_NETWORK_TEST',
  3: 'DIAG_SENSOR_TEST',
  4: 'DIAG_OUTPUT_TEST',
  5: 'DIAG_MEMORY_TEST'
};

/**
 * Map enum values in a decoded protobuf message
 */
export function mapEnumsInMessage(message: any, messageType: string): any {
  const mapped = { ...message };
  
  switch (messageType) {
    case 'alarm':
    case 'AlarmEvent':
      if (typeof mapped.type === 'number') {
        mapped.type = AlarmTypeMap[mapped.type] || `UNKNOWN_${mapped.type}`;
      }
      if (typeof mapped.state === 'number') {
        mapped.state = EventStateMap[mapped.state] || `UNKNOWN_${mapped.state}`;
      }
      if (typeof mapped.priority === 'number') {
        mapped.priority = PriorityMap[mapped.priority] || `UNKNOWN_${mapped.priority}`;
      }
      if (typeof mapped.outputType === 'number') {
        mapped.outputType = OutputTypeMap[mapped.outputType] || `UNKNOWN_${mapped.outputType}`;
      }
      if (typeof mapped.patternType === 'number') {
        mapped.patternType = PatternTypeMap[mapped.patternType] || `UNKNOWN_${mapped.patternType}`;
      }
      break;
      
    case 'resp':
    case 'response':
    case 'CommandResponse':
      if (typeof mapped.commandType === 'number') {
        mapped.commandType = CommandTypeMap[mapped.commandType] || `UNKNOWN_${mapped.commandType}`;
      }
      if (typeof mapped.systemCommand === 'number') {
        mapped.systemCommand = SystemCommandMap[mapped.systemCommand] || `UNKNOWN_${mapped.systemCommand}`;
      }
      if (typeof mapped.diagnosticCommand === 'number') {
        mapped.diagnosticCommand = DiagnosticCommandMap[mapped.diagnosticCommand] || `UNKNOWN_${mapped.diagnosticCommand}`;
      }
      break;
      
    case 'status':
    case 'login':
    case 'StatusMessage':
      // Status message doesn't have enums to map by default
      // Add any status-specific enum mappings here if needed
      break;
      
    case 'hb':
    case 'Heartbeat':
      // Heartbeat doesn't have enums to map
      break;
      
    case 'lw':
    case 'LastWillMessage':
      // LastWill doesn't have enums to map
      break;
  }
  
  return mapped;
}