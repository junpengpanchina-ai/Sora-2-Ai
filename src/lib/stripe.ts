import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
  free: {
    name: '免费版',
    description: '需要邀请码激活',
    price: 0,
    priceId: '', // 免费版不需要价格ID
    features: [
      '需要邀请码激活',
      '每月3个免费视频',
      '5秒视频长度',
      '720p视频质量',
      '社区支持',
      '基础模板'
    ],
    limits: {
      videosPerMonth: 3,
      maxDuration: 5, // 秒
      maxResolution: '720p'
    }
  },
  basic: {
    name: '基础版',
    description: '适合个人用户',
    price: 4.99,
    priceId: 'price_basic_monthly', // 基础版价格ID
    features: [
      '每月15个视频',
      '10秒视频长度',
      '720p视频质量',
      '标准支持',
      '社区访问'
    ],
    limits: {
      videosPerMonth: 15,
      maxDuration: 10, // 秒
      maxResolution: '720p'
    }
  },
  pro: {
    name: '专业版',
    description: '适合内容创作者',
    price: 19.99,
    priceId: 'price_pro_monthly', // 专业版价格ID
    features: [
      '每月40个视频',
      '15秒视频长度',
      '1080p视频质量',
      '优先支持',
      '高级模板',
      '批量处理'
    ],
    limits: {
      videosPerMonth: 40,
      maxDuration: 15,
      maxResolution: '1080p'
    }
  },
  enterprise: {
    name: '企业版',
    description: '适合团队和企业',
    price: 59.99,
    priceId: 'price_enterprise_monthly', // 企业版价格ID
    features: [
      '每月120个视频',
      '15秒视频长度',
      '4K视频质量',
      '专属客服',
      'API访问',
      '团队管理',
      '自定义品牌'
    ],
    limits: {
      videosPerMonth: 120,
      maxDuration: 15,
      maxResolution: '4K'
    }
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
