import * as nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class GmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly emailFrom: string;
  private readonly otpExpiryMinutes: number;

  constructor() {
    this.emailFrom = process.env.EMAIL_FROM || 'ESP32 Alarm System <noreply@example.com>';
    this.otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
    this.initializeTransporter();
  }

  /**
   * Initialize Gmail transporter
   */
  private async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false,
          // Minimum TLS version
          minVersion: 'TLSv1.2'
        }
      });

      // Verify transporter configuration
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.verify();
        logger.info('Gmail transporter is ready');
      } else {
        logger.warn('Gmail configuration not provided. Email functionality disabled.');
        this.transporter = null;
      }
    } catch (error) {
      logger.error('Gmail transporter verification failed:', error);
      logger.warn('Email functionality will be disabled. The server will continue without email support.');
      this.transporter = null;
    }
  }

  /**
   * Send email
   */
  private async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.transporter) {
      logger.warn('Email skipped - email functionality is disabled', { to: options.to });
      return;
    }

    try {
      const mailOptions = {
        from: this.emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', { messageId: info.messageId, to: options.to });
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send OTP email
   */
  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            padding: 30px; 
            background-color: white; 
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #667eea; 
            text-align: center; 
            padding: 25px; 
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            border: 2px dashed #667eea; 
            border-radius: 10px;
            margin: 25px 0; 
            letter-spacing: 8px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #666; 
            font-size: 12px;
            background-color: #f8f9fa;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 ESP32 Alarm System</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Código de Verificación</p>
          </div>
          <div class="content">
            <h2 style="color: #333;">Tu código de acceso único</h2>
            <p>Hemos recibido una solicitud de inicio de sesión para tu cuenta. Usa el siguiente código para completar el proceso:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Este código expirará en <strong>${this.otpExpiryMinutes} minutos</strong></li>
                <li>No compartas este código con nadie</li>
                <li>Si no solicitaste este código, ignora este mensaje</li>
              </ul>
            </div>
            
            <p style="color: #666; margin-top: 30px;">
              Por tu seguridad, utilizamos autenticación sin contraseña. Esto significa que no necesitas recordar contraseñas complejas y tu cuenta está más protegida.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 5px 0;">© 2024 ESP32 Alarm System. Todos los derechos reservados.</p>
            <p style="margin: 5px 0; color: #999;">Este es un mensaje automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `🔐 Código de Verificación: ${otp} - ESP32 Alarm System`,
      html
    });
  }

  /**
   * Send welcome email after approval
   */
  async sendApprovalEmail(email: string, userName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            padding: 30px; 
            background-color: white; 
          }
          .success-box {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            color: #155724;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .feature-list {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .feature-list ul {
            margin: 10px 0;
            padding-left: 25px;
          }
          .feature-list li {
            margin: 8px 0;
            color: #495057;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #666; 
            font-size: 12px;
            background-color: #f8f9fa;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ¡Cuenta Aprobada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">ESP32 Alarm System</p>
          </div>
          <div class="content">
            <h2 style="color: #333;">¡Bienvenido, ${userName}!</h2>
            
            <div class="success-box">
              <strong>🎉 ¡Excelentes noticias!</strong><br>
              Tu cuenta ha sido aprobada por el administrador y ya puedes acceder al sistema.
            </div>
            
            <p>Tu cuenta está lista para usar. Ahora puedes iniciar sesión y acceder a todas las funcionalidades del ESP32 Alarm System.</p>
            
            <div class="feature-list">
              <strong>Con tu cuenta aprobada puedes:</strong>
              <ul>
                <li>📊 Monitorear dispositivos ESP32 en tiempo real</li>
                <li>🔔 Recibir alertas y notificaciones de alarmas</li>
                <li>⚙️ Configurar y controlar dispositivos remotamente</li>
                <li>📈 Ver históricos y estadísticas de eventos</li>
                <li>👥 Gestionar grupos de dispositivos</li>
                <li>📱 Acceder desde cualquier dispositivo</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
                Iniciar Sesión Ahora
              </a>
            </p>
            
            <p style="color: #666; margin-top: 30px;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al equipo de soporte.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 5px 0;">© 2024 ESP32 Alarm System. Todos los derechos reservados.</p>
            <p style="margin: 5px 0; color: #999;">Este es un mensaje automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '✅ Tu cuenta ha sido aprobada - ESP32 Alarm System',
      html
    });
  }

  /**
   * Send account created notification (pending approval)
   */
  async sendAccountCreatedEmail(email: string, userName: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            padding: 30px; 
            background-color: white; 
          }
          .pending-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .timeline {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .timeline-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
          }
          .timeline-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
          }
          .timeline-icon.completed {
            background-color: #28a745;
            color: white;
          }
          .timeline-icon.pending {
            background-color: #ffc107;
            color: white;
          }
          .timeline-icon.waiting {
            background-color: #6c757d;
            color: white;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #666; 
            font-size: 12px;
            background-color: #f8f9fa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Registro Recibido</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">ESP32 Alarm System</p>
          </div>
          <div class="content">
            <h2 style="color: #333;">¡Hola, ${userName}!</h2>
            
            <p>Hemos recibido tu solicitud de registro en el ESP32 Alarm System. Tu cuenta ha sido creada exitosamente.</p>
            
            <div class="pending-box">
              <strong>⏳ Pendiente de Aprobación</strong><br>
              Tu cuenta requiere aprobación del administrador antes de poder iniciar sesión. 
              Te notificaremos por correo electrónico tan pronto como tu cuenta sea aprobada.
            </div>
            
            <div class="timeline">
              <strong>Estado de tu registro:</strong>
              
              <div class="timeline-item">
                <div class="timeline-icon completed">✓</div>
                <div>
                  <strong>Registro completado</strong><br>
                  <small>Tu información ha sido recibida correctamente</small>
                </div>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-icon pending">2</div>
                <div>
                  <strong>Esperando aprobación</strong><br>
                  <small>El administrador revisará tu solicitud</small>
                </div>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-icon waiting">3</div>
                <div>
                  <strong>Acceso al sistema</strong><br>
                  <small>Podrás iniciar sesión una vez aprobado</small>
                </div>
              </div>
            </div>
            
            <p style="color: #666; margin-top: 30px;">
              El proceso de aprobación generalmente toma entre 1 a 24 horas hábiles. 
              Si tienes alguna pregunta urgente, puedes contactar al administrador del sistema.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 5px 0;">© 2024 ESP32 Alarm System. Todos los derechos reservados.</p>
            <p style="margin: 5px 0; color: #999;">Este es un mensaje automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '📝 Solicitud de Registro Recibida - ESP32 Alarm System',
      html
    });
  }
}

export const gmailService = new GmailService();