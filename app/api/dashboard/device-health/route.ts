import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all device status records with device info
    const allDeviceStatus = await prisma.deviceStatus.findMany({
      include: {
        device: {
          select: {
            id: true,
            hostname: true,
            locationDesc: true
          }
        }
      }
    });

    const total = allDeviceStatus.length;
    
    if (total === 0) {
      return NextResponse.json({
        distribution: {
          online: { count: 0, percentage: 0 },
          withWarnings: { count: 0, percentage: 0 },
          withAlarms: { count: 0, percentage: 0 },
          offline: { count: 0, percentage: 0 },
          healthy: { count: 0, percentage: 0 }
        },
        metrics: {
          avgTemperature: 0,
          avgHumidity: 0,
          avgRssi: 0,
          totalDevices: 0
        },
        categories: [],
        healthScore: 0,
        timestamp: new Date().toISOString()
      });
    }

    // Calculate distributions
    const online = allDeviceStatus.filter(d => d.isOnline).length;
    const offline = allDeviceStatus.filter(d => !d.isOnline).length;
    
    const withWarnings = allDeviceStatus.filter(d => 
      d.isOnline && 
      ((d.temperature && d.temperature > 35) || 
       (d.humidity && d.humidity > 80))
    ).length;
    
    const withAlarms = allDeviceStatus.filter(d => 
      d.isOnline && 
      (d.panic1 || d.panic2 || d.boxSw)
    ).length;
    
    const withErrors = allDeviceStatus.filter(d => 
      d.errorCount && d.errorCount > 0
    ).length;
    
    const healthy = allDeviceStatus.filter(d => 
      d.isOnline && 
      !d.panic1 && 
      !d.panic2 && 
      !d.boxSw && 
      (!d.temperature || d.temperature <= 35) && 
      (!d.humidity || d.humidity <= 80) &&
      (!d.errorCount || d.errorCount === 0)
    ).length;
    
    const connectivityIssues = allDeviceStatus.filter(d => 
      (d.wifiDisconnects && d.wifiDisconnects > 5) || 
      (d.mqttDisconnects && d.mqttDisconnects > 5)
    ).length;

    // Calculate averages for online devices
    const onlineDevices = allDeviceStatus.filter(d => d.isOnline);
    const avgTemperature = onlineDevices.length > 0 
      ? onlineDevices.reduce((sum, d) => sum + (d.temperature || 0), 0) / onlineDevices.length 
      : 0;
    const avgHumidity = onlineDevices.length > 0 
      ? onlineDevices.reduce((sum, d) => sum + (d.humidity || 0), 0) / onlineDevices.length 
      : 0;
    const avgRssi = onlineDevices.length > 0 
      ? onlineDevices.reduce((sum, d) => sum + (d.rssi || 0), 0) / onlineDevices.length 
      : 0;

    // Categorize devices
    const categories = [
      {
        category: 'healthy',
        count: healthy,
        percentage: Math.round((healthy / total) * 100),
        devices: allDeviceStatus
          .filter(d => 
            d.isOnline && 
            !d.panic1 && 
            !d.panic2 && 
            !d.boxSw && 
            (!d.temperature || d.temperature <= 35) && 
            (!d.humidity || d.humidity <= 80)
          )
          .slice(0, 5)
          .map(d => ({
            id: d.device.id,
            hostname: d.device.hostname,
            location: d.device.locationDesc || '' || '' || '' || ''
          }))
      },
      {
        category: 'alarm',
        count: withAlarms,
        percentage: Math.round((withAlarms / total) * 100),
        devices: allDeviceStatus
          .filter(d => d.panic1 || d.panic2 || d.boxSw)
          .slice(0, 5)
          .map(d => ({
            id: d.device.id,
            hostname: d.device.hostname,
            location: d.device.locationDesc
          }))
      },
      {
        category: 'warning',
        count: withWarnings,
        percentage: Math.round((withWarnings / total) * 100),
        devices: allDeviceStatus
          .filter(d => 
            d.isOnline && 
            ((d.temperature && d.temperature > 35) || 
             (d.humidity && d.humidity > 80))
          )
          .slice(0, 5)
          .map(d => ({
            id: d.device.id,
            hostname: d.device.hostname,
            location: d.device.locationDesc
          }))
      },
      {
        category: 'offline',
        count: offline,
        percentage: Math.round((offline / total) * 100),
        devices: allDeviceStatus
          .filter(d => !d.isOnline)
          .slice(0, 5)
          .map(d => ({
            id: d.device.id,
            hostname: d.device.hostname,
            location: d.device.locationDesc
          }))
      }
    ];

    const response = {
      distribution: {
        online: {
          count: online,
          percentage: Math.round((online / total) * 100)
        },
        withWarnings: {
          count: withWarnings,
          percentage: Math.round((withWarnings / total) * 100)
        },
        withAlarms: {
          count: withAlarms,
          percentage: Math.round((withAlarms / total) * 100)
        },
        offline: {
          count: offline,
          percentage: Math.round((offline / total) * 100)
        },
        healthy: {
          count: healthy,
          percentage: Math.round((healthy / total) * 100)
        },
        withErrors: {
          count: withErrors,
          percentage: Math.round((withErrors / total) * 100)
        },
        connectivityIssues: {
          count: connectivityIssues,
          percentage: Math.round((connectivityIssues / total) * 100)
        }
      },
      metrics: {
        avgTemperature: parseFloat(avgTemperature.toFixed(1)),
        avgHumidity: parseFloat(avgHumidity.toFixed(1)),
        avgRssi: parseFloat(avgRssi.toFixed(0)),
        totalDevices: total
      },
      categories: categories,
      healthScore: calculateHealthScore(online, total, withAlarms, withWarnings, withErrors),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Device health error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch device health data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function calculateHealthScore(online: number, total: number, alarms: number, warnings: number, errors: number): number {
  if (total === 0) return 0;
  
  // Calculate health score (0-100)
  let score = 100;
  
  // Deduct for offline devices
  const offlinePercentage = ((total - online) / total) * 100;
  score -= offlinePercentage * 0.5; // -0.5 points per offline percentage
  
  // Deduct for alarms
  const alarmPercentage = (alarms / total) * 100;
  score -= alarmPercentage * 1; // -1 point per alarm percentage
  
  // Deduct for warnings
  const warningPercentage = (warnings / total) * 100;
  score -= warningPercentage * 0.3; // -0.3 points per warning percentage
  
  // Deduct for errors
  const errorPercentage = (errors / total) * 100;
  score -= errorPercentage * 0.7; // -0.7 points per error percentage
  
  return Math.max(0, Math.round(score));
}