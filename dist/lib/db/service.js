"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.DatabaseService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class DatabaseService {
    // Device operations
    async getDevice(macAddress) {
        return prisma_1.default.device.findUnique({
            where: { macAddress },
            include: { deviceStatus: true }
        });
    }
    async createDevice(data) {
        return prisma_1.default.device.create({
            data,
            include: { deviceStatus: true }
        });
    }
    async updateDevice(macAddress, data) {
        return prisma_1.default.device.update({
            where: { macAddress },
            data
        });
    }
    async getAllDevices() {
        return prisma_1.default.device.findMany({
            where: { active: true },
            include: { deviceStatus: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    // Device Status operations
    async upsertDeviceStatus(deviceId, data) {
        return prisma_1.default.deviceStatus.upsert({
            where: { deviceId },
            create: {
                ...data,
                device: { connect: { id: deviceId } }
            },
            update: data
        });
    }
    async getDeviceStatus(deviceId) {
        return prisma_1.default.deviceStatus.findUnique({
            where: { deviceId }
        });
    }
    // Heartbeat operations with CDC
    async createHeartbeat(data) {
        return prisma_1.default.heartbeat.create({ data });
    }
    async getLatestHeartbeat(deviceId) {
        return prisma_1.default.heartbeat.findFirst({
            where: { deviceId },
            orderBy: { time: 'desc' }
        });
    }
    async getHeartbeats(deviceId, hours = 24) {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        return prisma_1.default.heartbeat.findMany({
            where: {
                deviceId,
                time: { gte: since }
            },
            orderBy: { time: 'desc' }
        });
    }
    // Alarm Event operations
    async createAlarmEvent(data) {
        return prisma_1.default.alarmEvent.create({ data });
    }
    async getActiveAlarms(deviceId) {
        const where = {
            eventState: 'ACTIVE',
            ...(deviceId && { deviceId })
        };
        return prisma_1.default.alarmEvent.findMany({
            where,
            include: { device: true },
            orderBy: { timestamp: 'desc' }
        });
    }
    async getAlarmHistory(deviceId, days = 7) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return prisma_1.default.alarmEvent.findMany({
            where: {
                deviceId,
                timestamp: { gte: since }
            },
            orderBy: { timestamp: 'desc' }
        });
    }
    // Command Log operations
    async createCommand(data) {
        return prisma_1.default.commandLog.create({ data });
    }
    async updateCommand(requestId, data) {
        return prisma_1.default.commandLog.update({
            where: { requestId },
            data
        });
    }
    async getPendingCommands(deviceId) {
        const where = {
            status: 'PENDING',
            ...(deviceId && { deviceId })
        };
        return prisma_1.default.commandLog.findMany({
            where,
            orderBy: { timestamp: 'asc' }
        });
    }
    async getCommandHistory(deviceId, limit = 50) {
        return prisma_1.default.commandLog.findMany({
            where: { deviceId },
            orderBy: { timestamp: 'desc' },
            take: limit
        });
    }
    // Transaction support
    async transaction(fn) {
        return prisma_1.default.$transaction(fn);
    }
    // Health check
    async healthCheck() {
        try {
            await prisma_1.default.$queryRaw `SELECT 1`;
            return true;
        }
        catch {
            return false;
        }
    }
    // Metrics
    async getMetrics() {
        const [deviceCount, activeAlarms, pendingCommands] = await Promise.all([
            prisma_1.default.device.count({ where: { active: true } }),
            prisma_1.default.alarmEvent.count({ where: { eventState: 'ACTIVE' } }),
            prisma_1.default.commandLog.count({ where: { status: 'PENDING' } })
        ]);
        return {
            devices: deviceCount,
            activeAlarms,
            pendingCommands,
            timestamp: new Date()
        };
    }
}
exports.DatabaseService = DatabaseService;
// Export singleton instance
exports.db = new DatabaseService();
exports.default = exports.db;
