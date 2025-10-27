# SendGrid Email Configuration Guide

This guide will help you set up SendGrid for sending password reset emails and other transactional emails.

## 1. Create a SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (allows 100 emails per day)
3. Complete the account verification

## 2. Create an API Key

1. Log in to your SendGrid account
2. Navigate to **Settings** > **API Keys**
3. Click **Create API Key**
4. Give it a name (e.g., "Sora AI Platform")
5. Select **Full Access** or **Restricted Access** with Mail Send permissions
6. Click **Create & View**
7. **Copy the API key** (you won't be able to see it again)

## 3. Verify a Sender Identity

SendGrid requires you to verify either a single sender or a domain:

### Option A: Single Sender Verification (Recommended for Development)

1. Go to **Settings** > **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - **From email**: Your email address (e.g., noreply@yourapp.com)
   - **Reply to**: Your email address
   - **From name**: Your app name (e.g., "Sora AI Platform")
   - **Company address**: Your company address
   - **City, State, Country**: Your location
4. Click **Create**
5. Check your email and click the verification link

### Option B: Domain Authentication (Recommended for Production)

1. Go to **Settings** > **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select your DNS provider
4. Follow the instructions to add DNS records
5. Wait for verification (may take up to 48 hours)

## 4. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourapp.com

# Optional: SendGrid contact details
SENDGRID_FROM_NAME=Sora AI Platform
```

## 5. Install SendGrid Package (if not already installed)

```bash
npm install @sendgrid/mail
```

## 6. Test Email Sending

### Development Environment

In development, the app will print reset links to the console instead of sending emails. Check your terminal when testing the forgot password flow.

### Production Environment

Once you've configured SendGrid, the app will automatically send emails to users.

## 7. Email Templates

The app uses the following email templates:

### Password Reset Email
- **To**: User's email address
- **From**: Your configured sender email
- **Subject**: "Reset Your Password"
- **Content**: Contains a link with reset token valid for 1 hour

## 8. Troubleshooting

### Emails not being sent

1. Check that your API key is valid
2. Verify your sender identity is verified
3. Check that environment variables are set correctly
4. Look for errors in the application logs

### Development vs Production

- **Development**: Reset links are printed to console
- **Production**: Reset links are sent via email using SendGrid

## 9. Rate Limits

### Free Tier
- 100 emails per day
- Unlimited contacts

### Essential Tier ($19.95/month)
- 50,000 emails per month
- 100 emails per day

### Pro Tier ($89.95/month)
- 100,000 emails per month
- 100 emails per day

## 10. Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Monitor your email sending** for suspicious activity
5. **Use restricted API keys** with minimal permissions

## Alternative Email Providers

If you prefer not to use SendGrid, you can modify the email sending logic in:
- `src/app/api/auth/forgot-password/route.ts`

Popular alternatives:
- AWS SES
- Mailgun
- Postmark
- Resend

