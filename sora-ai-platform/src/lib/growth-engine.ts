/**
 * 增长引擎 - 基于经典增长理论的综合增长系统
 * 融合《增长黑客》《疯传》《超级用户》等理论
 */

export interface UserTier {
  id: string
  name: string
  minVideos: number
  benefits: string[]
  color: string
  icon: string
}

export interface GrowthMetrics {
  acquisition: {
    totalUsers: number
    newUsersToday: number
    referralRate: number
    organicRate: number
  }
  activation: {
    firstVideoRate: number
    timeToFirstVideo: number
    templateUsageRate: number
  }
  retention: {
    day1Retention: number
    day7Retention: number
    day30Retention: number
    monthlyActiveUsers: number
  }
  referral: {
    totalReferrals: number
    viralCoefficient: number
    shareRate: number
  }
  revenue: {
    monthlyRecurringRevenue: number
    averageRevenuePerUser: number
    conversionRate: number
  }
}

export interface ViralTrigger {
  id: string
  type: 'social' | 'achievement' | 'scarcity' | 'fear' | 'surprise'
  title: string
  description: string
  action: string
  reward: string
  cooldown: number // 小时
}

export interface UserEngagement {
  userId: string
  tier: UserTier
  totalVideos: number
  monthlyVideos: number
  referralCount: number
  socialShares: number
  lastActiveAt: Date
  streakDays: number
  achievements: string[]
}

// 用户等级体系
export const USER_TIERS: UserTier[] = [
  {
    id: 'bronze',
    name: '铜牌创作者',
    minVideos: 20,
    benefits: ['基础版免费升级', '专属创作工具', '优先客服支持'],
    color: '#CD7F32',
    icon: '🥉'
  },
  {
    id: 'silver',
    name: '银牌创作者',
    minVideos: 50,
    benefits: ['专业版免费升级', '参与产品内测', '专属创作模板'],
    color: '#C0C0C0',
    icon: '🥈'
  },
  {
    id: 'gold',
    name: '金牌创作者',
    minVideos: 100,
    benefits: ['企业版免费升级', '平台代言人', '分成收益'],
    color: '#FFD700',
    icon: '🥇'
  },
  {
    id: 'diamond',
    name: '钻石创作者',
    minVideos: 200,
    benefits: ['最高分成比例', '产品决策权', '品牌合作机会'],
    color: '#B9F2FF',
    icon: '💎'
  }
]

// 病毒式传播触发器
export const VIRAL_TRIGGERS: ViralTrigger[] = [
  {
    id: 'first_video',
    type: 'achievement',
    title: '🎉 恭喜！您已生成第一个视频',
    description: '分享您的创作成果，让更多人看到！',
    action: '立即分享',
    reward: '获得1个免费视频',
    cooldown: 0
  },
  {
    id: 'viral_moment',
    type: 'social',
    title: '🔥 您的视频获得100个赞！',
    description: '这是一个病毒式传播的时刻！',
    action: '分享到更多平台',
    reward: '获得3个免费视频',
    cooldown: 24
  },
  {
    id: 'scarcity_alert',
    type: 'scarcity',
    title: '⏰ 限时优惠即将结束',
    description: '专业版7折优惠仅剩2小时！',
    action: '立即升级',
    reward: '节省¥60',
    cooldown: 2
  },
  {
    id: 'fear_missing',
    type: 'fear',
    title: '😱 您的好友都在创作！',
    description: '不要错过这个创作热潮',
    action: '立即创作',
    reward: '获得创作灵感包',
    cooldown: 12
  },
  {
    id: 'surprise_gift',
    type: 'surprise',
    title: '🎁 惊喜！您获得了神秘奖励',
    description: '基于您的创作表现，我们为您准备了特别礼物',
    action: '查看奖励',
    reward: '随机奖励',
    cooldown: 48
  }
]

// 增长引擎核心类
export class GrowthEngine {
  private metrics: GrowthMetrics
  private userEngagements: Map<string, UserEngagement> = new Map()

  constructor() {
    this.metrics = this.initializeMetrics()
  }

  private initializeMetrics(): GrowthMetrics {
    return {
      acquisition: {
        totalUsers: 0,
        newUsersToday: 0,
        referralRate: 0,
        organicRate: 0
      },
      activation: {
        firstVideoRate: 0,
        timeToFirstVideo: 0,
        templateUsageRate: 0
      },
      retention: {
        day1Retention: 0,
        day7Retention: 0,
        day30Retention: 0,
        monthlyActiveUsers: 0
      },
      referral: {
        totalReferrals: 0,
        viralCoefficient: 0,
        shareRate: 0
      },
      revenue: {
        monthlyRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        conversionRate: 0
      }
    }
  }

  // 用户等级计算
  calculateUserTier(monthlyVideos: number): UserTier {
    for (let i = USER_TIERS.length - 1; i >= 0; i--) {
      if (monthlyVideos >= USER_TIERS[i].minVideos) {
        return USER_TIERS[i]
      }
    }
    return USER_TIERS[0] // 默认铜牌
  }

  // 病毒式传播系数计算
  calculateViralCoefficient(): number {
    const { totalReferrals, totalUsers } = this.metrics.referral
    return totalUsers > 0 ? totalReferrals / totalUsers : 0
  }

  // 用户参与度评分
  calculateEngagementScore(userId: string): number {
    const engagement = this.userEngagements.get(userId)
    if (!engagement) return 0

    const weights = {
      videos: 0.3,
      referrals: 0.25,
      shares: 0.2,
      streak: 0.15,
      achievements: 0.1
    }

    return (
      engagement.monthlyVideos * weights.videos +
      engagement.referralCount * weights.referrals +
      engagement.socialShares * weights.shares +
      engagement.streakDays * weights.streak +
      engagement.achievements.length * weights.achievements
    )
  }

  // 个性化触发器推荐
  getPersonalizedTriggers(userId: string): ViralTrigger[] {
    const engagement = this.userEngagements.get(userId)
    if (!engagement) return VIRAL_TRIGGERS.slice(0, 2)

    const triggers = VIRAL_TRIGGERS.filter(trigger => {
      // 基于用户行为个性化推荐
      if (trigger.type === 'achievement' && engagement.totalVideos === 1) {
        return true
      }
      if (trigger.type === 'social' && engagement.socialShares > 10) {
        return true
      }
      if (trigger.type === 'scarcity' && engagement.tier.id === 'bronze') {
        return true
      }
      return Math.random() > 0.5 // 随机推荐其他触发器
    })

    return triggers.slice(0, 3)
  }

  // 增长黑客实验
  runGrowthExperiment(experimentId: string, variant: string, userId: string): any {
    const experiments = {
      'pricing_anchor': {
        control: { price: 199, anchor: 299 },
        variant_a: { price: 199, anchor: 399 },
        variant_b: { price: 199, anchor: 599 }
      },
      'cta_button': {
        control: '立即订阅',
        variant_a: '开始创作之旅',
        variant_b: '解锁无限可能'
      },
      'social_proof': {
        control: '已有1000+用户',
        variant_a: '已有10000+创作者',
        variant_b: '已有100000+视频生成'
      }
    }

    return experiments[experimentId]?.[variant] || experiments[experimentId]?.control
  }

  // 用户生命周期价值预测
  predictLTV(userId: string): number {
    const engagement = this.userEngagements.get(userId)
    if (!engagement) return 0

    const baseLTV = 200 // 基础LTV
    const tierMultiplier = {
      bronze: 1.0,
      silver: 1.5,
      gold: 2.0,
      diamond: 3.0
    }[engagement.tier.id] || 1.0

    const engagementMultiplier = Math.min(this.calculateEngagementScore(userId) / 100, 2.0)
    
    return baseLTV * tierMultiplier * engagementMultiplier
  }

  // 获取增长建议
  getGrowthRecommendations(): string[] {
    const recommendations = []

    if (this.metrics.activation.firstVideoRate < 0.3) {
      recommendations.push('优化首次视频生成流程，降低创作门槛')
    }

    if (this.metrics.retention.day7Retention < 0.2) {
      recommendations.push('加强用户留存策略，增加粘性功能')
    }

    if (this.metrics.referral.viralCoefficient < 0.1) {
      recommendations.push('优化邀请奖励机制，提高病毒式传播')
    }

    if (this.metrics.revenue.conversionRate < 0.05) {
      recommendations.push('优化定价策略，提高付费转化率')
    }

    return recommendations
  }
}

// 单例模式
export const growthEngine = new GrowthEngine()
