import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { priceId, plan } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: '缺少价格ID' }, { status: 400 })
    }

    // 模拟支付流程，实际应用中应该连接Stripe
    return NextResponse.json({ 
      url: '/dashboard?success=true',
      message: '支付功能演示模式'
    })
  } catch (error) {
    console.error('创建结账会话错误:', error)
    return NextResponse.json(
      { error: '创建支付会话失败' },
      { status: 500 }
    )
  }
}
