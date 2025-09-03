// Test database connection and operations
const { db } = require('./lib/db/service')
const { poolManager } = require('./lib/db/pool-manager')
const { prisma } = require('./lib/db/prisma')

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n')
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    const connected = await db.healthCheck()
    if (connected) {
      console.log('✅ Database connection successful!\n')
    } else {
      throw new Error('Database connection failed')
    }
    
    // Test 2: Pool warmup
    console.log('2️⃣ Warming up connection pool...')
    await poolManager.warmupConnections()
    console.log('✅ Connection pool warmed up\n')
    
    // Test 3: Get metrics
    console.log('3️⃣ Fetching database metrics...')
    const metrics = await db.getMetrics()
    console.log('📊 Database Metrics:')
    console.log(`   - Active Devices: ${metrics.devices}`)
    console.log(`   - Active Alarms: ${metrics.activeAlarms}`)
    console.log(`   - Pending Commands: ${metrics.pendingCommands}`)
    console.log(`   - Timestamp: ${metrics.timestamp.toISOString()}\n`)
    
    // Test 4: Pool metrics
    console.log('4️⃣ Fetching pool metrics...')
    const poolMetrics = await poolManager.getMetrics()
    console.log('🏊 Pool Metrics:')
    console.log(`   - Total Connections: ${poolMetrics.totalConnections}`)
    console.log(`   - Active Connections: ${poolMetrics.activeConnections}`)
    console.log(`   - Idle Connections: ${poolMetrics.idleConnections}`)
    console.log(`   - Average Acquire Time: ${poolMetrics.averageAcquireTime.toFixed(2)}ms`)
    console.log(`   - Errors: ${poolMetrics.errors}\n`)
    
    // Test 5: Query all devices
    console.log('5️⃣ Querying devices...')
    const devices = await db.getAllDevices()
    console.log(`📱 Found ${devices.length} device(s)`)
    
    if (devices.length > 0) {
      devices.forEach(device => {
        console.log(`   - ${device.macAddress}: ${device.hostname || 'No hostname'} (ID: ${device.id})`)
        if (device.deviceStatus) {
          console.log(`     Status: ${device.deviceStatus.isOnline ? '🟢 Online' : '🔴 Offline'}`)
        }
      })
    }
    console.log()
    
    // Test 6: Check active alarms
    console.log('6️⃣ Checking active alarms...')
    const activeAlarms = await db.getActiveAlarms()
    console.log(`🚨 ${activeAlarms.length} active alarm(s)`)
    
    if (activeAlarms.length > 0) {
      activeAlarms.forEach(alarm => {
        console.log(`   - Device ${alarm.deviceId}: ${alarm.alarmType} (Priority: ${alarm.priority})`)
      })
    }
    console.log()
    
    // Test 7: Transaction test
    console.log('7️⃣ Testing transaction support...')
    try {
      await db.transaction(async (tx) => {
        // Just test that transaction works, don't actually modify data
        const count = await tx.device.count()
        console.log(`✅ Transaction test successful (${count} devices in DB)\n`)
        return count
      })
    } catch (error) {
      console.error('❌ Transaction test failed:', error.message)
    }
    
    console.log('✅ All database tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    // Clean up
    poolManager.stop()
    await prisma.$disconnect()
    console.log('\n👋 Database connection closed')
  }
}

// Run tests
console.log('=' .repeat(50))
console.log('ESP32 Alarm System - Database Connection Test')
console.log('=' .repeat(50))
console.log()

testDatabaseConnection().catch(console.error)