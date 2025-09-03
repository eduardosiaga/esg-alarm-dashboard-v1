"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
const prismaClientOptions = {
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
};
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient(prismaClientOptions);
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
// Connection event handlers
exports.prisma.$connect()
    .then(() => {
    console.log('✅ Database connected successfully');
})
    .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await exports.prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await exports.prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
});
exports.default = exports.prisma;
