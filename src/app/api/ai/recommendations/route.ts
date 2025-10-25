import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllRecommendations, recordUserFeedback } from '@/lib/ai-personalization'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const recommendations = await getAllRecommendations(session.user.id)
    
    return NextResponse.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('获取AI推荐失败:', error)
    return NextResponse.json(
      { error: '获取推荐失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { recommendationId, feedback } = await request.json()
    
    if (!recommendationId || !feedback) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    await recordUserFeedback(session.user.id, recommendationId, feedback)
    
    return NextResponse.json({
      success: true,
      message: '反馈已记录'
    })
  } catch (error) {
    console.error('记录用户反馈失败:', error)
    return NextResponse.json(
      { error: '记录反馈失败' },
      { status: 500 }
    )
  }
}
