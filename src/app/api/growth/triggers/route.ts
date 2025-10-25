import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { growthEngine, VIRAL_TRIGGERS } from '@/lib/growth-engine'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取用户个性化触发器
    const triggers = growthEngine.getPersonalizedTriggers(session.user.id)
    
    // 模拟用户行为数据
    const userBehavior = {
      totalVideos: 15,
      monthlyVideos: 8,
      socialShares: 5,
      referralCount: 2,
      lastActiveAt: new Date(),
      streakDays: 3
    }

    // 基于用户行为过滤触发器
    const activeTriggers = triggers.filter(trigger => {
      switch (trigger.id) {
        case 'first_video':
          return userBehavior.totalVideos === 1
        case 'viral_moment':
          return userBehavior.socialShares >= 10
        case 'scarcity_alert':
          return userBehavior.monthlyVideos < 5
        case 'fear_missing':
          return userBehavior.streakDays === 0
        case 'surprise_gift':
          return Math.random() > 0.7 // 30% 概率
        default:
          return true
      }
    })

    return NextResponse.json({
      triggers: activeTriggers,
      userBehavior,
      recommendations: growthEngine.getGrowthRecommendations()
    })
  } catch (error) {
    console.error('获取触发器失败:', error)
    return NextResponse.json({ error: '获取触发器失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { triggerId, action } = await request.json()

    // 查找触发器
    const trigger = VIRAL_TRIGGERS.find(t => t.id === triggerId)
    if (!trigger) {
      return NextResponse.json({ error: '触发器不存在' }, { status: 404 })
    }

    // 处理触发器动作
    let result = { success: true, message: '', reward: '' }

    switch (triggerId) {
      case 'first_video':
        if (action === 'share') {
          result.message = '恭喜！您获得了1个免费视频奖励'
          result.reward = '1个免费视频'
        }
        break
      case 'viral_moment':
        if (action === 'share') {
          result.message = '太棒了！您获得了3个免费视频奖励'
          result.reward = '3个免费视频'
        }
        break
      case 'scarcity_alert':
        if (action === 'upgrade') {
          result.message = '升级成功！您已享受7折优惠'
          result.reward = '节省$12'
        }
        break
      case 'fear_missing':
        if (action === 'create') {
          result.message = '创作灵感包已发送到您的账户'
          result.reward = '创作灵感包'
        }
        break
      case 'surprise_gift':
        if (action === 'claim') {
          const gifts = ['1个免费视频', '创作模板包', '专属滤镜', '优先处理']
          const randomGift = gifts[Math.floor(Math.random() * gifts.length)]
          result.message = `恭喜！您获得了${randomGift}`
          result.reward = randomGift
        }
        break
      default:
        result.message = '操作成功'
    }

    // 记录触发器使用
    console.log(`用户 ${session.user.id} 触发了 ${triggerId}，执行动作: ${action}`)

    return NextResponse.json(result)
  } catch (error) {
    console.error('处理触发器失败:', error)
    return NextResponse.json({ error: '处理触发器失败' }, { status: 500 })
  }
}
