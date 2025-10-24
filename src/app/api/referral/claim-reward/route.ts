import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { rewardId } = await request.json()

    // 查找奖励记录
    const reward = await prisma.referralReward.findFirst({
      where: {
        id: rewardId,
        referrerId: session.user.id,
        claimed: false
      }
    })

    if (!reward) {
      return NextResponse.json({ error: '奖励不存在或已领取' }, { status: 404 })
    }

    // 更新用户免费视频数量
    const videoCount = reward.rewardType === 'video_10s' ? 1 : 
                      reward.rewardType === 'video_15s' ? 1 : 0

    await prisma.$transaction([
      // 更新奖励状态
      prisma.referralReward.update({
        where: { id: rewardId },
        data: { 
          claimed: true,
          claimedAt: new Date()
        }
      }),
      // 更新用户免费视频数量
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          freeVideosLeft: {
            increment: videoCount
          }
        }
      })
    ])

    return NextResponse.json({ 
      success: true,
      message: `成功领取${videoCount}个免费视频`,
      freeVideosLeft: (await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { freeVideosLeft: true }
      }))?.freeVideosLeft || 0
    })
  } catch (error) {
    console.error('领取奖励失败:', error)
    return NextResponse.json({ error: '领取奖励失败' }, { status: 500 })
  }
}
