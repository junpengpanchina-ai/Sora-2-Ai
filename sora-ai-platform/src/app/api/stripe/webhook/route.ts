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

          await prisma.user.update({
            where: { email: session.customer_email! },
            data: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              subscriptionPlan: session.metadata?.plan || 'basic',
              subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000),
            },
          })
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
