import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import sgMail from '@sendgrid/mail'

// 初始化 SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // 为了安全，即使找不到用户也返回成功消息
      return NextResponse.json({
        message: 'If an account exists with that email, we have sent a password reset link.'
      })
    }

    // 生成重置token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1小时后过期

    // 保存重置token到数据库
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // 如果有SendGrid配置，发送邮件
    if (process.env.SENDGRID_API_KEY) {
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
      
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourapp.com',
        subject: 'Reset Your Password - Sora AI Platform',
        text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">Sora AI Platform</h1>
              </div>
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
                <p>You requested a password reset for your account. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                  If you didn't request a password reset, you can safely ignore this email.
                </p>
                <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                  <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Sora AI Platform. All rights reserved.</p>
              </div>
            </body>
          </html>
        `
      }

      await sgMail.send(msg)
    } else {
      // 开发环境：打印重置链接到控制台
      console.log('\n=== FORGOT PASSWORD ===')
      console.log(`Reset token for ${email}: ${resetToken}`)
      console.log(`Reset URL: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
      console.log('=======================\n')
    }

    return NextResponse.json({
      message: 'If an account exists with that email, we have sent a password reset link.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

