import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { 
  emailVerificationTemplate, 
  passwordResetTemplate, 
  passwordResetConfirmationTemplate,
  welcomeEmailTemplate 
} from '../templates/emailTemplates';

dotenv.config();

interface EmailResult {
  success: boolean;
  error?: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified successfully');
    } catch (error) {
      logger.error({ error }, 'Email service connection failed');
    }
  }

  private async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'LearnWhitehouse'}" <${process.env.SMTP_USER!}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info({ messageId: result.messageId, to: options.to }, 'Email sent successfully');
      
      return { success: true };
    } catch (error) {
      logger.error({ error, to: options.to }, 'Failed to send email');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(
    email: string, 
    verificationToken: string, 
    userName: string
  ): Promise<EmailResult> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = emailVerificationTemplate({
      userName,
      verificationUrl,
      appName: process.env.APP_NAME || 'LearnWhitehouse',
      supportEmail: process.env.SUPPORT_EMAIL || process.env.SMTP_USER!
    });

    return this.sendEmail({
      to: email,
      subject: `Verify your ${process.env.APP_NAME || 'LearnWhitehouse'} account`,
      html
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string, 
    resetToken: string, 
    userName: string
  ): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = passwordResetTemplate({
      userName,
      resetUrl,
      appName: process.env.APP_NAME || 'LearnWhitehouse',
      supportEmail: process.env.SUPPORT_EMAIL || process.env.SMTP_USER!,
      expiryHours: 1
    });

    return this.sendEmail({
      to: email,
      subject: `Reset your ${process.env.APP_NAME || 'LearnWhitehouse'} password`,
      html
    });
  }

  /**
   * Send password reset confirmation email
   */
  async sendPasswordResetConfirmationEmail(
    email: string, 
    userName: string
  ): Promise<EmailResult> {
    const html = passwordResetConfirmationTemplate({
      userName,
      appName: process.env.APP_NAME || 'LearnWhitehouse',
      supportEmail: process.env.SUPPORT_EMAIL || process.env.SMTP_USER!,
      loginUrl: `${process.env.FRONTEND_URL}/login`
    });

    return this.sendEmail({
      to: email,
      subject: `Password reset successful - ${process.env.APP_NAME || 'LearnWhitehouse'}`,
      html
    });
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(
    email: string, 
    userName: string
  ): Promise<EmailResult> {
    const html = welcomeEmailTemplate({
      userName,
      appName: process.env.APP_NAME || 'LearnWhitehouse',
      supportEmail: process.env.SUPPORT_EMAIL || process.env.SMTP_USER!,
      dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      helpUrl: `${process.env.FRONTEND_URL}/help`
    });

    return this.sendEmail({
      to: email,
      subject: `Welcome to ${process.env.APP_NAME || 'LearnWhitehouse'}!`,
      html
    });
  }

  /**
   * Send custom email with template
   */
  async sendCustomEmail(
    email: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(
    emails: string[],
    subject: string,
    html: string,
    text?: string
  ): Promise<EmailResult[]> {
    const promises = emails.map(email => 
      this.sendEmail({ to: email, subject, html, text })
    );
    
    return Promise.all(promises);
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
