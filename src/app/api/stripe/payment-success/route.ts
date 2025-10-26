import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // 获取支付会话信息
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
      // 支付成功，更新用户会员状态
      const plan = session.metadata?.plan
      const userId = session.metadata?.userId
      
      // 这里可以添加更新数据库的逻辑
      // 例如：更新用户的会员等级、到期时间等
      
      return NextResponse.json({
        success: true,
        plan: plan,
        userId: userId,
        sessionId: sessionId,
        message: '支付成功，会员状态已更新'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Payment not completed',
      sessionId: sessionId
    })

  } catch (error) {
    console.error('处理支付成功失败:', error)
    return NextResponse.json(
      { error: '支付状态处理失败' }, 
      { status: 500 }
    )
  }
}
