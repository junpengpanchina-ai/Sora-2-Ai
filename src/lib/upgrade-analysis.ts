// 会员升级路径分析 - 优化用户体验
import { PRICING_TIERS, PricingTier } from './pricing-calculator'

// 升级路径分析
export interface UpgradePath {
  from: PricingTier
  to: PricingTier
  priceIncrease: number
  priceIncreaseRatio: number
  valueIncrease: number
  valueIncreaseRatio: number
  upgradeDifficulty: 'easy' | 'medium' | 'hard'
  upgradeIncentive: string[]
}

// 升级路径配置
export const UPGRADE_PATHS: UpgradePath[] = [
  {
    from: PRICING_TIERS[0], // 体验版
    to: PRICING_TIERS[1], // 青铜会员
    priceIncrease: 2.00,
    priceIncreaseRatio: Infinity, // 从免费到付费
    valueIncrease: 20, // 从10个视频到30个视频
    valueIncreaseRatio: 2.0,
    upgradeDifficulty: 'easy',
    upgradeIncentive: [
      '首次升级优惠50%',
      '赠送50积分',
      '7天免费试用'
    ]
  },
  {
    from: PRICING_TIERS[1], // 青铜会员
    to: PRICING_TIERS[2], // 白银会员
    priceIncrease: 6.00,
    priceIncreaseRatio: 3.0, // 从$2到$8，3倍
    valueIncrease: 30, // 从30个5秒视频到60个10秒视频
    valueIncreaseRatio: 2.0,
    upgradeDifficulty: 'medium',
    upgradeIncentive: [
      '升级优惠30%',
      '赠送100积分',
      '免费升级1个月'
    ]
  },
  {
    from: PRICING_TIERS[2], // 白银会员
    to: PRICING_TIERS[3], // 黄金会员
    priceIncrease: 12.00,
    priceIncreaseRatio: 1.5, // 从$8到$20，1.5倍
    valueIncrease: 60, // 从60个10秒视频到120个15秒视频
    valueIncreaseRatio: 2.0,
    upgradeDifficulty: 'medium',
    upgradeIncentive: [
      '升级优惠20%',
      '赠送200积分',
      '专属客服支持'
    ]
  },
  {
    from: PRICING_TIERS[3], // 黄金会员
    to: PRICING_TIERS[4], // 钻石会员
    priceIncrease: 20.00,
    priceIncreaseRatio: 2.0, // 从$20到$40，2倍
    valueIncrease: 80, // 从120个15秒视频到200个15秒视频
    valueIncreaseRatio: 1.67,
    upgradeDifficulty: 'hard',
    upgradeIncentive: [
      '企业级功能',
      '专属客户经理',
      '定制开发服务'
    ]
  }
]

// 升级路径分析器
export class UpgradePathAnalyzer {
  // 分析升级难度
  static analyzeUpgradeDifficulty(upgradePath: UpgradePath): 'easy' | 'medium' | 'hard' {
    const { priceIncreaseRatio, valueIncreaseRatio } = upgradePath
    
    // 价格增长倍数
    if (priceIncreaseRatio <= 1.5) return 'easy'
    if (priceIncreaseRatio <= 2.5) return 'medium'
    return 'hard'
  }
  
  // 计算升级价值
  static calculateUpgradeValue(upgradePath: UpgradePath): number {
    const { from, to } = upgradePath
    
    // 视频数量价值
    const videoValueIncrease = (to.monthlyVideos - from.monthlyVideos) * to.pricePerVideo
    
    // 时长价值
    const durationValueIncrease = to.monthlyVideos * (to.maxDuration - from.maxDuration) * to.costPerSecond
    
    // 功能价值（估算）
    const featureValueIncrease = this.estimateFeatureValue(to.features.length - from.features.length)
    
    return videoValueIncrease + durationValueIncrease + featureValueIncrease
  }
  
  // 估算功能价值
  private static estimateFeatureValue(featureCount: number): number {
    return featureCount * 0.5 // 每个功能价值$0.5
  }
  
  // 生成升级建议
  static generateUpgradeSuggestions(): {
    easyUpgrades: UpgradePath[]
    mediumUpgrades: UpgradePath[]
    hardUpgrades: UpgradePath[]
    recommendations: string[]
  } {
    const easyUpgrades = UPGRADE_PATHS.filter(path => path.upgradeDifficulty === 'easy')
    const mediumUpgrades = UPGRADE_PATHS.filter(path => path.upgradeDifficulty === 'medium')
    const hardUpgrades = UPGRADE_PATHS.filter(path => path.upgradeDifficulty === 'hard')
    
    const recommendations = [
      '提供渐进式升级路径，降低用户心理阻力',
      '使用积分奖励系统激励升级',
      '提供限时优惠降低升级门槛',
      '通过功能差异化增加升级价值',
      '建立用户等级体系，增加升级成就感'
    ]
    
    return {
      easyUpgrades,
      mediumUpgrades,
      hardUpgrades,
      recommendations
    }
  }
}

// 会员体系优化建议
export const getMembershipOptimizationSuggestions = () => {
  return {
    // 价格梯度优化
    priceGradientOptimization: {
      currentPrices: [0, 2.00, 8.00, 20.00, 40.00],
      priceRatios: [0, 1, 4, 10, 20],
      optimization: {
        suggestion: '保持合理的价格梯度，避免跳跃过大',
        targetRatios: [0, 1, 2.5, 5, 10],
        benefits: [
          '降低用户升级心理阻力',
          '提高升级转化率',
          '增加用户生命周期价值'
        ]
      }
    },
    
    // 功能差异化
    featureDifferentiation: {
      bronze: {
        coreFeatures: ['基础视频生成', '社区支持'],
        uniqueFeatures: ['积分奖励系统'],
        upgradeTriggers: ['视频数量不足', '需要更高画质']
      },
      silver: {
        coreFeatures: ['1080p画质', 'API访问', '团队协作'],
        uniqueFeatures: ['自定义品牌', '高级分析'],
        upgradeTriggers: ['需要4K画质', '需要更多视频']
      },
      gold: {
        coreFeatures: ['4K画质', '优先处理', '专属客服'],
        uniqueFeatures: ['高级分析', '优先处理'],
        upgradeTriggers: ['需要企业功能', '需要定制开发']
      },
      diamond: {
        coreFeatures: ['企业API', '多团队管理', 'SLA保障'],
        uniqueFeatures: ['白标解决方案', '定制开发'],
        upgradeTriggers: ['需要企业级支持', '需要定制功能']
      }
    },
    
    // 升级激励策略
    upgradeIncentiveStrategies: {
      // 基于《The Lean Startup》的A/B测试建议
      abTesting: {
        priceTesting: '测试不同价格点的升级转化率',
        featureTesting: '测试不同功能组合的吸引力',
        incentiveTesting: '测试不同奖励方式的效果'
      },
      
      // 基于《Platform Revolution》的网络效应
      networkEffects: {
        referralRewards: '邀请好友升级获得额外奖励',
        communityBenefits: '高级会员专属社区功能',
        socialProof: '展示其他用户的升级成功案例'
      },
      
      // 基于《Cost Accounting: A Managerial Emphasis》的成本效益
      costBenefitAnalysis: {
        upgradeCost: '计算升级营销成本',
        upgradeValue: '计算升级带来的生命周期价值',
        roiOptimization: '优化升级投资回报率'
      }
    },
    
    // 实施建议
    implementationRecommendations: {
      phase1: {
        duration: '1-2个月',
        actions: [
          '推出黄金会员作为过渡方案',
          '实施积分奖励系统',
          '优化升级页面设计'
        ]
      },
      phase2: {
        duration: '2-3个月',
        actions: [
          'A/B测试不同价格点',
          '优化功能差异化',
          '实施升级激励策略'
        ]
      },
      phase3: {
        duration: '3-6个月',
        actions: [
          '分析升级数据',
          '优化升级路径',
          '推出个性化升级建议'
        ]
      }
    }
  }
}

// 升级转化率预测
export const predictUpgradeConversionRates = () => {
  return {
    // 基于行业数据的转化率预测
    industryBenchmarks: {
      freeToPaid: 0.05, // 5%免费用户转化为付费用户
      bronzeToSilver: 0.15, // 15%青铜用户升级到白银
      silverToGold: 0.10, // 10%白银用户升级到黄金
      goldToDiamond: 0.05 // 5%黄金用户升级到钻石
    },
    
    // 优化后的转化率目标
    optimizedTargets: {
      freeToPaid: 0.08, // 目标8%（通过积分系统）
      bronzeToSilver: 0.25, // 目标25%（通过功能差异化）
      silverToGold: 0.20, // 目标20%（通过黄金会员过渡）
      goldToDiamond: 0.15 // 目标15%（通过企业功能）
    },
    
    // 转化率提升策略
    conversionOptimization: {
      freeToPaid: [
        '降低首次付费门槛',
        '提供试用期',
        '积分奖励激励'
      ],
      bronzeToSilver: [
        '功能限制触发升级',
        '画质升级需求',
        'API访问需求'
      ],
      silverToGold: [
        '4K画质需求',
        '优先处理需求',
        '专业功能需求'
      ],
      goldToDiamond: [
        '企业级功能需求',
        '定制开发需求',
        '专属服务需求'
      ]
    }
  }
}
