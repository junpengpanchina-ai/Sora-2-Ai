import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { smartPayment } from '@/lib/smart-payment'

export const dynamic = 'force-dynamic'

// 一键支付
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { 
      amount, 
      currency = 'usd', 
      description, 
      paymentMethodId 
    } = await request.json()

    if (!amount || !description) {
      return NextResponse.json(
        { error: '金额和描述是必需的' },
        { status: 400 }
      )
    }

    const result = await smartPayment.oneClickPayment(
      session.user.id,
      amount,
      currency,
      description,
      paymentMethodId
    )

    if (result.success) {
      return NextResponse.json({
        message: '支付成功',
        paymentIntentId: result.paymentIntentId
      })
    } else {
      return NextResponse.json(
        { error: result.error || '支付失败' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('一键支付错误:', error)
    return NextResponse.json(
      { error: '支付失败' },
      { status: 500 }
    )
  }
}
