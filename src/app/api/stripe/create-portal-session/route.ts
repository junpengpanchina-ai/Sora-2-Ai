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

    const { returnUrl } = await request.json()

    // 获取用户的Stripe客户ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: '未找到Stripe客户信息' }, { status: 404 })
    }

    // 创建客户门户会话
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
    })

    return NextResponse.json({ 
      url: portalSession.url
    })
  } catch (error) {
    console.error('创建客户门户会话错误:', error)
    return NextResponse.json(
      { error: '创建客户门户会话失败' },
      { status: 500 }
    )
  }
}
