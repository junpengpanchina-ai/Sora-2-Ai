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

    // 获取用户数据
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        videos: true,
        referrals: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 计算用户统计
    const totalVideos = user.videos.length
    const monthlyVideos = user.videos.filter(v => {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return v.createdAt >= monthAgo
    }).length

    const referralCount = user.referralCount || 0
    const socialShares = 0 // 暂时设为0，后续可以从分享统计表获取

    // 计算用户等级
    let userTier = 'bronze'
    if (monthlyVideos >= 200) userTier = 'diamond'
    else if (monthlyVideos >= 100) userTier = 'gold'
    else if (monthlyVideos >= 50) userTier = 'silver'

    // 检查成就
    const achievements = []
    
    if (totalVideos >= 1) achievements.push('first_video')
    if (totalVideos >= 10) achievements.push('video_master')
    if (socialShares >= 10) achievements.push('social_butterfly')
    if (referralCount >= 5) achievements.push('referral_king')
    if (monthlyVideos >= 7) achievements.push('streak_master')
    if (totalVideos >= 50) achievements.push('quality_creator')

    return NextResponse.json({
      userTier,
      totalVideos,
      monthlyVideos,
      referralCount,
      freeVideosLeft: user.freeVideosLeft || 0,
      achievements,
      socialShares
    })
  } catch (error) {
    console.error('获取成就数据失败:', error)
    return NextResponse.json({ error: '获取成就数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { achievementId, action } = await request.json()

    // 处理成就相关动作
    if (action === 'claim_reward') {
      // 发放奖励
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          freeVideosLeft: {
            increment: 1
          }
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: '奖励已发放' 
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('处理成就失败:', error)
    return NextResponse.json({ error: '处理成就失败' }, { status: 500 })
  }
}
