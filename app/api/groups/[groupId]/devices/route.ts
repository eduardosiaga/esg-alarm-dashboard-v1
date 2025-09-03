import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/groups/[groupId]/devices - Assign devices to group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: groupIdParam } = await params;
    const groupId = parseInt(groupIdParam);
    const body = await request.json();
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid group ID' },
        { status: 400 }
      );
    }
    
    const { deviceIds } = body;
    
    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Device IDs array is required' },
        { status: 400 }
      );
    }
    
    // Verify group exists
    const group = await prisma.groupDefinition.findUnique({
      where: { id: groupId }
    });
    
    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }
    
    // Verify all devices exist
    const devices = await prisma.device.findMany({
      where: {
        id: { in: deviceIds }
      }
    });
    
    if (devices.length !== deviceIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Some devices were not found',
          found: devices.map(d => d.id),
          requested: deviceIds
        },
        { status: 400 }
      );
    }
    
    // Get existing assignments
    const existingAssignments = await prisma.groupDeviceAssignment.findMany({
      where: {
        groupId,
        deviceId: { in: deviceIds }
      }
    });
    
    const existingDeviceIds = existingAssignments.map(a => a.deviceId);
    const newDeviceIds = deviceIds.filter(id => !existingDeviceIds.includes(id));
    
    // Create new assignments
    if (newDeviceIds.length > 0) {
      await prisma.groupDeviceAssignment.createMany({
        data: newDeviceIds.map(deviceId => ({
          groupId,
          deviceId,
          assignedBy: 1 // TODO: Get from authenticated user
        }))
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        assigned: newDeviceIds.length,
        alreadyAssigned: existingDeviceIds.length,
        total: deviceIds.length
      }
    });
    
  } catch (error) {
    console.error('Error assigning devices to group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to assign devices to group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[groupId]/devices - Remove devices from group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: groupIdParam } = await params;
    const groupId = parseInt(groupIdParam);
    const body = await request.json();
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid group ID' },
        { status: 400 }
      );
    }
    
    const { deviceIds } = body;
    
    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Device IDs array is required' },
        { status: 400 }
      );
    }
    
    // Delete assignments
    const result = await prisma.groupDeviceAssignment.deleteMany({
      where: {
        groupId,
        deviceId: { in: deviceIds }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        removed: result.count
      }
    });
    
  } catch (error) {
    console.error('Error removing devices from group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to remove devices from group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}