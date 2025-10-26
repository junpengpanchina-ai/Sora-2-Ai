// 基于成本的价格模型 - 炸裂获客策略
export interface PricingTier {
  name: string
  monthlyVideos: number
  maxDuration: number // 秒
  pricePerVideo: number // 元/视频
  monthlyPrice: number // 元/月
  costPerSecond: number // 成本/秒 (0.08元)
  marginMultiplier: number // 利润率倍数
  features: string[]
  taxBehavior: 'inclusive' | 'exclusive' // 税务行为
  targetAudience: string
}

// 成本分析：8分钱/秒 = 0.08元/秒 = $0.011/秒 (汇率7.24)
const BASE_COST_PER_SECOND = 0.011 // USD
const EXCHANGE_RATE = 7.24 // 1 USD = 7.24 CNY

// 优化后的会员体系 - 包含黄金会员过渡
export const PRICING_TIERS: PricingTier[] = [
  {
    name: '体验版',
    monthlyVideos: 10, // 5秒视频
    maxDuration: 5,
    pricePerVideo: 0.055, // 成本$0.055，售价$0.055，利润率0%（保本）
    monthlyPrice: 0,
    costPerSecond: BASE_COST_PER_SECOND,
    marginMultiplier: 1.0, // 保本定价
    features: [
      '需要邀请码激活',
      '每月10个5秒视频',
      '720p视频质量',
      '邀请1个用户送20积分',
      '社区支持',
      '基础模板',
      '积分奖励系统'
    ],
    taxBehavior: 'inclusive',
    targetAudience: '邀请制获客'
  },
  {
    name: '青铜会员',
    monthlyVideos: 30, // 5秒视频
    maxDuration: 5,
    pricePerVideo: 0.055, // 成本$0.055，售价$0.055，利润率0%（保本）
    monthlyPrice: 2.00, // $2.00/月（涨价21%）
    costPerSecond: BASE_COST_PER_SECOND,
    marginMultiplier: 1.0, // 保本定价
    features: [
      '每月30个5秒视频',
      '720p视频质量',
      '优先支持',
      '高级模板',
      '批量处理',
      '无水印',
      '积分奖励系统'
    ],
    taxBehavior: 'inclusive',
    targetAudience: '入门用户'
  },
  {
    name: '白银会员',
    monthlyVideos: 60, // 10秒视频
    maxDuration: 10,
    pricePerVideo: 0.11, // 成本$0.11，售价$0.11，利润率0%（保本）
    monthlyPrice: 8.00, // $8.00/月（涨价21%）
    costPerSecond: BASE_COST_PER_SECOND,
    marginMultiplier: 1.0, // 保本定价
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
    taxBehavior: 'inclusive',
    targetAudience: '进阶用户'
  },
  {
    name: '黄金会员',
    monthlyVideos: 120, // 15秒视频
    maxDuration: 15,
    pricePerVideo: 0.165, // 成本$0.165，售价$0.165，利润率0%（保本）
    monthlyPrice: 20.00, // $20.00/月（过渡定价）
    costPerSecond: BASE_COST_PER_SECOND,
    marginMultiplier: 1.0, // 保本定价
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
    taxBehavior: 'inclusive',
    targetAudience: '专业用户'
  },
  {
    name: '钻石会员',
    monthlyVideos: 200, // 15秒视频
    maxDuration: 15,
    pricePerVideo: 0.165, // 成本$0.165，售价$0.165，利润率0%（保本）
    monthlyPrice: 40.00, // $40.00/月（涨价21%）
    costPerSecond: BASE_COST_PER_SECOND,
    marginMultiplier: 1.0, // 保本定价
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
    taxBehavior: 'exclusive', // B2B通常使用exclusive
    targetAudience: '企业客户'
  }
]

// 基于成本的动态定价计算
export const calculateCostBasedPricing = (duration: number, tier: PricingTier): number => {
  const baseCost = duration * tier.costPerSecond
  const margin = baseCost * (tier.marginMultiplier - 1)
  return baseCost + margin
}

// 按秒计费的计算（按需付费模式）- 保持60%以上毛利率
export const calculatePerSecondPricing = (duration: number, tier: PricingTier): number => {
  // 基础价格：每视频$0.25起（确保60%毛利率）
  const basePrice = 0.25
  // 时长加成：每秒$0.035（保持150%利润率）
  const durationPrice = duration * 0.035
  // 质量加成：根据分辨率
  const qualityMultiplier = tier.name === '企业版' ? 1.5 : tier.name === '专业版' ? 1.2 : 1
  
  return (basePrice + durationPrice) * qualityMultiplier
}

// 获取推荐方案（基于新定价策略）
export const getRecommendedPlan = (monthlyVideos: number, avgDuration: number): PricingTier => {
  // 根据使用量推荐最合适的方案
  if (monthlyVideos <= 5 && avgDuration <= 3) {
    return PRICING_TIERS[0] // 体验版
  } else if (monthlyVideos <= 30 && avgDuration <= 8) {
    return PRICING_TIERS[1] // 创作者版
  } else if (monthlyVideos <= 80 && avgDuration <= 12) {
    return PRICING_TIERS[2] // 专业版
  } else {
    return PRICING_TIERS[3] // 企业版
  }
}

// 计算节省金额（对比按需付费）
export const calculateSavings = (tier: PricingTier, payAsYouGo: boolean = false): number => {
  if (tier.name === '体验版') return 0
  
  const payAsYouGoPrice = tier.monthlyVideos * calculatePerSecondPricing(tier.maxDuration, tier)
  return payAsYouGoPrice - tier.monthlyPrice
}

// 计算利润率分析
export const calculateProfitAnalysis = (tier: PricingTier) => {
  const monthlyCost = tier.monthlyVideos * tier.maxDuration * tier.costPerSecond
  const monthlyRevenue = tier.monthlyPrice
  const profit = monthlyRevenue - monthlyCost
  const profitMargin = (profit / monthlyRevenue) * 100
  
  return {
    monthlyCost,
    monthlyRevenue,
    profit,
    profitMargin,
    costPerVideo: tier.maxDuration * tier.costPerSecond,
    revenuePerVideo: tier.monthlyPrice / tier.monthlyVideos
  }
}

// 获客成本分析
export const calculateCustomerAcquisitionCost = (tier: PricingTier, marketingCost: number = 0) => {
  const analysis = calculateProfitAnalysis(tier)
  const paybackPeriod = marketingCost / analysis.profit
  
  return {
    paybackPeriod: Math.round(paybackPeriod * 10) / 10, // 保留一位小数
    lifetimeValue: analysis.profit * 12, // 假设12个月生命周期
    roi: ((analysis.profit * 12 - marketingCost) / marketingCost) * 100
  }
}

// 动态定价策略
export const getDynamicPricing = (userBehavior: {
  videosGenerated: number
  avgDuration: number
  retentionDays: number
  referralCount: number
}) => {
  const { videosGenerated, avgDuration, retentionDays, referralCount } = userBehavior
  
  // 基于用户行为的个性化定价
  let discount = 0
  
  // 高留存用户折扣
  if (retentionDays > 30) discount += 0.1
  
  // 推荐用户折扣
  if (referralCount > 3) discount += 0.05
  
  // 高频用户折扣
  if (videosGenerated > 50) discount += 0.05
  
  return {
    discount,
    recommendedTier: getRecommendedPlan(videosGenerated, avgDuration),
    personalizedPrice: (tier: PricingTier) => tier.monthlyPrice * (1 - discount)
  }
}
