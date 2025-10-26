// 定价分析工具 - 基于成本的价格模型分析
import { PRICING_TIERS, PricingTier, calculateProfitAnalysis, calculateCustomerAcquisitionCost } from './pricing-calculator'

// 成本结构分析
export interface CostStructure {
  baseCost: number // 基础成本（8分钱/秒）
  platformCost: number // 平台成本（服务器、带宽等）
  supportCost: number // 客服成本
  marketingCost: number // 营销成本
  totalCost: number // 总成本
}

// 收入结构分析
export interface RevenueStructure {
  subscriptionRevenue: number // 订阅收入
  overageRevenue: number // 超量收入
  referralRevenue: number // 推荐收入
  totalRevenue: number // 总收入
}

// 完整的定价分析报告
export interface PricingAnalysisReport {
  tier: PricingTier
  costStructure: CostStructure
  revenueStructure: RevenueStructure
  profitAnalysis: ReturnType<typeof calculateProfitAnalysis>
  customerAcquisition: ReturnType<typeof calculateCustomerAcquisitionCost>
  marketPosition: {
    competitorPrice: number
    ourPrice: number
    priceAdvantage: number
  }
  growthProjection: {
    monthlyGrowth: number
    churnRate: number
    ltv: number // 生命周期价值
  }
}

// 计算成本结构 (USD)
export const calculateCostStructure = (tier: PricingTier): CostStructure => {
  const baseCost = tier.monthlyVideos * tier.maxDuration * tier.costPerSecond
  
  // 平台成本（服务器、带宽等）- 假设为收入的15%
  const platformCost = tier.monthlyPrice * 0.15
  
  // 客服成本 - 根据用户类型
  const supportCost = tier.targetAudience === '企业客户' ? tier.monthlyPrice * 0.1 : tier.monthlyPrice * 0.05
  
  // 营销成本 - 获客成本 (USD) - 基于高毛利率调整
  const marketingCost = tier.targetAudience === '邀请制获客' ? 1.10 : tier.targetAudience === '企业客户' ? 11.00 : 2.20
  
  return {
    baseCost,
    platformCost,
    supportCost,
    marketingCost,
    totalCost: baseCost + platformCost + supportCost + marketingCost
  }
}

// 计算收入结构
export const calculateRevenueStructure = (tier: PricingTier): RevenueStructure => {
  const subscriptionRevenue = tier.monthlyPrice
  
  // 超量收入（假设20%用户会超量使用）
  const overageRevenue = tier.monthlyPrice * 0.2
  
  // 推荐收入（假设每个用户推荐1.5个新用户）
  const referralRevenue = tier.monthlyPrice * 0.15
  
  return {
    subscriptionRevenue,
    overageRevenue,
    referralRevenue,
    totalRevenue: subscriptionRevenue + overageRevenue + referralRevenue
  }
}

// 生成完整的定价分析报告
export const generatePricingAnalysisReport = (tier: PricingTier): PricingAnalysisReport => {
  const costStructure = calculateCostStructure(tier)
  const revenueStructure = calculateRevenueStructure(tier)
  const profitAnalysis = calculateProfitAnalysis(tier)
  const customerAcquisition = calculateCustomerAcquisitionCost(tier, costStructure.marketingCost)
  
  // 市场定位分析 (USD) - 基于高毛利率调整
  const competitorPrice = tier.name === '体验版' ? 0 : tier.name === '创作者版' ? 4.10 : tier.name === '专业版' ? 12.30 : 41.25
  const priceAdvantage = competitorPrice > 0 ? ((competitorPrice - tier.monthlyPrice) / competitorPrice) * 100 : 0
  
  // 增长预测
  const monthlyGrowth = tier.name === '体验版' ? 0.3 : tier.name === '创作者版' ? 0.15 : tier.name === '专业版' ? 0.1 : 0.05
  const churnRate = tier.name === '体验版' ? 0.4 : tier.name === '创作者版' ? 0.2 : tier.name === '专业版' ? 0.1 : 0.05
  const ltv = (revenueStructure.totalRevenue * 12) / (1 + churnRate)
  
  return {
    tier,
    costStructure,
    revenueStructure,
    profitAnalysis,
    customerAcquisition,
    marketPosition: {
      competitorPrice,
      ourPrice: tier.monthlyPrice,
      priceAdvantage
    },
    growthProjection: {
      monthlyGrowth,
      churnRate,
      ltv
    }
  }
}

// 获取所有定价分析报告
export const getAllPricingAnalysisReports = (): PricingAnalysisReport[] => {
  return PRICING_TIERS.map(tier => generatePricingAnalysisReport(tier))
}

// 定价策略建议
export const getPricingStrategyRecommendations = () => {
  const reports = getAllPricingAnalysisReports()
  
  return {
    // 获客策略
    acquisitionStrategy: {
      freeTier: {
        costPerAcquisition: reports[0].costStructure.marketingCost,
        conversionRate: 0.15, // 15%转化率
        recommendedBudget: reports[0].costStructure.marketingCost * 1000 // 1000个用户预算 (USD)
      }
    },
    
    // 留存策略
    retentionStrategy: {
      churnReduction: {
        currentChurn: reports[1].growthProjection.churnRate,
        targetChurn: reports[1].growthProjection.churnRate * 0.7, // 降低30%
        strategies: ['个性化推荐', '使用提醒', '社区建设']
      }
    },
    
    // 升级策略
    upgradeStrategy: {
      upgradePath: [
        { from: '体验版', to: '创作者版', conversionRate: 0.25 },
        { from: '创作者版', to: '专业版', conversionRate: 0.15 },
        { from: '专业版', to: '企业版', conversionRate: 0.1 }
      ]
    },
    
    // 定价优化建议
    pricingOptimization: {
      priceElasticity: {
        creator: 1.2, // 价格弹性
        pro: 0.8,
        enterprise: 0.5
      },
      recommendedAdjustments: {
        creator: '保持当前价格，增加功能价值',
        pro: '可考虑小幅提价5-10%',
        enterprise: '可考虑提价15-20%'
      }
    }
  }
}

// 税务优化建议
export const getTaxOptimizationRecommendations = () => {
  return {
    // 基于税务书籍的建议
    internationalTaxPlanning: {
      // 根据《International Tax Planning》的建议
      transferPricing: {
        recommendation: '建立合理的转移定价策略，将AI服务成本合理分配到不同地区',
        implementation: '在不同地区设立子公司，合理分配研发和运营成本'
      },
      
      // 根据《Tax Treaties and International Tax Law》的建议
      taxTreaties: {
        recommendation: '充分利用中美税收协定，优化税率结构',
        implementation: '在美国设立研发中心，享受研发费用加计扣除'
      }
    },
    
    // 电商税务优化
    ecommerceTaxOptimization: {
      // 根据《E-commerce Taxation》的建议
      digitalServicesTax: {
        recommendation: '合理规划数字服务税，避免重复征税',
        implementation: '在不同地区采用不同的税务结构'
      },
      
      // 根据《Digital Economy Taxation》的建议
      digitalEconomyTax: {
        recommendation: '建立数字化税务管理体系',
        implementation: '使用自动化税务计算和申报系统'
      }
    },
    
    // 成本管理优化
    costManagementOptimization: {
      // 根据《Cost Accounting: A Managerial Emphasis》的建议
      activityBasedCosting: {
        recommendation: '采用作业成本法，精确计算每个服务的成本',
        implementation: '将AI生成成本、服务器成本、客服成本分别核算'
      },
      
      // 根据《Tax Cost Management》的建议
      taxCostManagement: {
        recommendation: '建立税务成本管理体系，降低整体税务成本',
        implementation: '通过合理的税务规划，降低有效税率'
      }
    }
  }
}
