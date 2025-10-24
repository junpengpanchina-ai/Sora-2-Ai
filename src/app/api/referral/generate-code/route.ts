import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    // 如果用户已有邀请码，直接返回
    if (user.referralCode) {
      return NextResponse.json({
        message: '邀请码已生成',
        referralCode: user.referralCode,
        inviteLink: `${process.env.NEXTAUTH_URL}/auth/signup?ref=${user.referralCode}`
      })
    }

    // 生成新的邀请码
    const referralCode = `${user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}${Math.random().toString(36).substr(2, 6)}`

    // 更新用户邀请码
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode }
    })

    return NextResponse.json({
      message: '邀请码生成成功',
      referralCode,
      inviteLink: `${process.env.NEXTAUTH_URL}/auth/signup?ref=${referralCode}`
    })

  } catch (error) {
    console.error('生成邀请码错误:', error)
    return NextResponse.json(
      { message: '生成邀请码失败' },
      { status: 500 }
    )
  }
}