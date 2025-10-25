import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { smartPayment } from '@/lib/smart-payment'

export const dynamic = 'force-dynamic'

// 获取保存的支付方式
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const savedMethods = await smartPayment.getSavedPaymentMethods(session.user.id)
    
    return NextResponse.json({ savedMethods })
  } catch (error) {
    console.error('获取保存支付方式错误:', error)
    return NextResponse.json(
      { error: '获取支付方式失败' },
      { status: 500 }
    )
  }
}

// 保存支付方式
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { paymentMethodId, setAsDefault } = await request.json()

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: '支付方式ID是必需的' },
        { status: 400 }
      )
    }

    const success = await smartPayment.savePaymentMethod(
      session.user.id,
      paymentMethodId,
      setAsDefault || false
    )

    if (success) {
      return NextResponse.json({ message: '支付方式保存成功' })
    } else {
      return NextResponse.json(
        { error: '保存支付方式失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('保存支付方式错误:', error)
    return NextResponse.json(
      { error: '保存支付方式失败' },
      { status: 500 }
    )
  }
}
