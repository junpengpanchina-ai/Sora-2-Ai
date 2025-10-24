import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      )
    }

    // 获取用户的推荐统计
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        referralRewardsGiven: {
          include: {
            referee: {
              select: { name: true, email: true, createdAt: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        referralRewardsReceived: {
          include: {
            referrer: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取推荐奖励统计
    const stats = {
      totalReferrals: user.referralCount,
      totalRewardsGiven: user.referralRewardsGiven.length,
      totalRewardsReceived: user.referralRewardsReceived.length,
      referralCode: user.referralCode,
      inviteLink: user.referralCode ? `${process.env.NEXTAUTH_URL}/auth/signup?ref=${user.referralCode}` : null
    }

    return NextResponse.json({
      stats,
      rewardsGiven: user.referralRewardsGiven,
      rewardsReceived: user.referralRewardsReceived
    })

  } catch (error) {
    console.error('获取推荐奖励错误:', error)
    return NextResponse.json(
      { message: '获取推荐奖励失败' },
      { status: 500 }
    )
  }
}