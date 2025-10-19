import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取用户的邀请奖励
    const rewards = await prisma.referralReward.findMany({
      where: { referrerId: session.user.id },
      include: {
        referee: {
          select: {
            name: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true,
        referralCount: true,
        freeVideosLeft: true
      }
    })

    return NextResponse.json({
      user,
      rewards
    })
  } catch (error) {
    console.error('获取邀请奖励失败:', error)
    return NextResponse.json({ error: '获取邀请奖励失败' }, { status: 500 })
  }
}
