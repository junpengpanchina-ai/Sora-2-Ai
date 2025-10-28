// 支付处理工具 - 优化价格充值逻辑
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from './stripe'
import { stripe } from './stripe'

// 支付配置
export interface PaymentConfig {
  successUrl: string
  cancelUrl: string
  locale: string
  currency: string
}

// 支付会话创建参数
export interface CreateCheckoutSessionParams {
  plan: SubscriptionPlan
  userId?: string
  inviteCode?: string
  upgradeFrom?: SubscriptionPlan
  config?: Partial<PaymentConfig>
}

// 支付处理类
export class PaymentProcessor {
  private defaultConfig: PaymentConfig = {
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
    locale: 'zh',
    currency: 'usd'
  }

  // 创建支付会话
  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const { plan, userId, inviteCode, upgradeFrom, config } = params
    const planConfig = SUBSCRIPTION_PLANS[plan]
    const finalConfig = { ...this.defaultConfig, ...config }

    // 验证计划配置
    if (!planConfig) {
      throw new Error(`Invalid plan: ${plan}`)
    }

    // 所有方案都需要支付（包含3天免费试用）

    // 构建支付会话参数
    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: finalConfig.successUrl,
      cancel_url: finalConfig.cancelUrl,
      locale: finalConfig.locale,
      currency: finalConfig.currency,
      metadata: {
        plan: plan,
        userId: userId || '',
        inviteCode: inviteCode || '',
        upgradeFrom: upgradeFrom || '',
      },
    }

    // 添加客户信息（如果提供）
    if (userId) {
      sessionParams.customer = await this.getOrCreateCustomer(userId)
    }

    // 添加升级优惠
    if (upgradeFrom) {
      sessionParams.discounts = await this.getUpgradeDiscounts(upgradeFrom, plan)
    }

    // 添加邀请奖励
    if (inviteCode) {
      sessionParams.discounts = await this.getInviteDiscounts(inviteCode)
    }

    try {
      const session = await stripe.checkout.sessions.create(sessionParams)
      return { url: session.url, sessionId: session.id }
    } catch (error) {
      console.error('创建支付会话失败:', error)
      throw new Error('支付会话创建失败')
    }
  }

  // 处理免费版激活
  private async handleFreePlanActivation(userId?: string, inviteCode?: string) {
    // 这里可以添加免费版激活逻辑
    // 例如：验证邀请码、创建用户账户等
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?activated=free`,
      sessionId: null
    }
  }

  // 获取或创建客户
  private async getOrCreateCustomer(userId: string) {
    try {
      // 这里应该从数据库获取客户的Stripe Customer ID
      // 如果不存在，则创建新的客户
      const customers = await stripe.customers.list({
        email: userId, // 假设userId是邮箱
        limit: 1
      })

      if (customers.data.length > 0) {
        return customers.data[0].id
      }

      // 创建新客户
      const customer = await stripe.customers.create({
        email: userId,
        metadata: {
          userId: userId
        }
      })

      return customer.id
    } catch (error) {
      console.error('获取或创建客户失败:', error)
      throw new Error('客户信息处理失败')
    }
  }

  // 获取升级优惠
  private async getUpgradeDiscounts(fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan) {
    const upgradeDiscounts: Record<string, { coupon: string }> = {
      'free': { coupon: 'FIRST_UPGRADE_50' }, // 首次升级50%优惠
      'bronze': { coupon: 'BRONZE_TO_SILVER_30' }, // 青铜升白银30%优惠
      'silver': { coupon: 'SILVER_TO_GOLD_20' }, // 白银升黄金20%优惠
      'gold': { coupon: 'GOLD_TO_DIAMOND_15' }, // 黄金升钻石15%优惠
    }

    const discount = upgradeDiscounts[fromPlan]
    return discount ? [discount] : []
  }

  // 获取邀请奖励
  private async getInviteDiscounts(inviteCode: string) {
    // 这里可以验证邀请码并返回相应的优惠
    // 例如：邀请码有效时提供10%优惠
    return [{
      coupon: 'INVITE_REWARD_10'
    }]
  }

  // 创建客户门户会话
  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })

      return { url: session.url }
    } catch (error) {
      console.error('创建客户门户会话失败:', error)
      throw new Error('客户门户创建失败')
    }
  }

  // 处理支付成功
  async handlePaymentSuccess(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      if (session.payment_status === 'paid') {
        // 这里可以添加支付成功后的逻辑
        // 例如：更新用户会员状态、发送确认邮件等
        return {
          success: true,
          plan: session.metadata?.plan,
          userId: session.metadata?.userId,
          sessionId: sessionId
        }
      }

      return { success: false, error: 'Payment not completed' }
    } catch (error) {
      console.error('处理支付成功失败:', error)
      throw new Error('支付状态处理失败')
    }
  }

  // 处理支付失败
  async handlePaymentFailure(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      // 这里可以添加支付失败后的逻辑
      // 例如：发送失败通知、提供重试选项等
      return {
        success: false,
        plan: session.metadata?.plan,
        userId: session.metadata?.userId,
        sessionId: sessionId,
        error: 'Payment failed'
      }
    } catch (error) {
      console.error('处理支付失败失败:', error)
      throw new Error('支付失败处理失败')
    }
  }
}

// 价格计算工具
export class PriceCalculator {
  // 计算升级价格
  static calculateUpgradePrice(fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): number {
    const fromPrice = SUBSCRIPTION_PLANS[fromPlan].price
    const toPrice = SUBSCRIPTION_PLANS[toPlan].price
    
    return toPrice - fromPrice
  }

  // 计算升级优惠
  static calculateUpgradeDiscount(fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): number {
    const upgradePrice = this.calculateUpgradePrice(fromPlan, toPlan)
    const discountRates: Record<string, number> = {
      'free': 0.5, // 50%优惠
      'bronze': 0.3, // 30%优惠
      'silver': 0.2, // 20%优惠
      'gold': 0.15, // 15%优惠
    }

    const discountRate = discountRates[fromPlan] || 0
    return upgradePrice * discountRate
  }

  // 计算最终价格
  static calculateFinalPrice(plan: SubscriptionPlan, discounts: number = 0): number {
    const basePrice = SUBSCRIPTION_PLANS[plan].price
    return Math.max(0, basePrice - discounts)
  }

  // 计算年付优惠
  static calculateAnnualDiscount(plan: SubscriptionPlan): number {
    const monthlyPrice = SUBSCRIPTION_PLANS[plan].price
    const annualPrice = monthlyPrice * 12
    const discountRate = 0.2 // 20%年付优惠
    return annualPrice * discountRate
  }
}

// 支付状态监控
export class PaymentMonitor {
  // 监控支付状态
  static async monitorPaymentStatus(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      return {
        status: session.payment_status,
        plan: session.metadata?.plan,
        userId: session.metadata?.userId,
        amount: session.amount_total,
        currency: session.currency
      }
    } catch (error) {
      console.error('监控支付状态失败:', error)
      throw new Error('支付状态监控失败')
    }
  }

  // 获取订阅信息
  static async getSubscriptionInfo(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      return {
        id: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0]?.price?.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    } catch (error) {
      console.error('获取订阅信息失败:', error)
      throw new Error('订阅信息获取失败')
    }
  }
}

// 导出支付处理器实例
export const paymentProcessor = new PaymentProcessor()
