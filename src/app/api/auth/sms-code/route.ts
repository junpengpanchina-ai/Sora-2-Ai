import { NextRequest, NextResponse } from 'next/server'
import { progressiveAuth } from '@/lib/progressive-auth'
import { prisma } from '@/lib/prisma'

// 发送SMS验证码
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: '手机号码是必需的' },
        { status: 400 }
      )
    }

    // 验证手机号格式
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '无效的手机号码格式' },
        { status: 400 }
      )
    }

    // 发送SMS验证码
    const code = await progressiveAuth.sendSMSCode(phone)

    return NextResponse.json({
      message: 'SMS验证码已发送',
      expiresIn: 5 // 分钟
    })

  } catch (error) {
    console.error('发送SMS验证码错误:', error)
    return NextResponse.json(
      { error: '发送SMS验证码失败' },
      { status: 500 }
    )
  }
}

// 验证SMS验证码
export async function PUT(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json(
        { error: '手机号码和验证码是必需的' },
        { status: 400 }
      )
    }

    // 验证SMS验证码
    const isValid = await progressiveAuth.verifySMSCode(phone, code)

    if (!isValid) {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      )
    }

    // 查找或创建用户
    let user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: phone }, // 假设手机号作为邮箱
          { phone: phone }
        ]
      }
    })

    if (!user) {
      // 创建新用户
      user = await prisma.user.create({
        data: {
          email: phone,
          phone: phone,
          phoneVerified: true,
          name: `用户${phone.slice(-4)}`,
          freeVideosLeft: 1
        }
      })
    } else {
      // 更新手机验证状态
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true }
      })
    }

    // 记录登录活动
    await progressiveAuth.logUserActivity(user.id, 'sms_login', {
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })

    return NextResponse.json({
      message: 'SMS验证成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneVerified: true
      }
    })

  } catch (error) {
    console.error('验证SMS验证码错误:', error)
    return NextResponse.json(
      { error: '验证SMS验证码失败' },
      { status: 500 }
    )
  }
}
