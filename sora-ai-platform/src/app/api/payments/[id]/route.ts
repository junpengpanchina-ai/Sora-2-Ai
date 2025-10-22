import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取单个支付记录详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      select: {
        id: true,
        stripePaymentId: true,
        stripeSessionId: true,
        stripeSubscriptionId: true,
        amount: true,
        currency: true,
        status: true,
        paymentMethod: true,
        description: true,
        plan: true,
        billingPeriod: true,
        refundedAmount: true,
        refundedAt: true,
        refundReason: true,
        createdAt: true,
        updatedAt: true,
        paidAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: '支付记录不存在' }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('获取支付记录详情错误:', error)
    return NextResponse.json(
      { error: '获取支付记录详情失败' },
      { status: 500 }
    )
  }
}


