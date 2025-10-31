// Client-safe subscription plans config (no Stripe server SDK imports here)

export const SUBSCRIPTION_PLANS = {
  solo: {
    name: 'Sora Solo',
    description: '个人创作者的专业AI视频生成方案',
    price: 42.0,
    priceId: 'price_1SMX8IDqGbi6No9vtsx2w3Xw',
    checkoutUrl: 'https://buy.stripe.com/5kQaEXaIi2bVall7iE0kE00',
    features: [
      '3天免费试用',
      '每月50个AI视频生成',
      '最长30秒视频时长',
      '4K超高清画质',
      'AI智能剪辑',
      'AI配音和字幕',
      '热门模板库',
      '无水印导出',
      '优先处理队列',
      '邮件技术支持',
    ],
    limits: {
      videosPerMonth: 50,
      maxDuration: 30,
      maxResolution: '4K',
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '个人创作者和内容制作人',
    trialDays: 3,
  },
  teams: {
    name: 'Sora Teams',
    description: '团队协作的企业级AI视频解决方案',
    price: 299.0,
    priceId: 'price_1SMX8tDqGbi6No9v6LPCtisJ',
    checkoutUrl: 'https://buy.stripe.com/fZu00jaIidUDctt46s0kE02',
    features: [
      '3天免费试用',
      '每月200个AI视频生成',
      '最长60秒视频时长',
      '4K超高清画质',
      'AI智能剪辑',
      'AI配音和字幕',
      '全部模板库',
      '团队协作功能',
      '最多10名团队成员',
      '批量处理',
      'API接口访问',
      '自定义品牌水印',
      '高级数据分析',
      '专属客户经理',
      '7x24小时技术支持',
    ],
    limits: {
      videosPerMonth: 200,
      maxDuration: 60,
      maxResolution: '4K',
      maxTeamMembers: 10,
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: '企业团队和代理商',
    trialDays: 3,
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS


