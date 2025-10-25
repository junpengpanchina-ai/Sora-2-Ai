import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { socialInvitation } from '@/lib/social-invitation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 发送邀请
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { channel, recipients, message, personalized } = await request.json()

    if (!channel || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: '渠道和收件人是必需的' },
        { status: 400 }
      )
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.referralCode) {
      return NextResponse.json(
        { error: '用户没有邀请码' },
        { status: 400 }
      )
    }

    // 生成个性化消息
    let finalMessage = message
    if (personalized && recipients.length > 0) {
      const personalizedMessage = await socialInvitation.generatePersonalizedMessage(
        session.user.id,
        recipients[0], // 简化：使用第一个收件人
        channel
      )
      finalMessage = personalizedMessage.replace('{inviteLink}', 
        socialInvitation.generateInviteLink(session.user.id, user.referralCode)
      )
    }

    // 发送邀请
    const result = await socialInvitation.sendInvitation(
      session.user.id,
      channel,
      recipients,
      finalMessage
    )

    return NextResponse.json({
      message: '邀请发送完成',
      result
    })
  } catch (error) {
    console.error('发送邀请错误:', error)
    return NextResponse.json(
      { error: '发送邀请失败' },
      { status: 500 }
    )
  }
}
