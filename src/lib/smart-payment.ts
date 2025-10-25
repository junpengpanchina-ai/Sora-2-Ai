// 智能支付系统
import { prisma } from './prisma'
import { stripe } from './stripe'

export interface SavedPaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'digital_wallet'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: Date
}

export interface SmartPaymentConfig {
  // 保存支付方式
  savedMethods: {
    enabled: boolean
    maxMethods: number
    autoSave: boolean
  }
  // 智能推荐
  smartRecommendation: {
    enabled: boolean
    preferredMethod: string | null
    costOptimization: boolean
    securityLevel: 'high' | 'medium' | 'low'
  }
  // 分期付款
  installmentOptions: {
    enabled: boolean
    terms: InstallmentTerm[]
    eligibility: boolean
  }
}

export interface InstallmentTerm {
  id: string
  name: string
  months: number
  interestRate: number
  minAmount: number
  maxAmount: number
}

export interface PaymentRecommendation {
  method: string
  reason: string
  confidence: number
  benefits: string[]
}

export class SmartPayment {
  private config: SmartPaymentConfig

  constructor(config: SmartPaymentConfig) {
    this.config = config
  }

  // 获取用户的保存支付方式
  async getSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { payments: true }
    })

    if (!user?.stripeCustomerId) {
      return []
    }

    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card'
      })

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: 'card',
        last4: pm.card?.last4 || '',
        brand: pm.card?.brand || '',
        expiryMonth: pm.card?.exp_month || 0,
        expiryYear: pm.card?.exp_year || 0,
        isDefault: pm.id === user.defaultPaymentMethodId,
        createdAt: new Date(pm.created * 1000)
      }))
    } catch (error) {
      console.error('获取保存支付方式错误:', error)
      return []
    }
  }

  // 保存支付方式
  async savePaymentMethod(
    userId: string, 
    paymentMethodId: string, 
    setAsDefault: boolean = false
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.stripeCustomerId) {
        return false
      }

      // 附加支付方式到客户
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId
      })

      // 如果设置为默认支付方式
      if (setAsDefault) {
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId
          }
        })

        await prisma.user.update({
          where: { id: userId },
          data: { defaultPaymentMethodId: paymentMethodId }
        })
      }

      return true
    } catch (error) {
      console.error('保存支付方式错误:', error)
      return false
    }
  }

  // 智能推荐支付方式
  async getPaymentRecommendation(
    userId: string, 
    amount: number, 
    currency: string = 'usd'
  ): Promise<PaymentRecommendation> {
    const savedMethods = await this.getSavedPaymentMethods(userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { payments: true }
    })

    if (!user) {
      return {
        method: 'card',
        reason: '新用户推荐',
        confidence: 0.7,
        benefits: ['安全', '快速']
      }
    }

    // 分析用户支付历史
    const paymentHistory = user.payments
    const totalPayments = paymentHistory.length
    const successfulPayments = paymentHistory.filter(p => p.status === 'succeeded').length
    const successRate = totalPayments > 0 ? successfulPayments / totalPayments : 1

    // 推荐逻辑
    if (savedMethods.length > 0) {
      const defaultMethod = savedMethods.find(m => m.isDefault)
      if (defaultMethod) {
        return {
          method: defaultMethod.id,
          reason: '您常用的支付方式',
          confidence: 0.9,
          benefits: ['快速', '便捷', '安全']
        }
      }
    }

    // 基于金额推荐
    if (amount > 1000) { // 大额支付
      return {
        method: 'bank_transfer',
        reason: '大额支付推荐银行转账',
        confidence: 0.8,
        benefits: ['低手续费', '安全', '适合大额']
      }
    }

    // 基于成功率推荐
    if (successRate < 0.8) {
      return {
        method: 'card',
        reason: '推荐信用卡支付',
        confidence: 0.7,
        benefits: ['高成功率', '快速', '安全']
      }
    }

    return {
      method: 'card',
      reason: '标准推荐',
      confidence: 0.8,
      benefits: ['快速', '安全', '便捷']
    }
  }

  // 一键支付
  async oneClickPayment(
    userId: string,
    amount: number,
    currency: string = 'usd',
    description: string,
    paymentMethodId?: string
  ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.stripeCustomerId) {
        return { success: false, error: '用户未关联Stripe客户' }
      }

      // 如果没有指定支付方式，使用默认的
      let finalPaymentMethodId = paymentMethodId
      if (!finalPaymentMethodId) {
        const savedMethods = await this.getSavedPaymentMethods(userId)
        const defaultMethod = savedMethods.find(m => m.isDefault)
        if (!defaultMethod) {
          return { success: false, error: '没有可用的支付方式' }
        }
        finalPaymentMethodId = defaultMethod.id
      }

      // 创建支付意图
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // 转换为分
        currency,
        customer: user.stripeCustomerId,
        payment_method: finalPaymentMethodId,
        confirmation_method: 'automatic',
        confirm: true,
        description,
        metadata: {
          userId,
          plan: description
        }
      })

      if (paymentIntent.status === 'succeeded') {
        // 记录支付
        await prisma.payment.create({
          data: {
            stripePaymentId: paymentIntent.id,
            amount: Math.round(amount * 100),
            currency,
            status: 'succeeded',
            paymentMethod: 'card',
            description,
            paidAt: new Date(),
            userId
          }
        })

        return { 
          success: true, 
          paymentIntentId: paymentIntent.id 
        }
      } else {
        return { 
          success: false, 
          error: '支付未完成' 
        }
      }
    } catch (error) {
      console.error('一键支付错误:', error)
      return { 
        success: false, 
        error: '支付失败' 
      }
    }
  }

  // 获取分期付款选项
  async getInstallmentOptions(amount: number): Promise<InstallmentTerm[]> {
    if (!this.config.installmentOptions.enabled) {
      return []
    }

    const options: InstallmentTerm[] = []

    // 3期分期
    if (amount >= 100) {
      options.push({
        id: 'installment_3',
        name: '3期分期',
        months: 3,
        interestRate: 0,
        minAmount: 100,
        maxAmount: 10000
      })
    }

    // 6期分期
    if (amount >= 500) {
      options.push({
        id: 'installment_6',
        name: '6期分期',
        months: 6,
        interestRate: 2.5,
        minAmount: 500,
        maxAmount: 50000
      })
    }

    // 12期分期
    if (amount >= 1000) {
      options.push({
        id: 'installment_12',
        name: '12期分期',
        months: 12,
        interestRate: 5.0,
        minAmount: 1000,
        maxAmount: 100000
      })
    }

    return options.filter(option => 
      amount >= option.minAmount && amount <= option.maxAmount
    )
  }

  // 计算分期付款金额
  calculateInstallmentAmount(
    amount: number, 
    term: InstallmentTerm
  ): { monthlyAmount: number; totalAmount: number; interest: number } {
    const monthlyRate = term.interestRate / 100 / 12
    const months = term.months

    if (term.interestRate === 0) {
      // 无息分期
      return {
        monthlyAmount: amount / months,
        totalAmount: amount,
        interest: 0
      }
    } else {
      // 有息分期
      const monthlyAmount = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1)
      const totalAmount = monthlyAmount * months
      const interest = totalAmount - amount

      return {
        monthlyAmount: Math.round(monthlyAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        interest: Math.round(interest * 100) / 100
      }
    }
  }
}

// 默认配置
export const defaultSmartPaymentConfig: SmartPaymentConfig = {
  savedMethods: {
    enabled: true,
    maxMethods: 5,
    autoSave: true
  },
  smartRecommendation: {
    enabled: true,
    preferredMethod: null,
    costOptimization: true,
    securityLevel: 'high'
  },
  installmentOptions: {
    enabled: true,
    terms: [],
    eligibility: true
  }
}

export const smartPayment = new SmartPayment(defaultSmartPaymentConfig)
