import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { priceId, plan, locale = 'zh' } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: '缺少价格ID' }, { status: 400 })
    }

    // 获取或创建Stripe客户
    let customer
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId)
    } else {
      customer = await stripe.customers.create({
        email: session.user.email,
        name: user?.name || session.user.name,
        metadata: {
          userId: user?.id || '',
        },
      })
      
      // 更新用户记录中的Stripe客户ID
      await prisma.user.update({
        where: { email: session.user.email },
        data: { stripeCustomerId: customer.id }
      })
    }

    // 创建Stripe结账会话
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      locale: locale === 'zh' ? 'zh' : 'en',
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      subscription_data: {
        metadata: {
          plan: plan,
          userId: user?.id || '',
        },
      },
      metadata: {
        plan: plan,
        userId: user?.id || '',
        userEmail: session.user.email,
      },
      // 启用自动税务计算（如果配置了Stripe Tax）
      ...(process.env.STRIPE_TAX_ENABLED === 'true' && {
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
      }),
    })

    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id
    })
  } catch (error) {
    console.error('创建结账会话错误:', error)
    return NextResponse.json(
      { error: '创建支付会话失败' },
      { status: 500 }
    )
  }
}
