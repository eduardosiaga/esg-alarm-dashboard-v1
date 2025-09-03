import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all device status records
    const allDeviceStatus = await prisma.deviceStatus.findMany({
      select: {
        isOnline: true,
        panic1: true,
        panic2: true,
        boxSw: true,
        temperature: true,
        humidity: true,
        errorCount: true,
        wifiDisconnects: true,
        mqttDisconnects: true
      }
    });

    // Calculate stats from the records
    const totalDevices = allDeviceStatus.length;
    const onlineDevices = allDeviceStatus.filter(d => d.isOnline).length;
    const offlineDevices = allDeviceStatus.filter(d => !d.isOnline).length;
    const devicesWithAlarms = allDeviceStatus.filter(d => d.panic1 || d.panic2 || d.boxSw).length;
    const devicesWithWarnings = allDeviceStatus.filter(d => 
      (d.temperature && d.temperature > 35) || 
      (d.humidity && d.humidity > 80)
    ).length;
    const devicesWithErrors = allDeviceStatus.filter(d => d.errorCount && d.errorCount > 0).length;

    // Calculate trend percentages (mock for now)
    const deviceGrowthTrend = 8; // Mock: 8% growth
    const onlineTrend = onlineDevices > 0 ? 12 : 0;
    const warningsTrend = devicesWithWarnings > 0 ? -5 : 0;
    const offlineTrend = offlineDevices > 0 ? -25 : 0;

    const response = {
      devices: {
        total: totalDevices,
        online: onlineDevices,
        offline: offlineDevices,
        withAlarms: devicesWithAlarms,
        withWarnings: devicesWithWarnings,
        withErrors: devicesWithErrors
      },
      trends: {
        devicesGrowth: deviceGrowthTrend,
        onlineGrowth: onlineTrend,
        warningsGrowth: warningsTrend,
        offlineGrowth: offlineTrend
      },
      percentages: {
        online: totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0,
        offline: totalDevices > 0 ? Math.round((offlineDevices / totalDevices) * 100) : 0,
        withAlarms: totalDevices > 0 ? Math.round((devicesWithAlarms / totalDevices) * 100) : 0,
        withWarnings: totalDevices > 0 ? Math.round((devicesWithWarnings / totalDevices) * 100) : 0
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}