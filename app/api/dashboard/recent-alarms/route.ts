import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get devices with alarms or warnings
    const devicesWithIssues = await prisma.deviceStatus.findMany({
      where: {
        OR: [
          { panic1: true },
          { panic2: true },
          { boxSw: true },
          { temperature: { gt: 35 } },
          { temperature: { lt: 5 } },
          { humidity: { gt: 80 } }
        ]
      },
      include: {
        device: {
          select: {
            hostname: true,
            locationDesc: true
          }
        }
      },
      take: limit,
      orderBy: [
        { lastSeen: 'desc' }
      ]
    });

    // Format the alarms
    const formattedAlarms = devicesWithIssues.map((status, index) => {
      // Determine alarm type and severity
      let alarmType = 'unknown';
      let severity = 'info';
      let description = 'Alerta General';

      if (status.panic1) {
        alarmType = 'panic1';
        severity = 'critical';
        description = 'Botón de Pánico 1 Activado';
      } else if (status.panic2) {
        alarmType = 'panic2';
        severity = 'critical';
        description = 'Botón de Pánico 2 Activado';
      } else if (status.boxSw) {
        alarmType = 'tamper';
        severity = 'high';
        description = 'Manipulación de Dispositivo Detectada';
      } else if (status.temperature && status.temperature > 35) {
        alarmType = 'high_temperature';
        severity = 'medium';
        description = 'Temperatura Alta Detectada';
      } else if (status.temperature && status.temperature < 5) {
        alarmType = 'low_temperature';
        severity = 'medium';
        description = 'Temperatura Baja Detectada';
      } else if (status.humidity && status.humidity > 80) {
        alarmType = 'high_humidity';
        severity = 'low';
        description = 'Humedad Alta Detectada';
      }

      // Calculate time ago
      const now = new Date();
      const lastSeen = status.lastSeen ? new Date(status.lastSeen) : now;
      const timeDiff = now.getTime() - lastSeen.getTime();
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let timeAgoText = 'Ahora';
      if (daysAgo > 0) {
        timeAgoText = `Hace ${daysAgo} ${daysAgo === 1 ? 'día' : 'días'}`;
      } else if (hoursAgo > 0) {
        timeAgoText = `Hace ${hoursAgo} ${hoursAgo === 1 ? 'hora' : 'horas'}`;
      } else if (minutesAgo > 0) {
        timeAgoText = `Hace ${minutesAgo} ${minutesAgo === 1 ? 'minuto' : 'minutos'}`;
      }

      return {
        id: index + 1,
        deviceId: status.deviceId,
        hostname: status.device.hostname,
        location: status.device.locationDesc || 'Sin ubicación',
        type: alarmType,
        severity: severity,
        description: description,
        timestamp: status.lastSeen || new Date().toISOString(),
        timeAgo: timeAgoText,
        isOnline: status.isOnline,
        details: {
          temperature: status.temperature ? parseFloat(status.temperature.toFixed(1)) : 0,
          humidity: status.humidity ? parseFloat(status.humidity.toFixed(1)) : 0,
          panic1: status.panic1,
          panic2: status.panic2,
          tamper: status.boxSw,
          siren: status.siren,
          turret: status.turret
        }
      };
    });

    // Get alarm counts
    const alarmCounts = await prisma.deviceStatus.aggregate({
      _count: {
        panic1: true,
        panic2: true,
        boxSw: true,
        temperature: true,
        humidity: true
      },
      where: {
        OR: [
          { panic1: true },
          { panic2: true },
          { boxSw: true },
          { temperature: { gt: 35 } },
          { humidity: { gt: 80 } }
        ]
      }
    });

    // Count by severity
    const criticalCount = formattedAlarms.filter(a => a.severity === 'critical').length;
    const highCount = formattedAlarms.filter(a => a.severity === 'high').length;
    const mediumCount = formattedAlarms.filter(a => a.severity === 'medium').length;
    const lowCount = formattedAlarms.filter(a => a.severity === 'low').length;

    const response = {
      alarms: formattedAlarms,
      summary: {
        total: formattedAlarms.length,
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount
      },
      counts: {
        panic1: await prisma.deviceStatus.count({ where: { panic1: true } }),
        panic2: await prisma.deviceStatus.count({ where: { panic2: true } }),
        tamper: await prisma.deviceStatus.count({ where: { boxSw: true } }),
        highTemperature: await prisma.deviceStatus.count({ where: { temperature: { gt: 35 } } }),
        highHumidity: await prisma.deviceStatus.count({ where: { humidity: { gt: 80 } } })
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Recent alarms error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent alarms', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}