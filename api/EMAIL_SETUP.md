# Email Configuration Setup

To enable password reset emails, you need to configure SMTP settings. Follow these steps:

## 1. Create Environment File

Create a `.env` file in the `api` directory with the following variables:

```env
# Database Configuration
DB_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Required for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 2. Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this app password as `SMTP_PASS` (not your regular Gmail password)

### Step 3: Update Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
```

## 3. Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
```

## 4. Testing

After setting up the environment variables:

1. Restart your server: `npm start`
2. Test forgot password functionality
3. Check the server logs for email sending status
4. Check your email inbox for the password reset email

## 5. Troubleshooting

### Common Issues:

1. **"Invalid login" error**: Check your email and app password
2. **"Connection timeout"**: Check SMTP_HOST and SMTP_PORT
3. **"Authentication failed"**: Make sure 2FA is enabled and you're using an app password
4. **Emails not received**: Check spam folder, verify email address

### Debug Mode:
The server will log email sending status in the console. Look for:
- ✅ "Email service ready to send messages" - Configuration is correct
- ✅ "Password reset email sent to [email]" - Email sent successfully
- ❌ "Failed to send email" - Check configuration

## 6. Production Considerations

For production deployment:
1. Use environment variables from your hosting platform
2. Consider using a dedicated email service like SendGrid, Mailgun, or AWS SES
3. Set up proper error monitoring for email failures
4. Implement email rate limiting to prevent abuse
