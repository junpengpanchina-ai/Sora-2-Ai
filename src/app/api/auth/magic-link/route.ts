import { NextRequest, NextResponse } from 'next/server'
import { progressiveAuth } from '@/lib/progressive-auth'
import { prisma } from '@/lib/prisma'
import { signIn } from 'next-auth/react'

// 生成魔法链接
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 生成魔法链接
    const magicLink = await progressiveAuth.generateMagicLink(email)

    // 这里应该发送邮件，暂时返回链接用于测试
    return NextResponse.json({
      message: '魔法链接已生成',
      magicLink, // 生产环境中不应该返回这个
      expiresIn: 15 // 分钟
    })

  } catch (error) {
    console.error('生成魔法链接错误:', error)
    return NextResponse.json(
      { error: '生成魔法链接失败' },
      { status: 500 }
    )
  }
}

// 验证魔法链接
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '无效的魔法链接' },
        { status: 400 }
      )
    }

    // 验证魔法链接
    const result = await progressiveAuth.verifyMagicLink(token)

    if (!result.valid) {
      return NextResponse.json(
        { error: '魔法链接无效或已过期' },
        { status: 400 }
      )
    }

    // 找到用户
    const user = await prisma.user.findUnique({
      where: { email: result.email! }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 记录登录活动
    await progressiveAuth.logUserActivity(user.id, 'magic_link_login', {
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })

    // 返回成功，前端会处理登录
    return NextResponse.json({
      message: '魔法链接验证成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error('验证魔法链接错误:', error)
    return NextResponse.json(
      { error: '验证魔法链接失败' },
      { status: 500 }
    )
  }
}
