import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error: any, success: any) => {
  if (error) {
    console.log('❌ Email service configuration error:', error.message);
    console.log('📧 Please configure SMTP settings in environment variables:');
    console.log('   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
  } else {
    console.log('✅ Email service ready to send messages');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"MCB App" <${emailConfig.auth.user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

export function createPasswordResetEmail(userName: string, userEmail: string, resetLink: string): { subject: string; html: string; text: string } {
  const subject = 'Password Reset Request - MCB App';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .button:hover { background: #5a6fd8; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Password Reset Request</h1>
        <p>MCB Job Portal</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName}!</h2>
        
    <p>We received a request to reset your password for your MCB App account. If you made this request, please follow these steps:</p>
    
    <div style="background: #e8f4fd; border: 1px solid #bee5eb; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0c5460;">📱 How to Reset Your Password:</h3>
      <ol style="margin: 10px 0; padding-left: 20px;">
        <li><strong>Open the MCB App</strong> on your device</li>
        <li><strong>Go to the Login screen</strong></li>
        <li><strong>Tap "Forgot Password?"</strong></li>
        <li><strong>Enter your email:</strong> ${userEmail}</li>
        <li><strong>Follow the instructions</strong> in the app</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; display: inline-block;">
        <strong>Reset Token (for support):</strong><br>
        <code style="background: #e9ecef; padding: 5px; border-radius: 3px; font-family: monospace; word-break: break-all;">${resetLink.split('token=')[1]}</code>
      </div>
    </div>
        
        <div class="warning">
          <strong>⚠️ Important:</strong>
          <ul>
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Your password will remain unchanged until you create a new one</li>
          </ul>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace;">
          ${resetLink}
        </p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Best regards,<br>The MCB App Team</p>
      </div>
      
      <div class="footer">
        <p>This email was sent from MCB Job Portal. Please do not reply to this email.</p>
        <p>© 2024 MCB App. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Password Reset Request - MCB App

Hello ${userName}!

We received a request to reset your password for your MCB App account. If you made this request, please follow these steps:

📱 HOW TO RESET YOUR PASSWORD:
1. Open the MCB App on your device
2. Go to the Login screen
3. Tap "Forgot Password?"
4. Enter your email: ${userEmail}
5. Follow the instructions in the app

Reset Token (for support): ${resetLink.split('token=')[1]}

IMPORTANT:
- This reset token will expire in 1 hour for security reasons
- If you didn't request this password reset, please ignore this email
- Your password will remain unchanged until you create a new one

If you have any questions or need assistance, please contact our support team.

Best regards,
The MCB App Team

---
This email was sent from MCB Job Portal. Please do not reply to this email.
© 2024 MCB App. All rights reserved.
  `;
  
  return { subject, html, text };
}
