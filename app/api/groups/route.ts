import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/groups - List all groups
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('account_id');
    
    const where: any = {};
    
    if (accountId) {
      where.accountId = parseInt(accountId);
    }
    
    const groups = await prisma.groupDefinition.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true
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
              select: {
                id: true,
                hostname: true,
                macAddress: true,
                deviceStatus: {
                  select: {
                    isOnline: true,
                    lastSeen: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            deviceAssignments: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    // Format response
    const formattedGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      account: group.account,
      creator: group.creator,
      deviceCount: group._count.deviceAssignments,
      devices: group.deviceAssignments.map(da => da.device),
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedGroups
    });
    
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch groups',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create new group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, accountId } = body;
    
    // Validate required fields
    if (!name || !accountId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name and account ID are required' 
        },
        { status: 400 }
      );
    }
    
    // Check if group with same name exists in account
    const existingGroup = await prisma.groupDefinition.findFirst({
      where: {
        name,
        accountId: parseInt(accountId)
      }
    });
    
    if (existingGroup) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A group with this name already exists in this account' 
        },
        { status: 409 }
      );
    }
    
    // Create group
    const group = await prisma.groupDefinition.create({
      data: {
        name,
        description,
        accountId: parseInt(accountId),
        createdBy: 1 // TODO: Get from authenticated user
      },
      include: {
        account: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: group
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create group',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}