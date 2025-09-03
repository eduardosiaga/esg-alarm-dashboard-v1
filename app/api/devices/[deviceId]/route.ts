import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/devices/[deviceId] - Get specific device
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId: deviceIdParam } = await params;
    const deviceId = parseInt(deviceIdParam);
    
    if (isNaN(deviceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid device ID' },
        { status: 400 }
      );
    }
    
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        deviceStatus: true,
        accountAssignments: {
          where: { isActive: true },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                parentAccountId: true,
                parentAccount: {
                  select: {
                    id: true,
                    name: true
                  }
                }
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
                description: true,
                accountId: true
              }
            }
          }
        },
        installation: true,
        // Include recent telemetry
        telemetry: {
          take: 100,
          orderBy: {
            time: 'desc'
          }
        },
        // Include recent alarms
        alarms: {
          take: 50,
          orderBy: {
            timestamp: 'desc'
          }
        },
        // Include recent commands
        commands: {
          take: 20,
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    
    if (!device) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Format response
    const formattedDevice = {
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
      status: device.deviceStatus,
      account: device.accountAssignments[0]?.account || null,
      groups: device.groupAssignments.map(ga => ga.group),
      installation: device.installation,
      recentTelemetry: device.telemetry,
      recentAlarms: device.alarms,
      recentCommands: device.commands,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt
    };
    
    return NextResponse.json({
      success: true,
      data: formattedDevice
    });
    
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch device',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/devices/[deviceId] - Update device
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId: deviceIdParam } = await params;
    const deviceId = parseInt(deviceIdParam);
    const body = await request.json();
    
    if (isNaN(deviceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid device ID' },
        { status: 400 }
      );
    }
    
    // Check if device exists
    const existingDevice = await prisma.device.findUnique({
      where: { id: deviceId }
    });
    
    if (!existingDevice) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }
    
    const {
      hostname,
      country,
      zone,
      latitude,
      longitude,
      locationDesc,
      installationDate,
      notes,
      active,
      accountId,
      groupId,
      installationData
    } = body;
    
    // Update device and related data in transaction
    const updatedDevice = await prisma.$transaction(async (tx) => {
      // Update device basic info
      const deviceUpdate: any = {};
      if (hostname !== undefined) deviceUpdate.hostname = hostname;
      if (country !== undefined) deviceUpdate.country = country;
      if (zone !== undefined) deviceUpdate.zone = zone;
      if (latitude !== undefined) deviceUpdate.latitude = parseFloat(latitude);
      if (longitude !== undefined) deviceUpdate.longitude = parseFloat(longitude);
      if (locationDesc !== undefined) deviceUpdate.locationDesc = locationDesc;
      if (installationDate !== undefined) {
        deviceUpdate.installationDate = installationDate ? new Date(installationDate) : null;
      }
      if (notes !== undefined) deviceUpdate.notes = notes;
      if (active !== undefined) deviceUpdate.active = active;
      
      const device = await tx.device.update({
        where: { id: deviceId },
        data: deviceUpdate
      });
      
      // Update account assignment if provided
      if (accountId !== undefined) {
        // Deactivate existing assignments
        await tx.deviceAccountAssignment.updateMany({
          where: {
            deviceId,
            isActive: true
          },
          data: {
            isActive: false,
            unassignedBy: 1, // TODO: Get from authenticated user
            unassignedAt: new Date()
          }
        });
        
        // Create new assignment if accountId is not null
        if (accountId) {
          await tx.deviceAccountAssignment.create({
            data: {
              deviceId,
              accountId: parseInt(accountId),
              assignedBy: 1, // TODO: Get from authenticated user
              isActive: true
            }
          });
        }
      }
      
      // Update group assignment if provided
      if (groupId !== undefined) {
        // Remove existing group assignments
        await tx.groupDeviceAssignment.deleteMany({
          where: { deviceId }
        });
        
        // Create new assignment if groupId is not null
        if (groupId) {
          await tx.groupDeviceAssignment.create({
            data: {
              deviceId,
              groupId: parseInt(groupId),
              assignedBy: 1 // TODO: Get from authenticated user
            }
          });
        }
      }
      
      // Update installation data if provided
      if (installationData) {
        const installationUpdate: any = {};
        
        Object.keys(installationData).forEach(key => {
          if (installationData[key] !== undefined) {
            if (['installationDate', 'lastMaintenance', 'nextMaintenance'].includes(key)) {
              installationUpdate[key] = installationData[key] ? 
                new Date(installationData[key]) : null;
            } else if (key === 'warrantyExpiry') {
              installationUpdate[key] = installationData[key] ? 
                new Date(installationData[key]) : null;
            } else {
              installationUpdate[key] = installationData[key];
            }
          }
        });
        
        // Check if installation record exists
        const existingInstallation = await tx.deviceInstallation.findUnique({
          where: { deviceId }
        });
        
        if (existingInstallation) {
          await tx.deviceInstallation.update({
            where: { deviceId },
            data: installationUpdate
          });
        } else if (Object.keys(installationUpdate).length > 0) {
          await tx.deviceInstallation.create({
            data: {
              deviceId,
              ...installationUpdate
            }
          });
        }
      }
      
      return device;
    });
    
    // Fetch complete updated device
    const completeDevice = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        deviceStatus: true,
        accountAssignments: {
          where: { isActive: true },
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
    });
    
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update device',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/devices/[deviceId] - Delete device
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId: deviceIdParam } = await params;
    const deviceId = parseInt(deviceIdParam);
    
    if (isNaN(deviceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid device ID' },
        { status: 400 }
      );
    }
    
    // Check if device exists
    const existingDevice = await prisma.device.findUnique({
      where: { id: deviceId }
    });
    
    if (!existingDevice) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Delete device (cascades to related tables)
    await prisma.device.delete({
      where: { id: deviceId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Device deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete device',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}