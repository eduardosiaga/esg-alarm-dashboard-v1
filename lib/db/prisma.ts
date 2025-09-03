import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as Prisma.LogLevel[]
    : ['error'] as Prisma.LogLevel[],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection event handlers
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
    // Don't exit the process, allow retry on next request
  })

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('Database connection closed')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  console.log('Database connection closed')
  process.exit(0)
})

export default prisma