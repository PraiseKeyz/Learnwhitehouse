# Email Service Configuration

## Environment Variables Required

Add the following environment variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
APP_NAME=LearnWhitehouse
FRONTEND_URL=http://localhost:3000
SUPPORT_EMAIL=support@learnwhitehouse.com
```

## Email Service Setup

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

### Other Email Providers
- **Outlook/Hotmail**: Use `smtp-mail.outlook.com` with port 587
- **Yahoo**: Use `smtp.mail.yahoo.com` with port 587
- **Custom SMTP**: Configure your own SMTP server details

## Email Templates

The email service includes the following templates:

1. **Email Verification** - Sent when user signs up
2. **Password Reset** - Sent when user requests password reset
3. **Password Reset Confirmation** - Sent after successful password reset
4. **Welcome Email** - Sent after email verification

## Usage

```typescript
import emailService from '../services/emailService';

// Send verification email
await emailService.sendEmailVerificationEmail(
  'user@example.com',
  'verification-token',
  'John Doe'
);

// Send password reset email
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'reset-token',
  'John Doe'
);

// Send welcome email
await emailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe'
);
```

## Features

- ✅ Responsive HTML email templates
- ✅ Fallback text content
- ✅ Security warnings and tips
- ✅ Branded design with app name
- ✅ Error handling and logging
- ✅ Bulk email support
- ✅ Custom email support


