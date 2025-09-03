import { Device, DeviceStatus, DeviceTelemetry, DeviceAlarm, DeviceCommand, Prisma } from '@prisma/client'
import prisma from './prisma'

export class DatabaseService {
  // Device operations
  async getDevice(macAddress: string): Promise<Device | null> {
    return prisma.device.findUnique({
      where: { macAddress },
      include: { deviceStatus: true }
    })
  }

  async createDevice(data: Prisma.DeviceCreateInput): Promise<Device> {
    return prisma.device.create({
      data,
      include: { deviceStatus: true }
    })
  }

  async updateDevice(macAddress: string, data: Prisma.DeviceUpdateInput): Promise<Device> {
    return prisma.device.update({
      where: { macAddress },
      data
    })
  }

  async getAllDevices(): Promise<Device[]> {
    return prisma.device.findMany({
      where: { active: true },
      include: { deviceStatus: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Device Status operations
  async upsertDeviceStatus(deviceId: number, data: Omit<Prisma.DeviceStatusCreateInput, 'device'>): Promise<DeviceStatus> {
    return prisma.deviceStatus.upsert({
      where: { deviceId },
      create: {
        ...data,
        device: { connect: { id: deviceId } }
      },
      update: data
    })
  }

  async getDeviceStatus(deviceId: number): Promise<DeviceStatus | null> {
    return prisma.deviceStatus.findUnique({
      where: { deviceId }
    })
  }

  // Telemetry operations with CDC
  async createTelemetry(data: Prisma.DeviceTelemetryUncheckedCreateInput): Promise<DeviceTelemetry> {
    return prisma.deviceTelemetry.create({ data })
  }

  async getLatestTelemetry(deviceId: number): Promise<DeviceTelemetry | null> {
    return prisma.deviceTelemetry.findFirst({
      where: { deviceId },
      orderBy: { time: 'desc' }
    })
  }

  async getTelemetry(deviceId: number, hours: number = 24): Promise<DeviceTelemetry[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)
    return prisma.deviceTelemetry.findMany({
      where: {
        deviceId,
        time: { gte: since }
      },
      orderBy: { time: 'desc' }
    })
  }

  // Alarm operations
  async createAlarm(data: Prisma.DeviceAlarmUncheckedCreateInput): Promise<DeviceAlarm> {
    return prisma.deviceAlarm.create({ data })
  }

  async getActiveAlarms(deviceId?: number): Promise<DeviceAlarm[]> {
    const where: Prisma.DeviceAlarmWhereInput = {
      eventState: 'ACTIVE',
      ...(deviceId && { deviceId })
    }
    
    return prisma.deviceAlarm.findMany({
      where,
      include: { device: true },
      orderBy: { timestamp: 'desc' }
    })
  }

  async getAlarmHistory(deviceId: number, days: number = 7): Promise<DeviceAlarm[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return prisma.deviceAlarm.findMany({
      where: {
        deviceId,
        timestamp: { gte: since }
      },
      orderBy: { timestamp: 'desc' }
    })
  }

  // Command operations
  async createCommand(data: Prisma.DeviceCommandUncheckedCreateInput): Promise<DeviceCommand> {
    return prisma.deviceCommand.create({ data })
  }

  async updateCommand(requestId: string, data: Prisma.DeviceCommandUpdateInput): Promise<DeviceCommand> {
    return prisma.deviceCommand.update({
      where: { requestId },
      data
    })
  }

  async getPendingCommands(deviceId?: number): Promise<DeviceCommand[]> {
    const where: Prisma.DeviceCommandWhereInput = {
      status: 'PENDING',
      ...(deviceId && { deviceId })
    }
    
    return prisma.deviceCommand.findMany({
      where,
      orderBy: { timestamp: 'asc' }
    })
  }

  async getCommandHistory(deviceId: number, limit: number = 50): Promise<DeviceCommand[]> {
    return prisma.deviceCommand.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: limit
    })
  }

  // Transaction support
  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn)
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  }

  // Metrics
  async getMetrics() {
    const [deviceCount, activeAlarms, pendingCommands] = await Promise.all([
      prisma.device.count({ where: { active: true } }),
      prisma.deviceAlarm.count({ where: { eventState: 'ACTIVE' } }),
      prisma.deviceCommand.count({ where: { status: 'PENDING' } })
    ])

    return {
      devices: deviceCount,
      activeAlarms,
      pendingCommands,
      timestamp: new Date()
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()
export default db