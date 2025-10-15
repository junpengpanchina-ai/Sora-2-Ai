import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    const { loadStripe } = require('@stripe/stripe-js')
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return null
}

// 订阅方案配置
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: '基础版',
    description: '适合个人用户',
    price: 29,
    priceId: 'price_basic_monthly', // 需要在Stripe中创建
    features: [
      '每月10个视频',
      '基础视频质量',
      '标准支持',
      '社区访问'
    ],
    limits: {
      videosPerMonth: 10,
      maxDuration: 10, // 秒
      maxResolution: '720p'
    }
  },
  pro: {
    name: '专业版',
    description: '适合内容创作者',
    price: 99,
    priceId: 'price_pro_monthly',
    features: [
      '每月50个视频',
      '高清视频质量',
      '优先支持',
      '高级模板',
      '批量处理'
    ],
    limits: {
      videosPerMonth: 50,
      maxDuration: 15,
      maxResolution: '1080p'
    }
  },
  enterprise: {
    name: '企业版',
    description: '适合团队和企业',
    price: 299,
    priceId: 'price_enterprise_monthly',
    features: [
      '无限视频生成',
      '4K视频质量',
      '专属客服',
      'API访问',
      '团队管理',
      '自定义品牌'
    ],
    limits: {
      videosPerMonth: -1, // 无限
      maxDuration: 30,
      maxResolution: '4K'
    }
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
