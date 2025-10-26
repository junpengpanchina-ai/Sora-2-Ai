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

// 订阅方案配置 - 基于成本优化的炸裂获客策略 (USD定价)
export const SUBSCRIPTION_PLANS = {
  free: {
    name: '体验版',
    description: '邀请制激活，快速获客',
    price: 0,
    priceId: '', // 免费版不需要价格ID
    features: [
      '需要邀请码激活',
      '每月5个免费视频',
      '3秒视频长度',
      '720p视频质量',
      '邀请1个用户送10秒视频',
      '社区支持',
      '基础模板'
    ],
    limits: {
      videosPerMonth: 5,
      maxDuration: 3, // 秒
      maxResolution: '720p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '邀请制获客'
  },
  creator: {
    name: '创作者版',
    description: '内容创作者的理想选择',
    price: 2.75,
    priceId: 'price_creator_monthly', // 创作者版价格ID
    features: [
      '每月30个视频',
      '8秒视频长度',
      '1080p视频质量',
      '优先支持',
      '高级模板',
      '批量处理',
      '无水印'
    ],
    limits: {
      videosPerMonth: 30,
      maxDuration: 8, // 秒
      maxResolution: '1080p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '内容创作者'
  },
  pro: {
    name: '专业版',
    description: '专业用户的最佳选择',
    price: 8.25,
    priceId: 'price_pro_monthly', // 专业版价格ID
    features: [
      '每月80个视频',
      '12秒视频长度',
      '4K视频质量',
      '专属客服',
      'API访问',
      '团队协作',
      '自定义品牌',
      '高级分析'
    ],
    limits: {
      videosPerMonth: 80,
      maxDuration: 12,
      maxResolution: '4K'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '专业用户'
  },
  enterprise: {
    name: '企业版',
    description: '企业级解决方案',
    price: 27.50,
    priceId: 'price_enterprise_monthly', // 企业版价格ID
    features: [
      '每月200个视频',
      '15秒视频长度',
      '4K视频质量',
      '专属客户经理',
      '企业API',
      '多团队管理',
      '白标解决方案',
      'SLA保障',
      '定制开发'
    ],
    limits: {
      videosPerMonth: 200,
      maxDuration: 15,
      maxResolution: '4K'
    },
    taxBehavior: 'exclusive' as const, // B2B使用exclusive
    targetAudience: '企业客户'
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
