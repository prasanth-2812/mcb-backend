import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || 'tanasvi.dev@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'dkka pebt jwiz ldce';
const FROM_EMAIL = process.env.FROM_EMAIL || 'tanasvi.dev@gmail.com';
const FROM_NAME = process.env.FROM_NAME || 'MCB App';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error: any, success: any) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
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

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    console.log(`📧 Sending email to: ${options.to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string, userName: string): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - MCB App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1976D2, #42A5F5);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #1976D2;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background: #1565C0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Password Reset Request</h1>
        <p>MCB App - Career Building Platform</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName}!</h2>
        
        <p>We received a request to reset your password for your MCB App account. If you made this request, click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset My Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
          ${resetUrl}
        </p>
        
        <div class="warning">
          <strong>⚠️ Important:</strong>
          <ul>
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Your password will remain unchanged until you create a new one</li>
          </ul>
        </div>
        
        <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
        
        <p>Best regards,<br>The MCB App Team</p>
      </div>
      
      <div class="footer">
        <p>This email was sent from MCB App. If you have any questions, please contact our support team.</p>
        <p>© 2024 MCB App. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset Request - MCB App
    
    Hello ${userName}!
    
    We received a request to reset your password for your MCB App account.
    
    To reset your password, visit this link:
    ${resetUrl}
    
    This link will expire in 1 hour for security reasons.
    
    If you didn't request this password reset, please ignore this email.
    
    Best regards,
    The MCB App Team
  `;

  return await sendEmail({
    to: email,
    subject: '🔐 Password Reset Request - MCB App',
    html,
    text,
  });
};

export const sendPasswordResetConfirmationEmail = async (email: string, userName: string): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful - MCB App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #4CAF50, #8BC34A);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Password Reset Successful</h1>
        <p>MCB App - Career Building Platform</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName}!</h2>
        
        <div class="success">
          <strong>🎉 Success!</strong> Your password has been successfully reset.
        </div>
        
        <p>Your MCB App account password has been updated. You can now log in with your new password.</p>
        
        <p>If you didn't make this change, please contact our support team immediately.</p>
        
        <p>Best regards,<br>The MCB App Team</p>
      </div>
      
      <div class="footer">
        <p>This email was sent from MCB App. If you have any questions, please contact our support team.</p>
        <p>© 2024 MCB App. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset Successful - MCB App
    
    Hello ${userName}!
    
    Your password has been successfully reset.
    
    You can now log in with your new password.
    
    If you didn't make this change, please contact our support team immediately.
    
    Best regards,
    The MCB App Team
  `;

  return await sendEmail({
    to: email,
    subject: '✅ Password Reset Successful - MCB App',
    html,
    text,
  });
};
