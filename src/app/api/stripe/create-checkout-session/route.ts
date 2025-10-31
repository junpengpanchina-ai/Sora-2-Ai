import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PLANS } from '@/lib/plans'

export async function POST(request: NextRequest) {
  try {
    const { priceId, plan, locale = 'zh', userId, inviteCode, upgradeFrom } = await request.json()

    // 验证计划
    if (!SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]

    // 免费版不需要支付
    if (plan === 'free') {
      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?activated=free`,
        sessionId: null 
      })
    }

    // 构建支付会话参数
    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      locale: locale,
      currency: 'usd',
      metadata: {
        plan: plan,
        userId: userId || '',
        inviteCode: inviteCode || '',
        upgradeFrom: upgradeFrom || '',
      },
    }

    // 添加客户信息（如果提供）
    if (userId) {
      try {
        // 查找现有客户
        const customers = await stripe.customers.list({
          email: userId,
          limit: 1
        })

        if (customers.data.length > 0) {
          sessionParams.customer = customers.data[0].id
        } else {
          // 创建新客户
          const customer = await stripe.customers.create({
            email: userId,
            metadata: {
              userId: userId
            }
          })
          sessionParams.customer = customer.id
        }
      } catch (error) {
        console.error('客户处理失败:', error)
        // 继续创建会话，不添加客户信息
      }
    }

    // 添加升级优惠
    if (upgradeFrom) {
      const upgradeDiscounts = {
        'free': { coupon: 'FIRST_UPGRADE_50' }, // 首次升级50%优惠
        'bronze': { coupon: 'BRONZE_TO_SILVER_30' }, // 青铜升白银30%优惠
        'silver': { coupon: 'SILVER_TO_GOLD_20' }, // 白银升黄金20%优惠
        'gold': { coupon: 'GOLD_TO_DIAMOND_15' }, // 黄金升钻石15%优惠
      }

      const discount = upgradeDiscounts[upgradeFrom as keyof typeof upgradeDiscounts]
      if (discount) {
        sessionParams.discounts = [discount]
      }
    }

    // 添加邀请奖励
    if (inviteCode) {
      // 这里可以验证邀请码并返回相应的优惠
      sessionParams.discounts = [{
        coupon: 'INVITE_REWARD_10'
      }]
    }

    // 创建支付会话
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ 
      url: session.url, 
      sessionId: session.id 
    })

  } catch (error) {
    console.error('创建支付会话失败:', error)
    return NextResponse.json(
      { error: '支付会话创建失败' }, 
      { status: 500 }
    )
  }
}