interface EmailVerificationData {
  userName: string;
  verificationUrl: string;
  appName: string;
  supportEmail: string;
}

interface PasswordResetData {
  userName: string;
  resetUrl: string;
  appName: string;
  supportEmail: string;
  expiryHours: number;
}

interface PasswordResetConfirmationData {
  userName: string;
  appName: string;
  supportEmail: string;
  loginUrl: string;
}

interface WelcomeEmailData {
  userName: string;
  appName: string;
  supportEmail: string;
  dashboardUrl: string;
  helpUrl: string;
}

/**
 * Email verification template
 */
export const emailVerificationTemplate = (data: EmailVerificationData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - ${data.appName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #92400e;
        }
        .code {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.appName}</div>
            <h1 class="title">Verify Your Email Address</h1>
        </div>
        
        <div class="content">
            <p>Hello ${data.userName},</p>
            
            <p>Thank you for signing up with ${data.appName}! To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <div class="code">${data.verificationUrl}</div>
            
            <div class="warning">
                <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.
            </div>
            
            <p>If you didn't create an account with ${data.appName}, please ignore this email or contact our support team if you have concerns.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent by ${data.appName}</p>
            <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Password reset template
 */
export const passwordResetTemplate = (data: PasswordResetData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - ${data.appName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #dc2626;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #b91c1c;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .warning {
            background-color: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #991b1b;
        }
        .code {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin: 10px 0;
        }
        .security-tips {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.appName}</div>
            <h1 class="title">Reset Your Password</h1>
        </div>
        
        <div class="content">
            <p>Hello ${data.userName},</p>
            
            <p>We received a request to reset your password for your ${data.appName} account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <div class="code">${data.resetUrl}</div>
            
            <div class="warning">
                <strong>Important:</strong> This password reset link will expire in ${data.expiryHours} hour(s). If you don't reset your password within this time, you'll need to request a new reset link.
            </div>
            
            <div class="security-tips">
                <h3>Security Tips:</h3>
                <ul>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Never share your password with anyone</li>
                    <li>Use a strong, unique password</li>
                    <li>Enable two-factor authentication if available</li>
                </ul>
            </div>
            
            <p>If you have any concerns about your account security, please contact our support team immediately.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent by ${data.appName}</p>
            <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Password reset confirmation template
 */
export const passwordResetConfirmationTemplate = (data: PasswordResetConfirmationData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful - ${data.appName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #059669;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #047857;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .success {
            background-color: #d1fae5;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #065f46;
        }
        .security-tips {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.appName}</div>
            <h1 class="title">Password Reset Successful</h1>
        </div>
        
        <div class="content">
            <p>Hello ${data.userName},</p>
            
            <div class="success">
                <strong>✅ Success!</strong> Your password has been successfully reset for your ${data.appName} account.
            </div>
            
            <p>You can now log in to your account using your new password. Click the button below to access your account:</p>
            
            <div style="text-align: center;">
                <a href="${data.loginUrl}" class="button">Log In to Your Account</a>
            </div>
            
            <div class="security-tips">
                <h3>Security Reminders:</h3>
                <ul>
                    <li>Keep your new password secure and don't share it with anyone</li>
                    <li>Consider using a password manager to generate and store strong passwords</li>
                    <li>Enable two-factor authentication for added security</li>
                    <li>If you notice any suspicious activity, contact our support team immediately</li>
                </ul>
            </div>
            
            <p>If you didn't make this password change, please contact our support team immediately as your account may have been compromised.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent by ${data.appName}</p>
            <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Welcome email template
 */
export const welcomeEmailTemplate = (data: WelcomeEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${data.appName}!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .welcome {
            background-color: #dbeafe;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .features {
            background-color: #f8fafc;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature-item {
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
        }
        .feature-item::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #059669;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${data.appName}</div>
            <h1 class="title">Welcome to ${data.appName}!</h1>
        </div>
        
        <div class="content">
            <p>Hello ${data.userName},</p>
            
            <div class="welcome">
                <h2>🎉 Your account is now verified and ready to use!</h2>
                <p>Thank you for joining ${data.appName}. We're excited to have you on board!</p>
            </div>
            
            <p>You can now access all the features of our platform. Here's what you can do:</p>
            
            <div class="features">
                <h3>What's Next?</h3>
                <div class="feature-item">Access your personalized dashboard</div>
                <div class="feature-item">Explore our comprehensive course library</div>
                <div class="feature-item">Track your learning progress</div>
                <div class="feature-item">Connect with other learners</div>
                <div class="feature-item">Get personalized recommendations</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team or check out our help center.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.helpUrl}" style="color: #2563eb; text-decoration: none;">📚 Help Center</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by ${data.appName}</p>
            <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
            <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};


