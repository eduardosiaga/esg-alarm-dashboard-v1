import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/devices - List all devices with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filters
    const status = searchParams.get('status'); // online, offline, alarm
    const accountId = searchParams.get('account_id');
    const groupId = searchParams.get('group_id');
    const search = searchParams.get('search');
    
    // Build where clause
    const where: any = {};
    
    // Status filter
    if (status) {
      if (status === 'online') {
        where.deviceStatus = { isOnline: true };
      } else if (status === 'offline') {
        where.deviceStatus = { isOnline: false };
      } else if (status === 'alarm') {
        where.deviceStatus = {
          OR: [
            { panic1: true },
            { panic2: true },
            { boxSw: true }
          ]
        };
      }
    }
    
    // Account filter
    if (accountId) {
      where.accountAssignments = {
        some: {
          accountId: parseInt(accountId),
          isActive: true
        }
      };
    }
    
    // Group filter
    if (groupId) {
      where.groupAssignments = {
        some: {
          groupId: parseInt(groupId)
        }
      };
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { hostname: { contains: search, mode: 'insensitive' } },
        { macAddress: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Get total count
    const total = await prisma.device.count({ where });
    
    // Get devices with relations
    const devices = await prisma.device.findMany({
      where,
      skip,
      take: limit,
      include: {
        deviceStatus: true,
        accountAssignments: {
          where: { isActive: true },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                parentAccountId: true
              }
            }
          }
        },
        groupAssignments: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        installation: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format response
    const formattedDevices = devices.map(device => ({
      id: device.id,
      macAddress: device.macAddress,
      hostname: device.hostname,
      country: device.country,
      zone: device.zone,
      location: {
        latitude: device.latitude,
        longitude: device.longitude,
        description: device.locationDesc
      },
      installationDate: device.installationDate,
      notes: device.notes,
      active: device.active,
      status: device.deviceStatus ? {
        isOnline: device.deviceStatus.isOnline,
        lastSeen: device.deviceStatus.lastSeen,
        firmwareVersion: device.deviceStatus.firmwareVersion,
        uptime: device.deviceStatus.uptime,
        state: device.deviceStatus.deviceState,
        network: {
          type: device.deviceStatus.networkType,
          ipAddress: device.deviceStatus.ipAddress,
          rssi: device.deviceStatus.rssi,
          connected: device.deviceStatus.connected,
          mqttConnected: device.deviceStatus.mqttConnected
        },
        sensors: {
          temperature: device.deviceStatus.temperature,
          humidity: device.deviceStatus.humidity,
          fanPwmDuty: device.deviceStatus.fanPwmDuty
        },
        alarms: {
          panic1: device.deviceStatus.panic1,
          panic2: device.deviceStatus.panic2,
          tamper: device.deviceStatus.boxSw,
          siren: device.deviceStatus.siren,
          turret: device.deviceStatus.turret
        },
        counters: {
          panic1Count: device.deviceStatus.panic1Count,
          panic2Count: device.deviceStatus.panic2Count,
          tamperCount: device.deviceStatus.tamperCount,
          wifiDisconnects: device.deviceStatus.wifiDisconnects,
          mqttDisconnects: device.deviceStatus.mqttDisconnects,
          errorCount: device.deviceStatus.errorCount
        }
      } : null,
      account: device.accountAssignments[0]?.account || null,
      groups: device.groupAssignments.map(ga => ga.group),
      installation: device.installation,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedDevices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch devices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/devices - Create new device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      macAddress,
      hostname,
      country,
      zone,
      latitude,
      longitude,
      locationDesc,
      installationDate,
      notes,
      accountId,
      groupId,
      installationData
    } = body;
    
    // Validate required fields
    if (!macAddress) {
      return NextResponse.json(
        { success: false, error: 'MAC address is required' },
        { status: 400 }
      );
    }
    
    // Check if device already exists
    const existingDevice = await prisma.device.findUnique({
      where: { macAddress }
    });
    
    if (existingDevice) {
      return NextResponse.json(
        { success: false, error: 'Device with this MAC address already exists' },
        { status: 409 }
      );
    }
    
    // Create device with all relations in a transaction
    const device = await prisma.$transaction(async (tx) => {
      // Create device
      const newDevice = await tx.device.create({
        data: {
          macAddress,
          hostname,
          country,
          zone,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          locationDesc,
          installationDate: installationDate ? new Date(installationDate) : null,
          notes,
          active: true,
          // Create device status
          deviceStatus: {
            create: {
              isOnline: false,
              deviceState: 'INIT'
            }
          }
        },
        include: {
          deviceStatus: true
        }
      });
      
      // Create account assignment if provided
      if (accountId) {
        await tx.deviceAccountAssignment.create({
          data: {
            deviceId: newDevice.id,
            accountId: parseInt(accountId),
            assignedBy: 1, // TODO: Get from authenticated user
            isActive: true
          }
        });
      }
      
      // Create group assignment if provided
      if (groupId) {
        await tx.groupDeviceAssignment.create({
          data: {
            deviceId: newDevice.id,
            groupId: parseInt(groupId),
            assignedBy: 1 // TODO: Get from authenticated user
          }
        });
      }
      
      // Create installation data if provided
      if (installationData) {
        await tx.deviceInstallation.create({
          data: {
            deviceId: newDevice.id,
            ...installationData,
            installationDate: installationData.installationDate ? 
              new Date(installationData.installationDate) : null,
            lastMaintenance: installationData.lastMaintenance ? 
              new Date(installationData.lastMaintenance) : null,
            nextMaintenance: installationData.nextMaintenance ? 
              new Date(installationData.nextMaintenance) : null,
            warrantyExpiry: installationData.warrantyExpiry ? 
              new Date(installationData.warrantyExpiry) : null
          }
        });
      }
      
      return newDevice;
    });
    
    // Fetch complete device data
    const completeDevice = await prisma.device.findUnique({
      where: { id: device.id },
      include: {
        deviceStatus: true,
        accountAssignments: {
          include: {
            account: true
          }
        },
        groupAssignments: {
          include: {
            group: true
          }
        },
        installation: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: completeDevice
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create device',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}