import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取用户的支付记录
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const plan = searchParams.get('plan')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (plan) {
      where.plan = plan
    }

    // 获取支付记录
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          stripePaymentId: true,
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
          paidAt: true,
        }
      }),
      prisma.payment.count({ where })
    ])

    // 计算统计信息
    const stats = await prisma.payment.aggregate({
      where: { userId: session.user.id },
      _sum: {
        amount: true,
        refundedAmount: true,
      },
      _count: {
        id: true,
      }
    })

    const totalAmount = stats._sum.amount || 0
    const totalRefunded = stats._sum.refundedAmount || 0
    const totalPayments = stats._count.id || 0

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalAmount,
        totalRefunded,
        netAmount: totalAmount - totalRefunded,
        totalPayments,
        successRate: totalPayments > 0 ? 
          (await prisma.payment.count({ 
            where: { userId: session.user.id, status: 'succeeded' } 
          })) / totalPayments * 100 : 0
      }
    })
  } catch (error) {
    console.error('获取支付记录错误:', error)
    return NextResponse.json(
      { error: '获取支付记录失败' },
      { status: 500 }
    )
  }
}


