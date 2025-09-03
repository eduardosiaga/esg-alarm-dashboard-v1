# PgBouncer Setup Guide

## Overview
PgBouncer is a lightweight connection pooler for PostgreSQL that helps manage database connections efficiently, reducing overhead and improving application performance.

## Installation

### Windows
```bash
# Download PgBouncer for Windows from:
# https://www.pgbouncer.org/downloads/

# Or use WSL2 with Ubuntu:
wsl --install
# Then follow Linux instructions
```

### Linux/Ubuntu
```bash
sudo apt-get update
sudo apt-get install pgbouncer
```

### macOS
```bash
brew install pgbouncer
```

## Configuration

### 1. Database Configuration
Edit `.env` to use PgBouncer connection:

```env
# Direct connection (for migrations)
DIRECT_DATABASE_URL="postgresql://postgres:Ob9eJjUIaMB3R0J@localhost:5432/esag-alarm-db?schema=public"

# PgBouncer connection (for application)
DATABASE_URL="postgresql://postgres:Ob9eJjUIaMB3R0J@localhost:6432/esag-alarm-db?schema=public&pgbouncer=true"
```

### 2. PgBouncer Configuration
The configuration files are in `config/` directory:
- `pgbouncer.ini` - Main configuration
- `users.txt` - User authentication

### 3. Generate MD5 Password Hash
For the users.txt file, generate MD5 hash:

```sql
-- In PostgreSQL
SELECT 'md5' || md5('Ob9eJjUIaMB3R0J' || 'postgres');
-- Result: md532659f35e2f31d724aeafc64220aceb47
```

## Running PgBouncer

### Start PgBouncer
```bash
# Using config file
pgbouncer -d config/pgbouncer.ini

# Or in foreground for testing
pgbouncer config/pgbouncer.ini
```

### Check Status
```bash
# Connect to PgBouncer admin console
psql -h localhost -p 6432 -U postgres pgbouncer

# Show pools
SHOW POOLS;

# Show stats
SHOW STATS;

# Show databases
SHOW DATABASES;

# Show configuration
SHOW CONFIG;
```

### Stop PgBouncer
```bash
# Find PgBouncer process
ps aux | grep pgbouncer

# Kill process
kill -TERM <pid>
```

## Prisma Configuration for PgBouncer

### Update Prisma Schema
Add pgbouncer-specific settings:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

### Connection Modes

1. **Transaction Mode** (Recommended)
   - Each transaction gets a connection
   - Best for web applications
   - Most efficient pooling

2. **Session Mode**
   - Connection persists for entire session
   - Required for prepared statements
   - Less efficient pooling

3. **Statement Mode**
   - Connection per statement
   - Most aggressive pooling
   - Limited feature support

## Production Recommendations

### Pool Sizing
```ini
# Based on formula: connections = ((core_count * 2) + effective_spindle_count)
default_pool_size = 20  # For 8-core server
max_client_conn = 200   # Maximum application connections
max_db_connections = 100  # Maximum PostgreSQL connections
```

### Monitoring
- Monitor connection usage: `SHOW POOLS`
- Check wait times: `SHOW STATS`
- Watch for connection exhaustion
- Set up alerts for high wait times

### Security
1. Use SSL/TLS in production
2. Restrict listen address
3. Use strong passwords
4. Regular security updates

## Troubleshooting

### Common Issues

1. **"no more connections allowed"**
   - Increase `max_client_conn`
   - Check for connection leaks

2. **"query_wait_timeout"**
   - Increase pool size
   - Optimize slow queries

3. **"server_login_retry"**
   - Check PostgreSQL is running
   - Verify credentials

4. **Prisma prepared statement errors**
   - Use `pgbouncer=true` in connection string
   - Consider session mode for complex queries

### Performance Tuning

```ini
# Optimal settings for 100+ devices
pool_mode = transaction
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 10
max_client_conn = 300
server_idle_timeout = 600
```

## Integration with Application

### Health Check Endpoint
```typescript
// Check both direct and pooled connections
async function healthCheck() {
  const directOk = await checkDirectConnection()
  const pooledOk = await checkPooledConnection()
  const pgbouncerOk = await checkPgBouncerStats()
  
  return {
    direct: directOk,
    pooled: pooledOk,
    pgbouncer: pgbouncerOk
  }
}
```

### Connection String Management
```typescript
// Use appropriate connection based on operation
const getConnectionUrl = (operation: 'query' | 'migration') => {
  return operation === 'migration' 
    ? process.env.DIRECT_DATABASE_URL
    : process.env.DATABASE_URL
}
```

## Monitoring Script

Create `monitor-pgbouncer.sh`:
```bash
#!/bin/bash
while true; do
  echo "=== PgBouncer Stats ==="
  psql -h localhost -p 6432 -U postgres -c "SHOW POOLS;" pgbouncer
  psql -h localhost -p 6432 -U postgres -c "SHOW STATS;" pgbouncer
  sleep 10
done
```

## Docker Setup (Optional)

```dockerfile
# docker-compose.yml
services:
  pgbouncer:
    image: pgbouncer/pgbouncer:latest
    environment:
      DATABASES_HOST: postgres
      DATABASES_PORT: 5432
      DATABASES_DBNAME: esag-alarm-db
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 200
      DEFAULT_POOL_SIZE: 20
    ports:
      - "6432:6432"
    volumes:
      - ./config/pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini
      - ./config/users.txt:/etc/pgbouncer/users.txt
```