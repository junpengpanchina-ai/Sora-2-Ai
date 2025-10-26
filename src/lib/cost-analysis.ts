// 成本分析计算器 - 基于您的实际成本
export const calculateActualCosts = () => {
  // 基础数据
  const costPerSecond = 0.08 // 8分钱/秒
  const exchangeRate = 7.24 // 1 USD = 7.24 CNY
  const costPerSecondUSD = costPerSecond / exchangeRate // $0.011/秒
  
  // 视频时长配置
  const videoDurations = {
    short: 5, // 5秒
    medium: 10, // 10秒
    long: 15 // 15秒
  }
  
  // 会员方案配置
  const membershipPlans = {
    bronze: {
      videos: 30,
      duration: 5,
      monthlyCost: 30 * 5 * costPerSecond, // 30个5秒视频
      monthlyCostUSD: (30 * 5 * costPerSecond) / exchangeRate
    },
    silver: {
      videos: 60,
      duration: 10,
      monthlyCost: 60 * 10 * costPerSecond, // 60个10秒视频
      monthlyCostUSD: (60 * 10 * costPerSecond) / exchangeRate
    },
    diamond: {
      videos: 200,
      duration: 15,
      monthlyCost: 200 * 15 * costPerSecond, // 200个15秒视频
      monthlyCostUSD: (200 * 15 * costPerSecond) / exchangeRate
    }
  }
  
  // 成本分析结果
  const costAnalysis = {
    // 基础成本
    baseCosts: {
      costPerSecondCNY: costPerSecond,
      costPerSecondUSD: costPerSecondUSD,
      exchangeRate: exchangeRate
    },
    
    // 单视频成本
    videoCosts: {
      '5s': {
        cny: 5 * costPerSecond, // 0.4元
        usd: (5 * costPerSecond) / exchangeRate // $0.055
      },
      '10s': {
        cny: 10 * costPerSecond, // 0.8元
        usd: (10 * costPerSecond) / exchangeRate // $0.11
      },
      '15s': {
        cny: 15 * costPerSecond, // 1.2元
        usd: (15 * costPerSecond) / exchangeRate // $0.165
      }
    },
    
    // 会员月成本
    membershipCosts: {
      bronze: {
        monthlyCostCNY: membershipPlans.bronze.monthlyCost, // 12元
        monthlyCostUSD: membershipPlans.bronze.monthlyCostUSD, // $1.66
        costPerVideoCNY: membershipPlans.bronze.monthlyCost / membershipPlans.bronze.videos, // 0.4元/视频
        costPerVideoUSD: membershipPlans.bronze.monthlyCostUSD / membershipPlans.bronze.videos // $0.055/视频
      },
      silver: {
        monthlyCostCNY: membershipPlans.silver.monthlyCost, // 48元
        monthlyCostUSD: membershipPlans.silver.monthlyCostUSD, // $6.63
        costPerVideoCNY: membershipPlans.silver.monthlyCost / membershipPlans.silver.videos, // 0.8元/视频
        costPerVideoUSD: membershipPlans.silver.monthlyCostUSD / membershipPlans.silver.videos // $0.11/视频
      },
      diamond: {
        monthlyCostCNY: membershipPlans.diamond.monthlyCost, // 240元
        monthlyCostUSD: membershipPlans.diamond.monthlyCostUSD, // $33.15
        costPerVideoCNY: membershipPlans.diamond.monthlyCost / membershipPlans.diamond.videos, // 1.2元/视频
        costPerVideoUSD: membershipPlans.diamond.monthlyCostUSD / membershipPlans.diamond.videos // $0.165/视频
      }
    },
    
    // 盈亏分析
    breakEvenAnalysis: {
      // 如果按您说的汇率1:7.24计算
      diamondPlanAnalysis: {
        monthlyRevenue: 33.00, // $33.00/月
        monthlyCost: 33.15, // $33.15/月
        monthlyLoss: 0.15, // 每月亏损$0.15
        annualLoss: 1.80, // 每年亏损$1.80
        lossPerUser: 0.15 // 每用户亏损$0.15
      },
      
      // 需要多少用户才能盈利
      profitabilityAnalysis: {
        // 假设其他成本（服务器、客服等）为收入的20%
        otherCostsRatio: 0.20,
        otherCostsPerUser: 33.00 * 0.20, // $6.60/用户/月
        totalCostPerUser: 33.15 + 6.60, // $39.75/用户/月
        breakEvenPrice: 39.75, // 盈亏平衡价格$39.75/月
        currentPrice: 33.00, // 当前价格$33.00/月
        priceGap: 6.75, // 需要涨价$6.75
        priceIncreaseRatio: 0.205 // 需要涨价20.5%
      }
    },
    
    // 积分制度成本分析
    pointSystemCosts: {
      // 积分获取成本
      earningCosts: {
        inviteReward: {
          pointCost: 20, // 20积分
          videoCost: 0.055, // 相当于1个5秒视频$0.055
          costPerPoint: 0.00275 // 每积分成本$0.00275
        },
        dailyLogin: {
          pointCost: 1, // 1积分
          actualCost: 0, // 无实际成本
          costPerPoint: 0
        },
        membershipReward: {
          bronze: {
            pointCost: 30, // 30积分/月
            actualCost: 0, // 无额外成本
            costPerPoint: 0
          },
          silver: {
            pointCost: 60, // 60积分/月
            actualCost: 0, // 无额外成本
            costPerPoint: 0
          },
          diamond: {
            pointCost: 200, // 200积分/月
            actualCost: 0, // 无额外成本
            costPerPoint: 0
          }
        }
      },
      
      // 积分兑换成本
      redemptionCosts: {
        videoGeneration: {
          '5s': {
            pointCost: 5,
            actualCost: 0.055,
            costPerPoint: 0.011
          },
          '10s': {
            pointCost: 10,
            actualCost: 0.11,
            costPerPoint: 0.011
          },
          '15s': {
            pointCost: 15,
            actualCost: 0.165,
            costPerPoint: 0.011
          }
        }
      }
    }
  }
  
  return costAnalysis
}

// 获取成本分析报告
export const getCostAnalysisReport = () => {
  const analysis = calculateActualCosts()
  
  return {
    // 关键发现
    keyFindings: {
      diamondPlanLoss: {
        monthly: analysis.breakEvenAnalysis.diamondPlanAnalysis.monthlyLoss,
        annual: analysis.breakEvenAnalysis.diamondPlanAnalysis.annualLoss,
        message: '钻石会员每月亏损$0.15，需要调整定价'
      },
      
      priceAdjustment: {
        currentPrice: analysis.breakEvenAnalysis.profitabilityAnalysis.currentPrice,
        breakEvenPrice: analysis.breakEvenAnalysis.profitabilityAnalysis.breakEvenPrice,
        increaseNeeded: analysis.breakEvenAnalysis.profitabilityAnalysis.priceIncreaseRatio,
        message: '需要涨价20.5%才能达到盈亏平衡'
      },
      
      pointSystemValue: {
        pointValue: 0.011, // 每积分价值$0.011
        message: '积分制度可以有效提高用户粘性和使用频率'
      }
    },
    
    // 建议
    recommendations: {
      pricing: {
        bronze: {
          current: 1.65,
          recommended: 2.00, // 涨价21%
          reason: '确保基本盈利'
        },
        silver: {
          current: 6.60,
          recommended: 8.00, // 涨价21%
          reason: '覆盖成本并保持竞争力'
        },
        diamond: {
          current: 33.00,
          recommended: 40.00, // 涨价21%
          reason: '达到盈亏平衡'
        }
      },
      
      pointSystem: {
        optimization: {
          inviteReward: '保持20积分奖励，成本可控',
          membershipReward: '增加会员积分奖励，提高留存',
          redemptionRate: '控制积分兑换率在70%以下'
        }
      }
    }
  }
}
