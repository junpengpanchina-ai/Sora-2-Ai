// 风险对抗分析工具 - 基于60%以上毛利率的风险管理
import { PRICING_TIERS, PricingTier, calculateProfitAnalysis } from './pricing-calculator'

// 风险类型定义
export interface RiskType {
  name: string
  probability: number // 0-1
  impact: number // 0-1
  mitigation: string
  costImpact: number // 对成本的影响倍数
}

// 风险分析报告
export interface RiskAnalysisReport {
  tier: PricingTier
  currentMargin: number
  riskScenarios: {
    lowRisk: number // 低风险情况下的毛利率
    mediumRisk: number // 中等风险情况下的毛利率
    highRisk: number // 高风险情况下的毛利率
  }
  riskMitigation: {
    costReduction: string[]
    revenueProtection: string[]
    marketDiversification: string[]
  }
  breakEvenAnalysis: {
    minUsers: number
    maxCostIncrease: number
    priceAdjustmentRange: number[]
  }
}

// 定义主要风险类型
export const RISK_TYPES: RiskType[] = [
  {
    name: 'AI成本上涨',
    probability: 0.3,
    impact: 0.4,
    mitigation: '多供应商策略，成本分摊',
    costImpact: 1.5 // 成本上涨50%
  },
  {
    name: '竞争加剧',
    probability: 0.4,
    impact: 0.3,
    mitigation: '差异化功能，品牌建设',
    costImpact: 1.2 // 成本上涨20%
  },
  {
    name: '监管变化',
    probability: 0.2,
    impact: 0.5,
    mitigation: '合规投资，法律咨询',
    costImpact: 1.3 // 成本上涨30%
  },
  {
    name: '技术故障',
    probability: 0.1,
    impact: 0.6,
    mitigation: '冗余系统，SLA保障',
    costImpact: 2.0 // 成本上涨100%
  },
  {
    name: '汇率波动',
    probability: 0.3,
    impact: 0.2,
    mitigation: '多币种定价，对冲策略',
    costImpact: 1.1 // 成本上涨10%
  }
]

// 计算风险调整后的毛利率
export const calculateRiskAdjustedMargin = (tier: PricingTier, riskLevel: 'low' | 'medium' | 'high'): number => {
  const baseAnalysis = calculateProfitAnalysis(tier)
  const baseMargin = baseAnalysis.profitMargin
  
  // 根据风险等级调整成本
  let costMultiplier = 1
  switch (riskLevel) {
    case 'low':
      costMultiplier = 1.1 // 成本上涨10%
      break
    case 'medium':
      costMultiplier = 1.3 // 成本上涨30%
      break
    case 'high':
      costMultiplier = 1.6 // 成本上涨60%
      break
  }
  
  // 重新计算毛利率
  const adjustedCost = baseAnalysis.monthlyCost * costMultiplier
  const adjustedMargin = ((baseAnalysis.monthlyRevenue - adjustedCost) / baseAnalysis.monthlyRevenue) * 100
  
  return Math.max(0, adjustedMargin) // 确保不为负数
}

// 生成风险分析报告
export const generateRiskAnalysisReport = (tier: PricingTier): RiskAnalysisReport => {
  const baseAnalysis = calculateProfitAnalysis(tier)
  const currentMargin = baseAnalysis.profitMargin
  
  const riskScenarios = {
    lowRisk: calculateRiskAdjustedMargin(tier, 'low'),
    mediumRisk: calculateRiskAdjustedMargin(tier, 'medium'),
    highRisk: calculateRiskAdjustedMargin(tier, 'high')
  }
  
  // 风险缓解策略
  const riskMitigation = {
    costReduction: [
      '优化AI模型效率，降低计算成本',
      '批量采购，获得供应商折扣',
      '自动化运维，减少人工成本',
      'CDN优化，降低带宽成本'
    ],
    revenueProtection: [
      '长期合同锁定，减少价格波动',
      '增值服务，提高ARPU',
      '企业级SLA，保障收入稳定',
      '多产品线，分散收入风险'
    ],
    marketDiversification: [
      '多地区部署，降低地域风险',
      'B2B和B2C双轨并行',
      'API服务，扩大收入来源',
      '合作伙伴生态，共享风险'
    ]
  }
  
  // 盈亏平衡分析
  const breakEvenAnalysis = {
    minUsers: Math.ceil(baseAnalysis.monthlyCost / baseAnalysis.revenuePerVideo),
    maxCostIncrease: ((baseAnalysis.monthlyRevenue * 0.4) / baseAnalysis.monthlyCost) * 100, // 最多承受40%成本上涨
    priceAdjustmentRange: [
      baseAnalysis.revenuePerVideo * 0.8, // 最低可降价20%
      baseAnalysis.revenuePerVideo * 1.2  // 最高可涨价20%
    ]
  }
  
  return {
    tier,
    currentMargin,
    riskScenarios,
    riskMitigation,
    breakEvenAnalysis
  }
}

// 获取所有风险分析报告
export const getAllRiskAnalysisReports = (): RiskAnalysisReport[] => {
  return PRICING_TIERS.map(tier => generateRiskAnalysisReport(tier))
}

// 风险对抗策略建议
export const getRiskMitigationStrategies = () => {
  const reports = getAllRiskAnalysisReports()
  
  return {
    // 成本控制策略
    costControlStrategies: {
      aiCostOptimization: {
        strategy: '多供应商策略',
        implementation: '与3-5个AI供应商建立合作关系，分散风险',
        expectedSavings: '15-25%'
      },
      infrastructureOptimization: {
        strategy: '云原生架构',
        implementation: '使用Kubernetes自动扩缩容，优化资源使用',
        expectedSavings: '20-30%'
      },
      operationalEfficiency: {
        strategy: '自动化运维',
        implementation: 'DevOps自动化，减少人工干预',
        expectedSavings: '10-15%'
      }
    },
    
    // 收入保护策略
    revenueProtectionStrategies: {
      contractStabilization: {
        strategy: '长期合同',
        implementation: '提供年付折扣，锁定客户12-24个月',
        expectedBenefit: '减少流失率30%'
      },
      valueAddedServices: {
        strategy: '增值服务',
        implementation: '提供定制化、API访问、白标等增值服务',
        expectedBenefit: '提高ARPU 40%'
      },
      enterpriseFocus: {
        strategy: '企业客户重点',
        implementation: '重点发展企业客户，提高客单价',
        expectedBenefit: '提高LTV 200%'
      }
    },
    
    // 市场多元化策略
    marketDiversificationStrategies: {
      geographicExpansion: {
        strategy: '多地区部署',
        implementation: '在北美、欧洲、亚洲建立数据中心',
        expectedBenefit: '降低地域风险50%'
      },
      productDiversification: {
        strategy: '产品线扩展',
        implementation: '开发图片生成、音频生成等产品',
        expectedBenefit: '分散技术风险60%'
      },
      businessModelDiversification: {
        strategy: '商业模式多元化',
        implementation: 'SaaS订阅 + API服务 + 企业定制',
        expectedBenefit: '提高收入稳定性70%'
      }
    },
    
    // 应急响应策略
    emergencyResponseStrategies: {
      costSpikeResponse: {
        strategy: '成本上涨应急',
        implementation: '建立成本监控系统，超过阈值自动调整定价',
        responseTime: '24小时内'
      },
      competitiveResponse: {
        strategy: '竞争加剧应对',
        implementation: '快速迭代功能，建立技术壁垒',
        responseTime: '1-2周内'
      },
      regulatoryResponse: {
        strategy: '监管变化应对',
        implementation: '建立合规团队，提前布局合规措施',
        responseTime: '1个月内'
      }
    }
  }
}

// 风险监控指标
export const getRiskMonitoringMetrics = () => {
  return {
    // 成本监控指标
    costMetrics: {
      aiCostPerSecond: {
        target: '$0.011',
        warning: '$0.015',
        critical: '$0.020',
        action: '超过警告线时启动多供应商策略'
      },
      infrastructureCostRatio: {
        target: '<15%',
        warning: '15-20%',
        critical: '>20%',
        action: '超过警告线时优化云资源使用'
      },
      supportCostRatio: {
        target: '<5%',
        warning: '5-8%',
        critical: '>8%',
        action: '超过警告线时增加自动化支持'
      }
    },
    
    // 收入监控指标
    revenueMetrics: {
      monthlyRecurringRevenue: {
        target: '>10% 月增长',
        warning: '5-10% 月增长',
        critical: '<5% 月增长',
        action: '低于警告线时启动增长策略'
      },
      customerLifetimeValue: {
        target: '>12个月',
        warning: '8-12个月',
        critical: '<8个月',
        action: '低于警告线时优化留存策略'
      },
      churnRate: {
        target: '<5%',
        warning: '5-10%',
        critical: '>10%',
        action: '超过警告线时启动挽留计划'
      }
    },
    
    // 市场监控指标
    marketMetrics: {
      marketShare: {
        target: '>5%',
        warning: '3-5%',
        critical: '<3%',
        action: '低于警告线时加强市场推广'
      },
      competitorPricing: {
        target: '保持20%价格优势',
        warning: '10-20%价格优势',
        critical: '<10%价格优势',
        action: '低于警告线时调整定价策略'
      },
      customerSatisfaction: {
        target: '>4.5分',
        warning: '4.0-4.5分',
        critical: '<4.0分',
        action: '低于警告线时改进产品体验'
      }
    }
  }
}
