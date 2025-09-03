import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/groups/[groupId] - Get specific group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: groupIdParam } = await params;
    const groupId = parseInt(groupIdParam);
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid group ID' },
        { status: 400 }
      );
    }
    
    const group = await prisma.groupDefinition.findUnique({
      where: { id: groupId },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            parentAccountId: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        deviceAssignments: {
          include: {
            device: {
              include: {
                deviceStatus: {
                  select: {
                    isOnline: true,
                    lastSeen: true,
                    temperature: true,
                    humidity: true,
                    panic1: true,
                    panic2: true,
                    boxSw: true
                  }
                }
              }
            },
            assignor: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }
    
    // Format response
    const formattedGroup = {
      id: group.id,
      name: group.name,
      description: group.description,
      account: group.account,
      creator: group.creator,
      devices: group.deviceAssignments.map(da => ({
        ...da.device,
        assignedBy: da.assignor,
        assignedAt: da.assignedAt
      })),
      deviceCount: group.deviceAssignments.length,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    };
    
    return NextResponse.json({
      success: true,
      data: formattedGroup
    });
    
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[groupId] - Update group
export async function PATCH(
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
    
    const { name, description } = body;
    
    // Check if group exists
    const existingGroup = await prisma.groupDefinition.findUnique({
      where: { id: groupId }
    });
    
    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }
    
    // Check if new name conflicts with existing group in same account
    if (name && name !== existingGroup.name) {
      const conflictingGroup = await prisma.groupDefinition.findFirst({
        where: {
          name,
          accountId: existingGroup.accountId,
          id: { not: groupId }
        }
      });
      
      if (conflictingGroup) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'A group with this name already exists in this account' 
          },
          { status: 409 }
        );
      }
    }
    
    // Update group
    const updatedGroup = await prisma.groupDefinition.update({
      where: { id: groupId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description })
      },
      include: {
        account: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            deviceAssignments: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedGroup,
        deviceCount: updatedGroup._count.deviceAssignments
      }
    });
    
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[groupId] - Delete group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId: groupIdParam } = await params;
    const groupId = parseInt(groupIdParam);
    
    if (isNaN(groupId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid group ID' },
        { status: 400 }
      );
    }
    
    // Check if group exists
    const existingGroup = await prisma.groupDefinition.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: {
            deviceAssignments: true
          }
        }
      }
    });
    
    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }
    
    // Warning if group has devices
    if (existingGroup._count.deviceAssignments > 0) {
      // Delete group (cascades to device assignments)
      await prisma.groupDefinition.delete({
        where: { id: groupId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Group deleted successfully. ${existingGroup._count.deviceAssignments} device assignments were removed.`
      });
    } else {
      // Delete group
      await prisma.groupDefinition.delete({
        where: { id: groupId }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Group deleted successfully'
      });
    }
    
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}