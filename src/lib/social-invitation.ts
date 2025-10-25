// 社交化邀请系统
import { prisma } from './prisma'

export interface SocialInvitationConfig {
  // 多渠道邀请
  channels: {
    email: boolean
    sms: boolean
    social: boolean
    qr: boolean
    link: boolean
  }
  // 智能推荐
  smartRecommendation: {
    enabled: boolean
    suggestedContacts: boolean
    bestTimeToInvite: boolean
    personalizedMessage: boolean
    incentiveOffer: boolean
  }
  // 病毒式传播
  viralMechanics: {
    gamification: boolean
    leaderboards: boolean
    achievements: boolean
    socialProof: boolean
  }
}

export interface InvitationChannel {
  id: string
  name: string
  icon: string
  enabled: boolean
  template: string
  shareUrl?: string
}

export interface ContactSuggestion {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  relationship: string
  inviteProbability: number
  lastContact?: Date
}

export interface InvitationTemplate {
  id: string
  channel: string
  subject?: string
  message: string
  personalized: boolean
  variables: string[]
}

export interface ViralMetrics {
  totalInvites: number
  successfulInvites: number
  conversionRate: number
  viralCoefficient: number
  socialShares: number
  leaderboardPosition: number
}

export class SocialInvitation {
  private config: SocialInvitationConfig

  constructor(config: SocialInvitationConfig) {
    this.config = config
  }

  // 获取邀请渠道
  getInvitationChannels(): InvitationChannel[] {
    const channels: InvitationChannel[] = []

    if (this.config.channels.email) {
      channels.push({
        id: 'email',
        name: '邮件邀请',
        icon: 'mail',
        enabled: true,
        template: 'email_invitation'
      })
    }

    if (this.config.channels.sms) {
      channels.push({
        id: 'sms',
        name: '短信邀请',
        icon: 'phone',
        enabled: true,
        template: 'sms_invitation'
      })
    }

    if (this.config.channels.social) {
      channels.push({
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        enabled: true,
        template: 'social_share'
      })
      channels.push({
        id: 'twitter',
        name: 'Twitter',
        icon: 'twitter',
        enabled: true,
        template: 'social_share'
      })
      channels.push({
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'linkedin',
        enabled: true,
        template: 'social_share'
      })
      channels.push({
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'message-circle',
        enabled: true,
        template: 'whatsapp_share'
      })
    }

    if (this.config.channels.qr) {
      channels.push({
        id: 'qr',
        name: '二维码',
        icon: 'qr-code',
        enabled: true,
        template: 'qr_invitation'
      })
    }

    if (this.config.channels.link) {
      channels.push({
        id: 'link',
        name: '邀请链接',
        icon: 'link',
        enabled: true,
        template: 'direct_link'
      })
    }

    return channels
  }

  // 获取智能联系人推荐
  async getContactSuggestions(userId: string): Promise<ContactSuggestion[]> {
    if (!this.config.smartRecommendation.suggestedContacts) {
      return []
    }

    // 这里应该集成真实的联系人API
    // 目前返回模拟数据
    const suggestions: ContactSuggestion[] = [
      {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        relationship: '朋友',
        inviteProbability: 0.8,
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: '李四',
        phone: '+86 138 0013 8000',
        relationship: '同事',
        inviteProbability: 0.6,
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        relationship: '同学',
        inviteProbability: 0.7,
        lastContact: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ]

    return suggestions
  }

  // 生成个性化邀请消息
  async generatePersonalizedMessage(
    userId: string,
    recipientName: string,
    channel: string
  ): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return '邀请您加入我们的AI视频创作平台！'
    }

    const templates = {
      email: `嗨 ${recipientName}！

我是${user.name}，想邀请您体验我们最新的AI视频创作平台。

🎬 只需几秒钟，就能将您的想法变成专业视频
🚀 免费试用，无需信用卡
🎁 通过我的邀请链接注册，您将获得额外奖励

立即体验：{inviteLink}

期待与您一起创作精彩内容！

${user.name}`,

      sms: `嗨${recipientName}！我是${user.name}，邀请您体验AI视频创作平台。免费试用，立即体验：{inviteLink}`,

      social: `🎬 刚刚体验了超棒的AI视频创作平台！

只需几秒钟就能将想法变成专业视频，效果令人惊艳！

通过我的邀请链接注册还能获得额外奖励：{inviteLink}

#AI视频 #创意 #科技`,

      whatsapp: `🎬 嗨！我刚体验了一个超棒的AI视频创作平台

只需几秒钟就能将想法变成专业视频，效果真的很棒！

通过我的邀请链接注册还能获得奖励：{inviteLink}

一起来创作精彩内容吧！`
    }

    return templates[channel as keyof typeof templates] || templates.email
  }

  // 获取最佳邀请时间
  async getBestInviteTime(userId: string): Promise<Date[]> {
    if (!this.config.smartRecommendation.bestTimeToInvite) {
      return []
    }

    // 分析用户活动模式，推荐最佳邀请时间
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // 简单的推荐逻辑：工作日晚上7-9点，周末上午10-12点
    const now = new Date()
    const recommendations: Date[] = []

    // 今天晚上的推荐时间
    const tonight = new Date(now)
    tonight.setHours(19, 0, 0, 0)
    if (tonight > now) {
      recommendations.push(tonight)
    }

    // 明天晚上的推荐时间
    const tomorrowNight = new Date(now)
    tomorrowNight.setDate(tomorrowNight.getDate() + 1)
    tomorrowNight.setHours(19, 0, 0, 0)
    recommendations.push(tomorrowNight)

    // 周末上午的推荐时间
    const weekend = new Date(now)
    const dayOfWeek = weekend.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 周末
      weekend.setHours(10, 0, 0, 0)
      if (weekend > now) {
        recommendations.push(weekend)
      }
    }

    return recommendations
  }

  // 发送邀请
  async sendInvitation(
    userId: string,
    channel: string,
    recipients: string[],
    message?: string
  ): Promise<{ success: boolean; sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    for (const recipient of recipients) {
      try {
        // 这里应该集成真实的发送服务
        console.log(`通过${channel}发送邀请给${recipient}`)
        
        // 记录邀请活动
        await prisma.userActivity.create({
          data: {
            userId,
            action: 'send_invitation',
            details: JSON.stringify({
              channel,
              recipient,
              message: message || '默认邀请消息'
            }),
            ipAddress: '',
            userAgent: ''
          }
        })

        sent++
      } catch (error) {
        console.error(`发送邀请失败: ${recipient}`, error)
        failed++
      }
    }

    return { success: sent > 0, sent, failed }
  }

  // 获取病毒式传播指标
  async getViralMetrics(userId: string): Promise<ViralMetrics> {
    const activities = await prisma.userActivity.findMany({
      where: {
        userId,
        action: 'send_invitation'
      }
    })

    const totalInvites = activities.length
    const successfulInvites = activities.filter(a => {
      const details = JSON.parse(a.details)
      return details.success
    }).length

    const conversionRate = totalInvites > 0 ? successfulInvites / totalInvites : 0
    const viralCoefficient = successfulInvites * 0.3 // 假设每个成功邀请带来0.3个新用户

    // 获取社交分享数据
    const socialShares = await prisma.userActivity.count({
      where: {
        userId,
        action: 'social_share'
      }
    })

    // 计算排行榜位置（简化版）
    const allUsers = await prisma.user.findMany({
      include: {
        activities: {
          where: { action: 'send_invitation' }
        }
      }
    })

    const sortedUsers = allUsers.sort((a, b) => 
      b.activities.length - a.activities.length
    )

    const leaderboardPosition = sortedUsers.findIndex(u => u.id === userId) + 1

    return {
      totalInvites,
      successfulInvites,
      conversionRate,
      viralCoefficient,
      socialShares,
      leaderboardPosition
    }
  }

  // 生成邀请链接
  generateInviteLink(userId: string, referralCode: string): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    return `${baseUrl}/auth/signup?ref=${referralCode}&inviter=${userId}`
  }

  // 生成二维码数据
  generateQRCodeData(inviteLink: string): string {
    // 这里应该集成真实的二维码生成库
    return `data:image/png;base64,${Buffer.from(inviteLink).toString('base64')}`
  }
}

// 默认配置
export const defaultSocialInvitationConfig: SocialInvitationConfig = {
  channels: {
    email: true,
    sms: true,
    social: true,
    qr: true,
    link: true
  },
  smartRecommendation: {
    enabled: true,
    suggestedContacts: true,
    bestTimeToInvite: true,
    personalizedMessage: true,
    incentiveOffer: true
  },
  viralMechanics: {
    gamification: true,
    leaderboards: true,
    achievements: true,
    socialProof: true
  }
}

export const socialInvitation = new SocialInvitation(defaultSocialInvitationConfig)
