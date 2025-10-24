/**
 * 病毒式传播引擎 - 基于《疯传》STEPPS原则
 * 实现社交货币、触发物、情感、公共性、实用价值、故事
 */

export interface ViralEvent {
  id: string
  type: 'social_currency' | 'trigger' | 'emotion' | 'public' | 'practical' | 'story'
  title: string
  description: string
  action: string
  reward: string
  cooldown: number
  conditions: {
    minVideos?: number
    minShares?: number
    minReferrals?: number
    streakDays?: number
  }
}

export interface SocialProof {
  totalUsers: number
  totalVideos: number
  totalShares: number
  recentActivity: Array<{
    user: string
    action: string
    timestamp: Date
  }>
}

// 病毒式传播事件库
export const VIRAL_EVENTS: ViralEvent[] = [
  // 社交货币类
  {
    id: 'first_creator',
    type: 'social_currency',
    title: '🎬 恭喜成为创作者！',
    description: '您已生成第一个视频，成为我们的创作者社区一员',
    action: '分享创作成果',
    reward: '获得创作者认证徽章',
    cooldown: 0,
    conditions: { minVideos: 1 }
  },
  {
    id: 'viral_moment',
    type: 'social_currency',
    title: '🔥 您的视频火了！',
    description: '您的视频获得100个赞，这是一个病毒式传播的时刻！',
    action: '分享到更多平台',
    reward: '获得3个免费视频',
    cooldown: 24,
    conditions: { minShares: 100 }
  },
  {
    id: 'top_creator',
    type: 'social_currency',
    title: '🏆 您是本周Top创作者！',
    description: '您的创作质量获得平台认可，进入本周排行榜',
    action: '展示创作成就',
    reward: '获得专属创作者标识',
    cooldown: 168,
    conditions: { minVideos: 10 }
  },

  // 触发物类
  {
    id: 'daily_reminder',
    type: 'trigger',
    title: '⏰ 每日创作提醒',
    description: '今天是创作的好日子，不要错过灵感时刻',
    action: '立即创作',
    reward: '获得创作灵感包',
    cooldown: 24,
    conditions: {}
  },
  {
    id: 'trending_topic',
    type: 'trigger',
    title: '📈 热门话题推荐',
    description: '当前热门话题：#AI视频创作，快来参与讨论',
    action: '创作相关视频',
    reward: '获得话题热度加成',
    cooldown: 12,
    conditions: {}
  },

  // 情感类
  {
    id: 'surprise_gift',
    type: 'emotion',
    title: '🎁 惊喜礼物！',
    description: '基于您的创作表现，我们为您准备了特别礼物',
    action: '领取惊喜',
    reward: '随机奖励包',
    cooldown: 48,
    conditions: {}
  },
  {
    id: 'achievement_unlock',
    type: 'emotion',
    title: '🏅 成就解锁！',
    description: '恭喜您解锁新成就，继续加油！',
    action: '查看成就',
    reward: '获得成就奖励',
    cooldown: 0,
    conditions: { minVideos: 5 }
  },

  // 公共性类
  {
    id: 'public_showcase',
    type: 'public',
    title: '🌟 作品公开展示',
    description: '您的作品被选入平台精选，获得更多曝光',
    action: '分享到社交媒体',
    reward: '获得曝光加成',
    cooldown: 72,
    conditions: { minVideos: 3 }
  },
  {
    id: 'community_spotlight',
    type: 'public',
    title: '👑 社区焦点人物',
    description: '您成为本周社区焦点，获得更多关注',
    action: '与粉丝互动',
    reward: '获得粉丝增长加成',
    cooldown: 168,
    conditions: { minShares: 50 }
  },

  // 实用价值类
  {
    id: 'skill_upgrade',
    type: 'practical',
    title: '📚 技能升级包',
    description: '解锁高级创作技巧，提升视频质量',
    action: '学习新技能',
    reward: '获得高级模板',
    cooldown: 0,
    conditions: { minVideos: 10 }
  },
  {
    id: 'tool_unlock',
    type: 'practical',
    title: '🛠️ 新工具解锁',
    description: '解锁专业级创作工具，让创作更高效',
    action: '试用新工具',
    reward: '获得工具使用权限',
    cooldown: 0,
    conditions: { minVideos: 20 }
  },

  // 故事类
  {
    id: 'creator_journey',
    type: 'story',
    title: '📖 创作故事分享',
    description: '分享您的创作历程，激励更多创作者',
    action: '分享创作故事',
    reward: '获得故事传播奖励',
    cooldown: 0,
    conditions: { minVideos: 15 }
  },
  {
    id: 'inspiration_spread',
    type: 'story',
    title: '💡 灵感传播者',
    description: '您的创作启发了其他用户，成为灵感传播者',
    action: '继续创作',
    reward: '获得灵感传播者称号',
    cooldown: 0,
    conditions: { minReferrals: 5 }
  }
]

// 病毒式传播引擎
export class ViralEngine {
  private userStats: Map<string, any> = new Map()
  private socialProof: SocialProof

  constructor() {
    this.socialProof = this.initializeSocialProof()
  }

  private initializeSocialProof(): SocialProof {
    return {
      totalUsers: 12543,
      totalVideos: 45678,
      totalShares: 12345,
      recentActivity: [
        { user: '创作者A', action: '生成了新视频', timestamp: new Date() },
        { user: '创作者B', action: '分享了作品', timestamp: new Date() },
        { user: '创作者C', action: '邀请了好友', timestamp: new Date() }
      ]
    }
  }

  // 获取用户个性化病毒事件
  getPersonalizedEvents(userId: string, userStats: any): ViralEvent[] {
    const events = VIRAL_EVENTS.filter(event => {
      const conditions = event.conditions
      
      // 检查条件
      if (conditions.minVideos && userStats.totalVideos < conditions.minVideos) return false
      if (conditions.minShares && userStats.socialShares < conditions.minShares) return false
      if (conditions.minReferrals && userStats.referralCount < conditions.minReferrals) return false
      if (conditions.streakDays && userStats.streakDays < conditions.streakDays) return false
      
      return true
    })

    // 按类型和优先级排序
    return events.sort((a, b) => {
      const priority = { social_currency: 5, trigger: 4, emotion: 3, public: 2, practical: 1, story: 0 }
      return priority[b.type] - priority[a.type]
    }).slice(0, 3) // 最多返回3个事件
  }

  // 计算病毒系数
  calculateViralCoefficient(): number {
    const { totalUsers, totalShares } = this.socialProof
    return totalUsers > 0 ? totalShares / totalUsers : 0
  }

  // 获取社交证明数据
  getSocialProof(): SocialProof {
    return this.socialProof
  }

  // 更新社交证明
  updateSocialProof(action: string, userId: string) {
    this.socialProof.recentActivity.unshift({
      user: userId,
      action,
      timestamp: new Date()
    })
    
    // 保持最近10条记录
    this.socialProof.recentActivity = this.socialProof.recentActivity.slice(0, 10)
  }

  // 处理病毒事件
  async processViralEvent(eventId: string, userId: string, action: string): Promise<any> {
    const event = VIRAL_EVENTS.find(e => e.id === eventId)
    if (!event) throw new Error('事件不存在')

    // 更新社交证明
    this.updateSocialProof(action, userId)

    // 根据事件类型处理奖励
    let reward = event.reward
    let additionalReward = ''

    switch (event.type) {
      case 'social_currency':
        additionalReward = '获得社交地位提升'
        break
      case 'trigger':
        additionalReward = '获得创作灵感'
        break
      case 'emotion':
        additionalReward = '获得情感满足'
        break
      case 'public':
        additionalReward = '获得更多曝光'
        break
      case 'practical':
        additionalReward = '获得实用工具'
        break
      case 'story':
        additionalReward = '获得故事传播力'
        break
    }

    return {
      success: true,
      event,
      reward,
      additionalReward,
      message: `恭喜！${event.title} - ${reward}`
    }
  }

  // 获取增长建议
  getGrowthSuggestions(): string[] {
    const suggestions = []
    const viralCoeff = this.calculateViralCoefficient()

    if (viralCoeff < 0.1) {
      suggestions.push('优化分享功能，提高病毒式传播系数')
    }
    if (this.socialProof.totalShares < this.socialProof.totalVideos * 0.3) {
      suggestions.push('鼓励用户分享作品，提高分享率')
    }
    if (this.socialProof.recentActivity.length < 5) {
      suggestions.push('增加用户互动，提升社区活跃度')
    }

    return suggestions
  }
}

// 单例模式
export const viralEngine = new ViralEngine()
