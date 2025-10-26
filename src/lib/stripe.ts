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

// 订阅方案配置 - 优化后的会员体系 (USD定价)
export const SUBSCRIPTION_PLANS = {
  free: {
    name: '体验版',
    description: '邀请制激活，快速获客',
    price: 0,
    priceId: '', // 免费版不需要价格ID
    features: [
      '需要邀请码激活',
      '每月10个5秒视频',
      '720p视频质量',
      '邀请1个用户送20积分',
      '社区支持',
      '基础模板',
      '积分奖励系统'
    ],
    limits: {
      videosPerMonth: 10,
      maxDuration: 5, // 秒
      maxResolution: '720p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '邀请制获客'
  },
  bronze: {
    name: '青铜会员',
    description: '入门级会员，保本定价',
    price: 2.00,
    priceId: 'price_1SMX8IDqGbi6No9vtsx2w3Xw', // 青铜会员价格ID
    features: [
      '每月30个5秒视频',
      '720p视频质量',
      '优先支持',
      '高级模板',
      '批量处理',
      '无水印',
      '积分奖励系统'
    ],
    limits: {
      videosPerMonth: 30,
      maxDuration: 5, // 秒
      maxResolution: '720p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '入门用户'
  },
  silver: {
    name: '白银会员',
    description: '进阶级会员，保本定价',
    price: 8.00,
    priceId: 'price_1SMX8tDqGbi6No9v6LPCtisJ', // 白银会员价格ID
    features: [
      '每月60个10秒视频',
      '1080p视频质量',
      '专属客服',
      'API访问',
      '团队协作',
      '自定义品牌',
      '高级分析',
      '积分奖励系统'
    ],
    limits: {
      videosPerMonth: 60,
      maxDuration: 10, // 秒
      maxResolution: '1080p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '进阶用户'
  },
  gold: {
    name: '黄金会员',
    description: '专业级会员，过渡定价',
    price: 20.00,
    priceId: 'price_1SMX9cDqGbi6No9vRbrh4FpH', // 黄金会员价格ID
    features: [
      '每月120个15秒视频',
      '4K视频质量',
      '专属客服',
      'API访问',
      '团队协作',
      '自定义品牌',
      '高级分析',
      '优先处理',
      '积分奖励系统'
    ],
    limits: {
      videosPerMonth: 120,
      maxDuration: 15, // 秒
      maxResolution: '4K'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '专业用户'
  },
  diamond: {
    name: '钻石会员',
    description: '企业级会员，保本定价',
    price: 40.00,
    priceId: 'price_1SMXA3DqGbi6No9vybdXHY29', // 钻石会员价格ID
    features: [
      '每月200个15秒视频',
      '4K视频质量',
      '专属客户经理',
      '企业API',
      '多团队管理',
      '白标解决方案',
      'SLA保障',
      '定制开发',
      '积分奖励系统'
    ],
    limits: {
      videosPerMonth: 200,
      maxDuration: 15, // 秒
      maxResolution: '4K'
    },
    taxBehavior: 'exclusive' as const, // B2B使用exclusive
    targetAudience: '企业客户'
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
