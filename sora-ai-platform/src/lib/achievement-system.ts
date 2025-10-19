/**
 * 成就系统 - 基于《超级用户》理论设计
 * 实现用户等级提升和成就解锁机制
 */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'creation' | 'social' | 'growth' | 'mastery' | 'community' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'diamond'
  points: number
  requirements: {
    minVideos?: number
    minShares?: number
    minReferrals?: number
    minStreakDays?: number
    minLikes?: number
    minComments?: number
    specificAction?: string
  }
  rewards: {
    freeVideos?: number
    premiumFeatures?: string[]
    badges?: string[]
    title?: string
  }
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt?: Date
}

export interface UserTier {
  id: string
  name: string
  icon: string
  color: string
  minPoints: number
  benefits: string[]
  nextTier?: string
}

// 用户等级定义
export const USER_TIERS: UserTier[] = [
  {
    id: 'bronze',
    name: '铜牌创作者',
    icon: '🥉',
    color: '#CD7F32',
    minPoints: 0,
    benefits: [
      '基础创作工具',
      '标准视频质量',
      '社区支持',
      '每月5个免费视频'
    ],
    nextTier: 'silver'
  },
  {
    id: 'silver',
    name: '银牌创作者',
    icon: '🥈',
    color: '#C0C0C0',
    minPoints: 100,
    benefits: [
      '高级创作工具',
      '高清视频质量',
      '优先客服支持',
      '每月15个免费视频',
      '专属模板库'
    ],
    nextTier: 'gold'
  },
  {
    id: 'gold',
    name: '金牌创作者',
    icon: '🥇',
    color: '#FFD700',
    minPoints: 500,
    benefits: [
      '专业创作工具',
      '4K视频质量',
      '专属客服支持',
      '每月50个免费视频',
      '高级模板库',
      '创作数据分析'
    ],
    nextTier: 'diamond'
  },
  {
    id: 'diamond',
    name: '钻石创作者',
    icon: '💎',
    color: '#B9F2FF',
    minPoints: 1000,
    benefits: [
      '顶级创作工具',
      '8K视频质量',
      '专属客户经理',
      '无限免费视频',
      '全部模板库',
      '高级数据分析',
      '平台分成收益',
      '产品决策参与权'
    ]
  }
]

// 成就定义
export const ACHIEVEMENTS: Achievement[] = [
  // 创作类成就
  {
    id: 'first_video',
    title: '初出茅庐',
    description: '生成第一个视频',
    icon: '🎬',
    category: 'creation',
    tier: 'bronze',
    points: 10,
    requirements: { minVideos: 1 },
    rewards: { freeVideos: 1, badges: ['新手创作者'] },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'video_master',
    title: '视频大师',
    description: '生成10个视频',
    icon: '🎭',
    category: 'creation',
    tier: 'silver',
    points: 50,
    requirements: { minVideos: 10 },
    rewards: { freeVideos: 5, badges: ['视频大师'] },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'prolific_creator',
    title: '高产创作者',
    description: '生成50个视频',
    icon: '🎨',
    category: 'creation',
    tier: 'gold',
    points: 200,
    requirements: { minVideos: 50 },
    rewards: { freeVideos: 20, badges: ['高产创作者'] },
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'creation_legend',
    title: '创作传奇',
    description: '生成100个视频',
    icon: '👑',
    category: 'creation',
    tier: 'diamond',
    points: 500,
    requirements: { minVideos: 100 },
    rewards: { freeVideos: 50, badges: ['创作传奇'], title: '传奇创作者' },
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },

  // 社交类成就
  {
    id: 'social_butterfly',
    title: '社交达人',
    description: '分享10个视频到社交媒体',
    icon: '📱',
    category: 'social',
    tier: 'bronze',
    points: 20,
    requirements: { minShares: 10 },
    rewards: { freeVideos: 3, badges: ['社交达人'] },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'viral_creator',
    title: '病毒式创作者',
    description: '单个视频获得1000个赞',
    icon: '🔥',
    category: 'social',
    tier: 'gold',
    points: 300,
    requirements: { minLikes: 1000 },
    rewards: { freeVideos: 15, badges: ['病毒式创作者'] },
    unlocked: false,
    progress: 0,
    maxProgress: 1000
  },
  {
    id: 'influencer',
    title: '影响力者',
    description: '总点赞数达到10000',
    icon: '⭐',
    category: 'social',
    tier: 'diamond',
    points: 800,
    requirements: { minLikes: 10000 },
    rewards: { freeVideos: 30, badges: ['影响力者'], title: '影响力创作者' },
    unlocked: false,
    progress: 0,
    maxProgress: 10000
  },

  // 增长类成就
  {
    id: 'referral_king',
    title: '邀请之王',
    description: '成功邀请5个好友',
    icon: '👑',
    category: 'growth',
    tier: 'silver',
    points: 100,
    requirements: { minReferrals: 5 },
    rewards: { freeVideos: 10, badges: ['邀请之王'] },
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'growth_champion',
    title: '增长冠军',
    description: '成功邀请20个好友',
    icon: '🚀',
    category: 'growth',
    tier: 'gold',
    points: 400,
    requirements: { minReferrals: 20 },
    rewards: { freeVideos: 25, badges: ['增长冠军'] },
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'community_builder',
    title: '社区建设者',
    description: '成功邀请50个好友',
    icon: '🏗️',
    category: 'growth',
    tier: 'diamond',
    points: 1000,
    requirements: { minReferrals: 50 },
    rewards: { freeVideos: 50, badges: ['社区建设者'], title: '社区领袖' },
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },

  // 精通类成就
  {
    id: 'streak_master',
    title: '连续创作',
    description: '连续7天创作视频',
    icon: '🔥',
    category: 'mastery',
    tier: 'bronze',
    points: 30,
    requirements: { minStreakDays: 7 },
    rewards: { freeVideos: 5, badges: ['坚持者'] },
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'consistency_champion',
    title: '坚持冠军',
    description: '连续30天创作视频',
    icon: '💪',
    category: 'mastery',
    tier: 'gold',
    points: 200,
    requirements: { minStreakDays: 30 },
    rewards: { freeVideos: 20, badges: ['坚持冠军'] },
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'dedication_master',
    title: '专注大师',
    description: '连续100天创作视频',
    icon: '🎯',
    category: 'mastery',
    tier: 'diamond',
    points: 500,
    requirements: { minStreakDays: 100 },
    rewards: { freeVideos: 50, badges: ['专注大师'], title: '专注创作者' },
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },

  // 社区类成就
  {
    id: 'helpful_creator',
    title: '乐于助人',
    description: '帮助其他用户解决问题',
    icon: '🤝',
    category: 'community',
    tier: 'silver',
    points: 50,
    requirements: { specificAction: 'help_others' },
    rewards: { freeVideos: 5, badges: ['乐于助人'] },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'community_mentor',
    title: '社区导师',
    description: '成为新用户的导师',
    icon: '👨‍🏫',
    category: 'community',
    tier: 'gold',
    points: 150,
    requirements: { specificAction: 'mentor_new_user' },
    rewards: { freeVideos: 15, badges: ['社区导师'] },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },

  // 特殊成就
  {
    id: 'early_adopter',
    title: '早期采用者',
    description: '在平台早期阶段加入',
    icon: '🚀',
    category: 'special',
    tier: 'gold',
    points: 100,
    requirements: { specificAction: 'early_user' },
    rewards: { freeVideos: 10, badges: ['早期采用者'], title: '先锋用户' },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'platform_ambassador',
    title: '平台大使',
    description: '成为平台官方大使',
    icon: '🎖️',
    category: 'special',
    tier: 'diamond',
    points: 1000,
    requirements: { specificAction: 'platform_ambassador' },
    rewards: { freeVideos: 100, badges: ['平台大使'], title: '官方大使' },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
]

// 成就系统引擎
export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map()
  private userTiers: Map<string, UserTier> = new Map()

  constructor() {
    // 初始化成就和等级
    ACHIEVEMENTS.forEach(achievement => {
      this.achievements.set(achievement.id, { ...achievement })
    })
    USER_TIERS.forEach(tier => {
      this.userTiers.set(tier.id, { ...tier })
    })
  }

  // 计算用户等级
  calculateUserTier(totalPoints: number): UserTier {
    for (let i = USER_TIERS.length - 1; i >= 0; i--) {
      if (totalPoints >= USER_TIERS[i].minPoints) {
        return USER_TIERS[i]
      }
    }
    return USER_TIERS[0]
  }

  // 检查成就进度
  checkAchievementProgress(userStats: any): Achievement[] {
    const updatedAchievements: Achievement[] = []

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return

      const requirements = achievement.requirements
      let progress = 0
      let maxProgress = 1

      // 计算进度
      if (requirements.minVideos) {
        progress = Math.min(userStats.totalVideos || 0, requirements.minVideos)
        maxProgress = requirements.minVideos
      } else if (requirements.minShares) {
        progress = Math.min(userStats.socialShares || 0, requirements.minShares)
        maxProgress = requirements.minShares
      } else if (requirements.minReferrals) {
        progress = Math.min(userStats.referralCount || 0, requirements.minReferrals)
        maxProgress = requirements.minReferrals
      } else if (requirements.minStreakDays) {
        progress = Math.min(userStats.streakDays || 0, requirements.minStreakDays)
        maxProgress = requirements.minStreakDays
      } else if (requirements.minLikes) {
        progress = Math.min(userStats.totalLikes || 0, requirements.minLikes)
        maxProgress = requirements.minLikes
      }

      // 更新成就
      const updatedAchievement = {
        ...achievement,
        progress,
        maxProgress,
        unlocked: progress >= maxProgress
      }

      if (updatedAchievement.unlocked) {
        updatedAchievement.unlockedAt = new Date()
      }

      updatedAchievements.push(updatedAchievement)
      this.achievements.set(achievement.id, updatedAchievement)
    })

    return updatedAchievements
  }

  // 获取用户成就
  getUserAchievements(userStats: any): {
    unlocked: Achievement[]
    locked: Achievement[]
    totalPoints: number
    userTier: UserTier
  } {
    const achievements = this.checkAchievementProgress(userStats)
    const unlocked = achievements.filter(a => a.unlocked)
    const locked = achievements.filter(a => !a.unlocked)
    const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0)
    const userTier = this.calculateUserTier(totalPoints)

    return { unlocked, locked, totalPoints, userTier }
  }

  // 获取成就奖励
  getAchievementRewards(achievementId: string): any {
    const achievement = this.achievements.get(achievementId)
    return achievement?.rewards || {}
  }

  // 按类别获取成就
  getAchievementsByCategory(category: string): Achievement[] {
    return Array.from(this.achievements.values()).filter(a => a.category === category)
  }

  // 获取等级信息
  getTierInfo(tierId: string): UserTier | undefined {
    return this.userTiers.get(tierId)
  }

  // 获取所有等级
  getAllTiers(): UserTier[] {
    return Array.from(this.userTiers.values())
  }
}

// 单例模式
export const achievementSystem = new AchievementSystem()
