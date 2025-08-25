/**
 * Email Service
 * Handles sending emails for authentication and notifications
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Check if email configuration is available
      if (!process.env.SENDGRID_API_KEY && !process.env.SMTP_HOST) {
        console.warn('⚠️ Email service not configured. Email features will be disabled.');
        return;
      }

      // Configure transporter based on available settings
      if (process.env.SENDGRID_API_KEY) {
        // SendGrid configuration
        this.transporter = nodemailer.createTransporter({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        });
      } else if (process.env.SMTP_HOST) {
        // Generic SMTP configuration
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      }

      this.isConfigured = true;
      console.log('✅ Email service configured successfully');

    } catch (error) {
      console.error('❌ Email service configuration failed:', error);
      this.isConfigured = false;
    }
  }

  async sendEmail({ to, subject, template, data, html, text }) {
    try {
      if (!this.isConfigured) {
        console.warn('⚠️ Email service not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      // Generate email content based on template or provided html/text
      let emailHtml = html;
      let emailText = text;

      if (template && data) {
        const content = this.generateEmailContent(template, data);
        emailHtml = content.html;
        emailText = content.text;
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'Astral Draft'} <${process.env.FROM_EMAIL || 'noreply@astraldraft.com'}>`,
        to: to,
        subject: subject,
        html: emailHtml,
        text: emailText
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`📧 Email sent successfully to ${to}: ${subject}`);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Email send failed:', error);
      return { success: false, error: error.message };
    }
  }

  generateEmailContent(template, data) {
    const templates = {
      'email-verification': {
        subject: 'Welcome to Astral Draft - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0;">🏈 Astral Draft</h1>
              <p style="color: #6b7280; margin: 5px 0;">Fantasy Football Evolved</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${data.username}!</h2>
              <p style="color: #374151; line-height: 1.6;">
                Thank you for joining Astral Draft! To complete your registration and start your fantasy football journey, please verify your email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.verificationLink}" 
                   style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${data.verificationLink}" style="color: #3b82f6; word-break: break-all;">${data.verificationLink}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create an account with Astral Draft, you can safely ignore this email.</p>
            </div>
          </div>
        `,
        text: `
Welcome to Astral Draft, ${data.username}!

Thank you for joining Astral Draft! To complete your registration, please verify your email address by clicking the link below:

${data.verificationLink}

This verification link will expire in 24 hours.

If you didn't create an account with Astral Draft, you can safely ignore this email.

---
Astral Draft - Fantasy Football Evolved
        `
      },

      'password-reset': {
        subject: 'Astral Draft - Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0;">🏈 Astral Draft</h1>
              <p style="color: #6b7280; margin: 5px 0;">Fantasy Football Evolved</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #374151; line-height: 1.6;">
                Hi ${data.username},
              </p>
              <p style="color: #374151; line-height: 1.6;">
                We received a request to reset your password for your Astral Draft account. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetLink}" 
                   style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${data.resetLink}" style="color: #ef4444; word-break: break-all;">${data.resetLink}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>This password reset link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
          </div>
        `,
        text: `
Password Reset Request

Hi ${data.username},

We received a request to reset your password for your Astral Draft account. Click the link below to create a new password:

${data.resetLink}

This password reset link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

---
Astral Draft - Fantasy Football Evolved
        `
      },

      'welcome': {
        subject: 'Welcome to Astral Draft!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0;">🏈 Astral Draft</h1>
              <p style="color: #6b7280; margin: 5px 0;">Fantasy Football Evolved</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome to the Future of Fantasy Football!</h2>
              <p style="color: #374151; line-height: 1.6;">
                Hi ${data.username},
              </p>
              <p style="color: #374151; line-height: 1.6;">
                Your email has been verified and your account is now active! You're ready to experience fantasy football like never before with AI-powered insights, real-time analytics, and advanced draft tools.
              </p>
              
              <h3 style="color: #1f2937; margin-top: 25px;">What's Next?</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li>🏆 <strong>Create or Join a League</strong> - Start your fantasy journey</li>
                <li>🤖 <strong>Meet the Oracle</strong> - Get AI-powered predictions and insights</li>
                <li>📊 <strong>Advanced Analytics</strong> - Deep dive into player performance</li>
                <li>⚡ <strong>Real-Time Updates</strong> - Stay ahead with live scoring</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                   style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Start Playing Now
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>Need help getting started? Check out our <a href="#" style="color: #3b82f6;">Quick Start Guide</a></p>
              <p>Questions? Reply to this email or contact our support team.</p>
            </div>
          </div>
        `,
        text: `
Welcome to Astral Draft!

Hi ${data.username},

Your email has been verified and your account is now active! You're ready to experience fantasy football like never before with AI-powered insights, real-time analytics, and advanced draft tools.

What's Next?
• Create or Join a League - Start your fantasy journey
• Meet the Oracle - Get AI-powered predictions and insights  
• Advanced Analytics - Deep dive into player performance
• Real-Time Updates - Stay ahead with live scoring

Start playing now: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Need help getting started? Check out our Quick Start Guide or contact our support team.

---
Astral Draft - Fantasy Football Evolved
        `
      }
    };

    const template_data = templates[template];
    if (!template_data) {
      throw new Error(`Email template '${template}' not found`);
    }

    return {
      html: template_data.html,
      text: template_data.text,
      subject: template_data.subject
    };
  }

  async sendWelcomeEmail(to, username) {
    return this.sendEmail({
      to,
      subject: 'Welcome to Astral Draft!',
      template: 'welcome',
      data: { username }
    });
  }

  async sendVerificationEmail(to, username, verificationLink) {
    return this.sendEmail({
      to,
      subject: 'Welcome to Astral Draft - Verify Your Email',
      template: 'email-verification',
      data: { username, verificationLink }
    });
  }

  async sendPasswordResetEmail(to, username, resetLink) {
    return this.sendEmail({
      to,
      subject: 'Astral Draft - Password Reset',
      template: 'password-reset',
      data: { username, resetLink }
    });
  }

  async healthCheck() {
    if (!this.isConfigured) {
      return {
        status: 'disabled',
        message: 'Email service not configured'
      };
    }

    try {
      await this.transporter.verify();
      return {
        status: 'healthy',
        message: 'Email service is working'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = {
  emailService,
  sendEmail: emailService.sendEmail.bind(emailService),
  sendWelcomeEmail: emailService.sendWelcomeEmail.bind(emailService),
  sendVerificationEmail: emailService.sendVerificationEmail.bind(emailService),
  sendPasswordResetEmail: emailService.sendPasswordResetEmail.bind(emailService)
};