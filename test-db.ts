// Simple database connection test
import { db } from './lib/db/service'
import { poolManager } from './lib/db/pool-manager'
import { prisma } from './lib/db/prisma'

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n')
  
  try {
    // Test basic connection
    console.log('1️⃣ Testing basic connection...')
    const connected = await db.healthCheck()
    console.log(connected ? '✅ Connected!' : '❌ Failed')
    
    // Get metrics
    console.log('\n2️⃣ Database metrics:')
    const metrics = await db.getMetrics()
    console.log(metrics)
    
    // Query devices
    console.log('\n3️⃣ Querying devices...')
    const devices = await db.getAllDevices()
    console.log(`Found ${devices.length} device(s)`)
    
    console.log('\n✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    poolManager.stop()
    await prisma.$disconnect()
    console.log('\n👋 Connection closed')
  }
}

testConnection()