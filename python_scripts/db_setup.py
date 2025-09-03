import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta
import random
import json

# Database connection
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'esag-alarm-db',
    'user': 'postgres',
    'password': 'Ob9eJjUIaMB3R0J'
}

def get_connection():
    """Create database connection"""
    return psycopg2.connect(**DB_CONFIG)

def create_device_installations_table():
    """Create device_installations table if it doesn't exist"""
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Check if table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'device_installations'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            print("Creating device_installations table...")
            cursor.execute("""
                CREATE TABLE device_installations (
                    id SERIAL PRIMARY KEY,
                    device_id INTEGER UNIQUE REFERENCES device(id) ON DELETE CASCADE,
                    installation_date TIMESTAMPTZ,
                    technician_name VARCHAR(255),
                    work_order VARCHAR(100),
                    client_location TEXT,
                    panel_model VARCHAR(100),
                    configured_zones TEXT,
                    connected_sensors TEXT,
                    connection_diagram_url TEXT,
                    last_maintenance TIMESTAMPTZ,
                    next_maintenance TIMESTAMPTZ,
                    maintenance_history JSONB,
                    technician_notes TEXT,
                    warranty_expiry DATE,
                    installation_status VARCHAR(50),
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            # Create indexes
            cursor.execute("""
                CREATE INDEX idx_device_installations_device_id ON device_installations(device_id);
                CREATE INDEX idx_device_installations_installation_date ON device_installations(installation_date);
                CREATE INDEX idx_device_installations_next_maintenance ON device_installations(next_maintenance);
            """)
            
            conn.commit()
            print("[OK] device_installations table created successfully")
        else:
            print("[INFO] device_installations table already exists")
            
    except Exception as e:
        print(f"[ERROR] Error creating table: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def create_sample_accounts():
    """Create sample accounts if they don't exist"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Check if accounts exist
        cursor.execute("SELECT COUNT(*) as count FROM auth_accounts")
        count = cursor.fetchone()['count']
        
        if count == 0:
            print("Creating sample accounts...")
            
            # Create parent accounts
            accounts = [
                ('Empresa Matriz', 'matriz.com'),
                ('Sucursal Norte', 'norte.com'),
                ('Sucursal Sur', 'sur.com'),
                ('Cliente Premium', 'premium.com'),
                ('Cliente Standard', 'standard.com')
            ]
            
            for name, domain in accounts:
                cursor.execute("""
                    INSERT INTO auth_accounts (name, email_domain, is_active)
                    VALUES (%s, %s, true)
                    RETURNING id
                """, (name, domain))
                
            # Create child accounts
            cursor.execute("SELECT id FROM auth_accounts WHERE name = 'Empresa Matriz'")
            parent_id = cursor.fetchone()['id']
            
            child_accounts = [
                ('Oficina Central', 'oficina.matriz.com', parent_id),
                ('Almacén Principal', 'almacen.matriz.com', parent_id),
                ('Área Técnica', 'tecnica.matriz.com', parent_id)
            ]
            
            for name, domain, parent in child_accounts:
                cursor.execute("""
                    INSERT INTO auth_accounts (name, email_domain, parent_account_id, is_active)
                    VALUES (%s, %s, %s, true)
                """, (name, domain, parent))
            
            conn.commit()
            print("[OK] Sample accounts created successfully")
        else:
            print(f"[INFO] Accounts already exist ({count} found)")
            
    except Exception as e:
        print(f"[ERROR] Error creating accounts: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def create_sample_groups():
    """Create sample groups"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Get accounts
        cursor.execute("SELECT id, name FROM auth_accounts LIMIT 5")
        accounts = cursor.fetchall()
        
        if accounts:
            for account in accounts:
                # Check if groups exist for this account
                cursor.execute("""
                    SELECT COUNT(*) as count 
                    FROM group_definitions 
                    WHERE account_id = %s
                """, (account['id'],))
                
                count = cursor.fetchone()['count']
                
                if count == 0:
                    groups = [
                        f"Zona A - {account['name'][:10]}",
                        f"Zona B - {account['name'][:10]}",
                        f"Críticos - {account['name'][:10]}",
                        f"Mantenimiento - {account['name'][:10]}"
                    ]
                    
                    for group_name in groups:
                        cursor.execute("""
                            INSERT INTO group_definitions (account_id, name, description, created_by)
                            VALUES (%s, %s, %s, 1)
                        """, (
                            account['id'],
                            group_name,
                            f"Grupo {group_name} para gestión de dispositivos",
                        ))
            
            conn.commit()
            print("[OK] Sample groups created successfully")
        else:
            print("[WARNING] No accounts found to create groups")
            
    except Exception as e:
        print(f"[ERROR] Error creating groups: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def create_sample_devices():
    """Create sample devices with varying states"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Check current device count
        cursor.execute("SELECT COUNT(*) as count FROM device")
        existing_count = cursor.fetchone()['count']
        
        if existing_count < 20:  # Create devices if less than 20
            print(f"Creating sample devices (current: {existing_count})...")
            
            # Get accounts and groups
            cursor.execute("SELECT id FROM auth_accounts")
            accounts = [row['id'] for row in cursor.fetchall()]
            
            cursor.execute("SELECT id, account_id FROM group_definitions")
            groups = cursor.fetchall()
            
            # Device templates
            cities = ['CDMX', 'GDL', 'MTY', 'PUE', 'QRO']
            zones = [1, 2, 3, 4, 5]
            panel_models = ['DSC PowerSeries', 'Honeywell Vista', 'Paradox EVO', 'Bosch B Series', 'DMP XR150']
            
            for i in range(20 - existing_count):
                mac = f"AA:BB:CC:DD:{i:02X}:{random.randint(0, 255):02X}"
                hostname = f"ESP32-ALARM-{i+existing_count+1:03d}"
                city = random.choice(cities)
                zone = random.choice(zones)
                
                # Create device
                cursor.execute("""
                    INSERT INTO device (
                        mac_address, hostname, country, zone,
                        latitude, longitude, location_desc,
                        installation_date, notes, active, created_at, updated_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
                    RETURNING id
                """, (
                    mac,
                    hostname,
                    'MEX',
                    zone,
                    19.4326 + random.uniform(-0.5, 0.5),  # CDMX area
                    -99.1332 + random.uniform(-0.5, 0.5),
                    f"Ubicación {city} - Zona {zone}",
                    datetime.now() - timedelta(days=random.randint(30, 365)),
                    f"Dispositivo de prueba #{i+1}",
                    random.choice([True, True, True, False])  # 75% active
                ))
                
                device_id = cursor.fetchone()['id']
                
                # Create device status
                is_online = random.choice([True, True, True, False])  # 75% online
                cursor.execute("""
                    INSERT INTO device_status (
                        device_id, is_online, last_seen, firmware_version,
                        uptime, boot_count, device_state, 
                        ip_address, rssi, mqtt_connected,
                        temperature, humidity, fan_pwm_duty,
                        panic1, panic2, box_sw, siren, turret,
                        panic1_count, panic2_count, tamper_count,
                        updated_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                """, (
                    device_id,
                    is_online,
                    datetime.now() - timedelta(minutes=random.randint(0, 1440)) if is_online else None,
                    f"1.{random.randint(0, 5)}.{random.randint(0, 10)}",
                    random.randint(3600, 864000) if is_online else 0,
                    random.randint(1, 100),
                    random.choice(['NORMAL', 'NORMAL', 'ALARM', 'MAINTENANCE']) if is_online else 'INIT',
                    f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}" if is_online else None,
                    random.randint(-90, -40) if is_online else None,
                    is_online,
                    random.uniform(15, 35),
                    random.uniform(30, 70),
                    random.randint(0, 100),
                    random.choice([False, False, False, True]),  # 25% panic1
                    random.choice([False, False, False, True]),  # 25% panic2
                    random.choice([False, False, False, False, True]),  # 20% tamper
                    False,
                    False,
                    random.randint(0, 10),
                    random.randint(0, 10),
                    random.randint(0, 5)
                ))
                
                # Assign to account
                if accounts and random.choice([True, True, False]):  # 67% assigned
                    account_id = random.choice(accounts)
                    cursor.execute("""
                        INSERT INTO device_account_assignments (
                            device_id, account_id, assigned_by, is_active
                        ) VALUES (%s, %s, 1, true)
                    """, (device_id, account_id))
                
                # Assign to group
                if groups and random.choice([True, False]):  # 50% in groups
                    group = random.choice(groups)
                    cursor.execute("""
                        INSERT INTO group_device_assignments (
                            group_id, device_id, assigned_by
                        ) VALUES (%s, %s, 1)
                    """, (group['id'], device_id))
                
                # Create installation data
                if random.choice([True, True, False]):  # 67% have installation data
                    installation_date = datetime.now() - timedelta(days=random.randint(30, 365))
                    cursor.execute("""
                        INSERT INTO device_installations (
                            device_id, installation_date, technician_name,
                            work_order, client_location, panel_model,
                            configured_zones, connected_sensors,
                            last_maintenance, next_maintenance,
                            warranty_expiry, installation_status,
                            technician_notes
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        device_id,
                        installation_date,
                        random.choice(['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez']),
                        f"WO-2024-{random.randint(1000, 9999)}",
                        f"Cliente en {city}, Zona {zone}",
                        random.choice(panel_models),
                        f"Zonas 1-{random.randint(4, 16)} configuradas",
                        "PIR, Magnético, Sirena, Botón de pánico",
                        installation_date + timedelta(days=random.randint(30, 180)),
                        datetime.now() + timedelta(days=random.randint(30, 180)),
                        installation_date + timedelta(days=365),
                        random.choice(['Operativo', 'Mantenimiento Pendiente', 'Requiere Revisión']),
                        "Instalación completada según especificaciones. Sistema probado y funcionando."
                    ))
            
            conn.commit()
            print("[OK] Sample devices created successfully")
        else:
            print(f"[INFO] Sufficient devices already exist ({existing_count} found)")
            
    except Exception as e:
        print(f"[ERROR] Error creating devices: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def main():
    """Main execution"""
    print("[START] Starting database setup...")
    print("-" * 50)
    
    # Create tables
    create_device_installations_table()
    
    # Create sample data
    create_sample_accounts()
    create_sample_groups()
    create_sample_devices()
    
    print("-" * 50)
    print("[DONE] Database setup completed!")
    
    # Show summary
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM auth_accounts) as accounts,
                (SELECT COUNT(*) FROM group_definitions) as groups,
                (SELECT COUNT(*) FROM device) as devices,
                (SELECT COUNT(*) FROM device WHERE id IN (
                    SELECT device_id FROM device_status WHERE is_online = true
                )) as online_devices,
                (SELECT COUNT(*) FROM device_installations) as installations
        """)
        
        summary = cursor.fetchone()
        print("\n[SUMMARY] Database Summary:")
        print(f"  - Accounts: {summary['accounts']}")
        print(f"  - Groups: {summary['groups']}")
        print(f"  - Devices: {summary['devices']}")
        print(f"  - Online Devices: {summary['online_devices']}")
        print(f"  - Installation Records: {summary['installations']}")
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()