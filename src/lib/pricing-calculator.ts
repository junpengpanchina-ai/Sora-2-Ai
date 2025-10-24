// 定价计算器
export interface PricingTier {
  name: string
  monthlyVideos: number
  maxDuration: number // 秒
  pricePerVideo: number // 元/视频
  monthlyPrice: number // 元/月
  features: string[]
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: '免费版',
    monthlyVideos: 3,
    maxDuration: 5,
    pricePerVideo: 0,
    monthlyPrice: 0,
    features: [
      '每月3个免费视频',
      '5秒视频长度',
      '720p视频质量',
      '社区支持'
    ]
  },
  {
    name: '基础版',
    monthlyVideos: 15,
    maxDuration: 10,
    pricePerVideo: 2,
    monthlyPrice: 29,
    features: [
      '每月15个视频',
      '10秒视频长度',
      '720p视频质量',
      '标准支持',
      '基础模板'
    ]
  },
  {
    name: '专业版',
    monthlyVideos: 40,
    maxDuration: 15,
    pricePerVideo: 2.5,
    monthlyPrice: 99,
    features: [
      '每月40个视频',
      '15秒视频长度',
      '1080p视频质量',
      '优先支持',
      '高级模板',
      '批量处理'
    ]
  },
  {
    name: '企业版',
    monthlyVideos: 120,
    maxDuration: 30,
    pricePerVideo: 2.5,
    monthlyPrice: 299,
    features: [
      '每月120个视频',
      '30秒视频长度',
      '4K视频质量',
      '专属客服',
      'API访问',
      '团队管理',
      '自定义品牌'
    ]
  }
]

// 按秒计费的计算（如果需要）
export const calculatePerSecondPricing = (duration: number, tier: PricingTier): number => {
  // 基础价格：每视频2元起
  const basePrice = 2
  // 时长加成：每秒0.1元
  const durationPrice = duration * 0.1
  // 质量加成：根据分辨率
  const qualityMultiplier = tier.name === '企业版' ? 1.5 : tier.name === '专业版' ? 1.2 : 1
  
  return (basePrice + durationPrice) * qualityMultiplier
}

// 获取推荐方案
export const getRecommendedPlan = (monthlyVideos: number, avgDuration: number): PricingTier => {
  // 根据使用量推荐最合适的方案
  if (monthlyVideos <= 3 && avgDuration <= 5) {
    return PRICING_TIERS[0] // 免费版
  } else if (monthlyVideos <= 15 && avgDuration <= 10) {
    return PRICING_TIERS[1] // 基础版
  } else if (monthlyVideos <= 40 && avgDuration <= 15) {
    return PRICING_TIERS[2] // 专业版
  } else {
    return PRICING_TIERS[3] // 企业版
  }
}

// 计算节省金额
export const calculateSavings = (tier: PricingTier, payAsYouGo: boolean = false): number => {
  if (tier.name === '免费版') return 0
  
  const payAsYouGoPrice = tier.monthlyVideos * calculatePerSecondPricing(tier.maxDuration, tier)
  return payAsYouGoPrice - tier.monthlyPrice
}
