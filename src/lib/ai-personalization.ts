// AI个性化推荐系统
import { prisma } from './prisma'

export interface UserProfile {
  id: string
  email: string
  name?: string
  preferences: {
    industry?: string
    role?: string
    usagePattern?: string
    colorPreference?: string
    timeOfDay?: string
    deviceType?: string
    location?: string
  }
  behavior: {
    loginFrequency: number
    sessionDuration: number
    featureUsage: Record<string, number>
    lastActive: Date
  }
  demographics: {
    age?: number
    gender?: string
    location?: string
    language?: string
  }
}

export interface Recommendation {
  id: string
  type: 'theme' | 'feature' | 'content' | 'workflow'
  title: string
  description: string
  confidence: number
  reason: string
  action?: {
    label: string
    url: string
    method: 'navigate' | 'api' | 'modal'
  }
}

// 用户行为分析
export async function analyzeUserBehavior(userId: string): Promise<UserProfile['behavior']> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 100
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const activities = user.activities
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // 计算登录频率
  const loginActivities = activities.filter(a => a.action === 'login')
  const loginFrequency = loginActivities.length / 7 // 每天登录次数

  // 计算会话持续时间
  const sessionActivities = activities.filter(a => a.action === 'session_start')
  const sessionDuration = sessionActivities.length > 0 
    ? activities.reduce((acc, a) => acc + (a.createdAt.getTime() - a.createdAt.getTime()), 0) / sessionActivities.length / 1000 / 60
    : 0

  // 计算功能使用情况
  const featureUsage: Record<string, number> = {}
  activities.forEach(activity => {
    if (activity.action.startsWith('feature_')) {
      const feature = activity.action.replace('feature_', '')
      featureUsage[feature] = (featureUsage[feature] || 0) + 1
    }
  })

  return {
    loginFrequency,
    sessionDuration,
    featureUsage,
    lastActive: activities[0]?.createdAt || user.createdAt
  }
}

// 智能主题推荐
export async function getPersonalizedThemeRecommendation(userId: string): Promise<Recommendation> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const behavior = await analyzeUserBehavior(userId)
  const activities = user.activities

  // 分析用户偏好
  const isCreativeUser = activities.some(a => a.action.includes('creative') || a.action.includes('design'))
  const isBusinessUser = activities.some(a => a.action.includes('business') || a.action.includes('professional'))
  const isTechUser = activities.some(a => a.action.includes('tech') || a.action.includes('developer'))
  const isCasualUser = behavior.sessionDuration < 30 && behavior.loginFrequency < 1

  // 基于行为推荐主题
  let recommendedTheme = 'professional'
  let confidence = 0.7
  let reason = '基于您的使用模式推荐'

  if (isCreativeUser) {
    recommendedTheme = 'creative'
    confidence = 0.9
    reason = '检测到您经常使用创意功能，推荐创意主题'
  } else if (isBusinessUser) {
    recommendedTheme = 'professional'
    confidence = 0.8
    reason = '基于您的商务使用模式推荐'
  } else if (isTechUser) {
    recommendedTheme = 'futuristic'
    confidence = 0.85
    reason = '检测到技术背景，推荐科技主题'
  } else if (isCasualUser) {
    recommendedTheme = 'cozy'
    confidence = 0.75
    reason = '基于您的使用习惯推荐舒适主题'
  }

  return {
    id: `theme-${recommendedTheme}`,
    type: 'theme',
    title: `推荐${recommendedTheme === 'professional' ? '专业' : recommendedTheme === 'creative' ? '创意' : recommendedTheme === 'futuristic' ? '科技' : '舒适'}主题`,
    description: `基于您的使用模式，我们推荐${recommendedTheme}主题来提升您的工作效率`,
    confidence,
    reason,
    action: {
      label: '应用主题',
      url: `/api/theme/apply?theme=${recommendedTheme}`,
      method: 'api'
    }
  }
}

// 功能推荐
export async function getFeatureRecommendations(userId: string): Promise<Recommendation[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 100
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const behavior = await analyzeUserBehavior(userId)
  const recommendations: Recommendation[] = []

  // 基于使用模式推荐功能
  if (behavior.featureUsage['video_generation'] > 5) {
    recommendations.push({
      id: 'feature-batch-processing',
      type: 'feature',
      title: '批量视频处理',
      description: '您经常生成视频，可以尝试批量处理功能提高效率',
      confidence: 0.8,
      reason: '基于您的视频生成频率推荐',
      action: {
        label: '了解详情',
        url: '/features/batch-processing',
        method: 'navigate'
      }
    })
  }

  if (behavior.featureUsage['dashboard'] > 10) {
    recommendations.push({
      id: 'feature-analytics',
      type: 'feature',
      title: '数据分析面板',
      description: '您经常查看仪表板，数据分析功能可以帮助您更好地了解使用情况',
      confidence: 0.75,
      reason: '基于您的仪表板使用频率推荐',
      action: {
        label: '开启分析',
        url: '/dashboard/analytics',
        method: 'navigate'
      }
    })
  }

  if (behavior.sessionDuration > 60) {
    recommendations.push({
      id: 'feature-productivity',
      type: 'workflow',
      title: '生产力工具',
      description: '您的工作时间较长，可以尝试我们的生产力工具来提高效率',
      confidence: 0.7,
      reason: '基于您的会话时长推荐',
      action: {
        label: '查看工具',
        url: '/productivity',
        method: 'navigate'
      }
    })
  }

  return recommendations
}

// 内容推荐
export async function getContentRecommendations(userId: string): Promise<Recommendation[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const behavior = await analyzeUserBehavior(userId)
  const recommendations: Recommendation[] = []

  // 基于使用模式推荐内容
  if (behavior.featureUsage['video_generation'] > 0) {
    recommendations.push({
      id: 'content-video-tutorials',
      type: 'content',
      title: '视频制作教程',
      description: '基于您的视频生成活动，推荐相关教程和技巧',
      confidence: 0.8,
      reason: '基于您的视频生成活动推荐',
      action: {
        label: '查看教程',
        url: '/tutorials/video-creation',
        method: 'navigate'
      }
    })
  }

  if (behavior.loginFrequency > 2) {
    recommendations.push({
      id: 'content-best-practices',
      type: 'content',
      title: '最佳实践指南',
      description: '您是我们的活跃用户，这些最佳实践可以帮助您更好地使用平台',
      confidence: 0.75,
      reason: '基于您的活跃度推荐',
      action: {
        label: '阅读指南',
        url: '/guides/best-practices',
        method: 'navigate'
      }
    })
  }

  return recommendations
}

// 获取所有推荐
export async function getAllRecommendations(userId: string): Promise<Recommendation[]> {
  const [themeRecommendation, featureRecommendations, contentRecommendations] = await Promise.all([
    getPersonalizedThemeRecommendation(userId),
    getFeatureRecommendations(userId),
    getContentRecommendations(userId)
  ])

  return [
    themeRecommendation,
    ...featureRecommendations,
    ...contentRecommendations
  ].sort((a, b) => b.confidence - a.confidence)
}

// 记录用户反馈
export async function recordUserFeedback(
  userId: string,
  recommendationId: string,
  feedback: 'accepted' | 'dismissed' | 'ignored'
): Promise<void> {
  await prisma.userActivity.create({
    data: {
      userId,
      action: 'recommendation_feedback',
      details: JSON.stringify({
        recommendationId,
        feedback,
        timestamp: new Date()
      }),
      ipAddress: '127.0.0.1', // 在实际应用中应该获取真实IP
      userAgent: 'AI-Personalization-System'
    }
  })
}

// 更新用户偏好
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserProfile['preferences']>
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      // 这里需要根据实际的数据库结构来更新
      // 可能需要创建新的表来存储用户偏好
    }
  })
}
