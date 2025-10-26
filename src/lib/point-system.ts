// 积分制度系统 - 基于成本书籍的会员积分管理
import { PRICING_TIERS, PricingTier } from './pricing-calculator'

// 积分类型定义
export interface PointType {
  name: string
  value: number // 积分价值（美元）
  description: string
  earnConditions: string[]
  redeemOptions: string[]
}

// 积分交易记录
export interface PointTransaction {
  id: string
  userId: string
  type: 'earn' | 'redeem' | 'expire'
  amount: number
  reason: string
  timestamp: Date
  expiryDate?: Date
}

// 积分制度配置
export const POINT_SYSTEM_CONFIG = {
  // 积分获取规则
  earnRules: {
    // 邀请奖励
    inviteReward: {
      inviteUser: 20, // 邀请1个用户获得20积分
      inviteUserUpgrade: 50, // 邀请用户升级获得50积分
      inviteUserAnnual: 100 // 邀请用户年付获得100积分
    },
    
    // 使用奖励
    usageReward: {
      dailyLogin: 1, // 每日登录1积分
      videoGeneration: 2, // 生成视频2积分
      shareVideo: 5, // 分享视频5积分
      reviewVideo: 3, // 评价视频3积分
      completeProfile: 10 // 完善资料10积分
    },
    
    // 会员奖励
    membershipReward: {
      bronzeMonthly: 30, // 青铜会员每月30积分
      silverMonthly: 60, // 白银会员每月60积分
      diamondMonthly: 200, // 钻石会员每月200积分
      annualBonus: 0.2 // 年付额外20%积分
    },
    
    // 活动奖励
    activityReward: {
      firstVideo: 10, // 首次生成视频10积分
      milestone5: 25, // 生成5个视频25积分
      milestone10: 50, // 生成10个视频50积分
      milestone50: 200, // 生成50个视频200积分
      milestone100: 500 // 生成100个视频500积分
    }
  },
  
  // 积分兑换规则
  redeemRules: {
    // 视频生成
    videoGeneration: {
      '5s': 5, // 5秒视频5积分
      '10s': 10, // 10秒视频10积分
      '15s': 15 // 15秒视频15积分
    },
    
    // 功能升级
    featureUpgrade: {
      hdQuality: 20, // 高清质量20积分
      noWatermark: 30, // 无水印30积分
      priorityQueue: 50, // 优先队列50积分
      customBrand: 100 // 自定义品牌100积分
    },
    
    // 会员升级
    membershipUpgrade: {
      bronzeToSilver: 500, // 青铜升白银500积分
      silverToDiamond: 1000, // 白银升钻石1000积分
      freeMonth: 200 // 免费月会员200积分
    },
    
    // 实物奖励
    physicalRewards: {
      customMug: 300, // 定制杯子300积分
      brandedTshirt: 500, // 品牌T恤500积分
      premiumSticker: 100, // 高级贴纸100积分
      limitedEdition: 1000 // 限量版商品1000积分
    }
  },
  
  // 积分有效期
  expiryRules: {
    defaultExpiry: 365, // 默认365天过期
    activityExpiry: 180, // 活动积分180天过期
    bonusExpiry: 90 // 奖励积分90天过期
  }
}

// 积分计算器
export class PointCalculator {
  // 计算视频生成成本（积分）
  static calculateVideoCost(duration: number): number {
    return duration * 1 // 每秒1积分
  }
  
  // 计算会员月积分奖励
  static calculateMonthlyReward(tier: PricingTier): number {
    switch (tier.name) {
      case '青铜会员':
        return POINT_SYSTEM_CONFIG.earnRules.membershipReward.bronzeMonthly
      case '白银会员':
        return POINT_SYSTEM_CONFIG.earnRules.membershipReward.silverMonthly
      case '钻石会员':
        return POINT_SYSTEM_CONFIG.earnRules.membershipReward.diamondMonthly
      default:
        return 0
    }
  }
  
  // 计算邀请奖励
  static calculateInviteReward(inviteType: 'user' | 'upgrade' | 'annual'): number {
    switch (inviteType) {
      case 'user':
        return POINT_SYSTEM_CONFIG.earnRules.inviteReward.inviteUser
      case 'upgrade':
        return POINT_SYSTEM_CONFIG.earnRules.inviteReward.inviteUserUpgrade
      case 'annual':
        return POINT_SYSTEM_CONFIG.earnRules.inviteReward.inviteUserAnnual
    }
  }
  
  // 计算里程碑奖励
  static calculateMilestoneReward(videoCount: number): number {
    if (videoCount >= 100) return POINT_SYSTEM_CONFIG.earnRules.activityReward.milestone100
    if (videoCount >= 50) return POINT_SYSTEM_CONFIG.earnRules.activityReward.milestone50
    if (videoCount >= 10) return POINT_SYSTEM_CONFIG.earnRules.activityReward.milestone10
    if (videoCount >= 5) return POINT_SYSTEM_CONFIG.earnRules.activityReward.milestone5
    if (videoCount >= 1) return POINT_SYSTEM_CONFIG.earnRules.activityReward.firstVideo
    return 0
  }
}

// 积分管理系统
export class PointManager {
  private userPoints: Map<string, number> = new Map()
  private transactions: PointTransaction[] = []
  
  // 获取用户积分
  getUserPoints(userId: string): number {
    return this.userPoints.get(userId) || 0
  }
  
  // 添加积分
  addPoints(userId: string, amount: number, reason: string, expiryDays?: number): void {
    const currentPoints = this.getUserPoints(userId)
    this.userPoints.set(userId, currentPoints + amount)
    
    const transaction: PointTransaction = {
      id: this.generateTransactionId(),
      userId,
      type: 'earn',
      amount,
      reason,
      timestamp: new Date(),
      expiryDate: expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000) : undefined
    }
    
    this.transactions.push(transaction)
  }
  
  // 消费积分
  spendPoints(userId: string, amount: number, reason: string): boolean {
    const currentPoints = this.getUserPoints(userId)
    if (currentPoints < amount) {
      return false // 积分不足
    }
    
    this.userPoints.set(userId, currentPoints - amount)
    
    const transaction: PointTransaction = {
      id: this.generateTransactionId(),
      userId,
      type: 'redeem',
      amount: -amount,
      reason,
      timestamp: new Date()
    }
    
    this.transactions.push(transaction)
    return true
  }
  
  // 生成交易ID
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 获取用户交易记录
  getUserTransactions(userId: string): PointTransaction[] {
    return this.transactions.filter(tx => tx.userId === userId)
  }
  
  // 检查积分是否过期
  checkExpiredPoints(): void {
    const now = new Date()
    this.transactions.forEach(transaction => {
      if (transaction.expiryDate && transaction.expiryDate < now && transaction.type === 'earn') {
        // 处理过期积分
        const userId = transaction.userId
        const currentPoints = this.getUserPoints(userId)
        const expiredAmount = Math.min(transaction.amount, currentPoints)
        
        if (expiredAmount > 0) {
          this.userPoints.set(userId, currentPoints - expiredAmount)
          
          const expireTransaction: PointTransaction = {
            id: this.generateTransactionId(),
            userId,
            type: 'expire',
            amount: -expiredAmount,
            reason: '积分过期',
            timestamp: now
          }
          
          this.transactions.push(expireTransaction)
        }
      }
    })
  }
}

// 积分价值分析
export const analyzePointValue = () => {
  return {
    // 积分获取成本分析
    earningCostAnalysis: {
      inviteCost: {
        costPerInvite: 0.55, // 邀请1个用户成本$0.55（5秒视频）
        pointReward: 20,
        costPerPoint: 0.0275 // 每积分成本$0.0275
      },
      
      usageCost: {
        dailyLoginCost: 0, // 登录无成本
        pointReward: 1,
        costPerPoint: 0
      },
      
      membershipCost: {
        bronzeCost: 1.65, // 青铜会员成本
        pointReward: 30,
        costPerPoint: 0.055
      }
    },
    
    // 积分兑换价值分析
    redemptionValueAnalysis: {
      videoGeneration: {
        '5s': {
          pointCost: 5,
          actualCost: 0.055, // $0.055
          pointValue: 0.011 // 每积分价值$0.011
        },
        '10s': {
          pointCost: 10,
          actualCost: 0.11, // $0.11
          pointValue: 0.011
        },
        '15s': {
          pointCost: 15,
          actualCost: 0.165, // $0.165
          pointValue: 0.011
        }
      },
      
      featureUpgrade: {
        hdQuality: {
          pointCost: 20,
          actualCost: 0.05, // 假设高清成本增加$0.05
          pointValue: 0.0025
        },
        noWatermark: {
          pointCost: 30,
          actualCost: 0.02, // 假设无水印成本增加$0.02
          pointValue: 0.00067
        }
      }
    },
    
    // 积分制度收益分析
    revenueAnalysis: {
      // 基于《Cost Accounting: A Managerial Emphasis》的成本分摊
      costAllocation: {
        directCost: 0.011, // 直接成本$0.011/秒
        indirectCost: 0.005, // 间接成本$0.005/秒
        totalCost: 0.016 // 总成本$0.016/秒
      },
      
      // 积分制度带来的额外收入
      additionalRevenue: {
        increasedRetention: 0.15, // 15%留存率提升
        increasedUsage: 0.25, // 25%使用量提升
        referralGrowth: 0.30 // 30%推荐增长
      },
      
      // 盈亏平衡分析
      breakEvenAnalysis: {
        minUsers: 1000, // 最少1000用户
        avgPointsPerUser: 50, // 平均每用户50积分
        pointRedemptionRate: 0.7, // 70%积分兑换率
        breakEvenPoint: 50000 // 盈亏平衡点50000积分
      }
    }
  }
}
