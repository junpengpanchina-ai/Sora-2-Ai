import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook签名验证失败:', error)
    return NextResponse.json({ error: 'Webhook签名验证失败' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // 更新用户订阅信息
          await prisma.user.update({
            where: { email: session.customer_email! },
            data: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              subscriptionPlan: session.metadata?.plan || 'basic',
              subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000),
            },
          })

          // 创建支付记录
          const user = await prisma.user.findUnique({
            where: { email: session.customer_email! }
          })

          if (user) {
            await prisma.payment.create({
              data: {
                stripePaymentId: session.payment_intent as string,
                stripeSessionId: session.id,
                stripeSubscriptionId: subscription.id,
                amount: session.amount_total || 0,
                currency: session.currency || 'cny',
                status: 'succeeded',
                paymentMethod: 'card',
                description: `订阅 ${session.metadata?.plan || 'basic'} 计划`,
                plan: session.metadata?.plan || 'basic',
                billingPeriod: 'monthly',
                paidAt: new Date(),
                userId: user.id
              }
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            subscriptionStatus: subscription.status,
            subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            subscriptionId: null,
            subscriptionStatus: 'canceled',
            subscriptionPlan: null,
            subscriptionEndsAt: null,
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        await prisma.user.updateMany({
          where: { subscriptionId: (invoice as any).subscription as string },
          data: {
            subscriptionStatus: 'past_due',
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // 查找对应的支付记录并更新
        if (invoice.subscription) {
          await prisma.payment.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: {
              status: 'succeeded',
              paidAt: new Date(),
            }
          })
        }
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        
        // 更新支付记录为争议状态
        await prisma.payment.updateMany({
          where: { stripePaymentId: dispute.payment_intent as string },
          data: {
            status: 'disputed',
            refundReason: `争议: ${dispute.reason}`,
          }
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // 更新支付记录为已退款
        await prisma.payment.updateMany({
          where: { stripePaymentId: charge.payment_intent as string },
          data: {
            status: 'refunded',
            refundedAmount: charge.amount_refunded,
            refundedAt: new Date(),
            refundReason: '用户申请退款',
          }
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // 更新支付记录为失败状态
        await prisma.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: {
            status: 'failed',
          }
        })
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // 更新支付记录为取消状态
        await prisma.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: {
            status: 'canceled',
          }
        })
        break
      }

      default:
        console.log(`未处理的Webhook事件类型: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook处理错误:', error)
    return NextResponse.json(
      { error: 'Webhook处理失败' },
      { status: 500 }
    )
  }
}
