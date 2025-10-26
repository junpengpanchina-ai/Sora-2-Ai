import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { returnUrl, customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // 创建客户门户会话
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('创建客户门户会话失败:', error)
    return NextResponse.json(
      { error: '客户门户创建失败' }, 
      { status: 500 }
    )
  }
}