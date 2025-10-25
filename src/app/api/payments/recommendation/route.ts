import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { smartPayment } from '@/lib/smart-payment'

export const dynamic = 'force-dynamic'

// 获取支付推荐
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const amount = parseFloat(searchParams.get('amount') || '0')
    const currency = searchParams.get('currency') || 'usd'

    if (amount <= 0) {
      return NextResponse.json(
        { error: '金额必须大于0' },
        { status: 400 }
      )
    }

    const recommendation = await smartPayment.getPaymentRecommendation(
      session.user.id,
      amount,
      currency
    )

    // 获取分期付款选项
    const installmentOptions = await smartPayment.getInstallmentOptions(amount)

    return NextResponse.json({
      recommendation,
      installmentOptions
    })
  } catch (error) {
    console.error('获取支付推荐错误:', error)
    return NextResponse.json(
      { error: '获取推荐失败' },
      { status: 500 }
    )
  }
}
