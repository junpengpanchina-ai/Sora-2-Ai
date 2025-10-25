// 渐进式认证系统
import { prisma } from './prisma'
import crypto from 'crypto'

export interface ProgressiveAuthConfig {
  // 无密码登录
  passwordless: {
    magicLink: boolean
    smsCode: boolean
    biometric: boolean
    socialLogin: boolean
  }
  // 智能记住设备
  deviceTrust: {
    autoLogin: boolean
    trustDuration: number // 天
    deviceLimit: number
  }
  // 上下文感知
  contextAware: {
    locationBased: boolean
    timeBased: boolean
    behaviorBased: boolean
  }
}

export interface DeviceFingerprint {
  userAgent: string
  screen: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string
}

export interface TrustedDevice {
  id: string
  userId: string
  deviceFingerprint: string
  deviceName: string
  lastUsed: Date
  trustLevel: number
  createdAt: Date
}

export class ProgressiveAuth {
  private config: ProgressiveAuthConfig

  constructor(config: ProgressiveAuthConfig) {
    this.config = config
  }

  // 生成设备指纹
  generateDeviceFingerprint(deviceInfo: DeviceFingerprint): string {
    const fingerprint = [
      deviceInfo.userAgent,
      deviceInfo.screen,
      deviceInfo.timezone,
      deviceInfo.language,
      deviceInfo.platform,
      deviceInfo.cookieEnabled.toString(),
      deviceInfo.doNotTrack
    ].join('|')

    return crypto.createHash('sha256').update(fingerprint).digest('hex')
  }

  // 检查设备信任
  async checkDeviceTrust(userId: string, deviceFingerprint: string): Promise<boolean> {
    if (!this.config.deviceTrust.autoLogin) return false

    const trustedDevice = await prisma.trustedDevice.findFirst({
      where: {
        userId,
        deviceFingerprint,
        lastUsed: {
          gte: new Date(Date.now() - this.config.deviceTrust.trustDuration * 24 * 60 * 60 * 1000)
        }
      }
    })

    return !!trustedDevice
  }

  // 添加受信任设备
  async addTrustedDevice(
    userId: string, 
    deviceFingerprint: string, 
    deviceName: string,
    trustLevel: number = 1
  ): Promise<void> {
    // 检查设备数量限制
    const deviceCount = await prisma.trustedDevice.count({
      where: { userId }
    })

    if (deviceCount >= this.config.deviceTrust.deviceLimit) {
      // 删除最旧的设备
      const oldestDevice = await prisma.trustedDevice.findFirst({
        where: { userId },
        orderBy: { lastUsed: 'asc' }
      })
      
      if (oldestDevice) {
        await prisma.trustedDevice.delete({
          where: { id: oldestDevice.id }
        })
      }
    }

    // 添加新设备或更新现有设备
    await prisma.trustedDevice.upsert({
      where: {
        userId_deviceFingerprint: {
          userId,
          deviceFingerprint
        }
      },
      update: {
        lastUsed: new Date(),
        trustLevel
      },
      create: {
        userId,
        deviceFingerprint,
        deviceName,
        trustLevel,
        lastUsed: new Date()
      }
    })
  }

  // 生成魔法链接
  async generateMagicLink(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15分钟过期

    // 存储魔法链接token
    await prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt
      }
    })

    const magicLink = `${process.env.NEXTAUTH_URL}/auth/magic-link?token=${token}`
    return magicLink
  }

  // 验证魔法链接
  async verifyMagicLink(token: string): Promise<{ valid: boolean; email?: string }> {
    const magicLink = await prisma.magicLink.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    })

    if (!magicLink) {
      return { valid: false }
    }

    // 删除已使用的token
    await prisma.magicLink.delete({
      where: { id: magicLink.id }
    })

    return { valid: true, email: magicLink.email }
  }

  // 发送SMS验证码
  async sendSMSCode(phone: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5分钟过期

    // 存储SMS验证码
    await prisma.smsCode.create({
      data: {
        phone,
        code,
        expiresAt
      }
    })

    // 这里应该集成真实的SMS服务
    console.log(`SMS Code for ${phone}: ${code}`)
    
    return code
  }

  // 验证SMS验证码
  async verifySMSCode(phone: string, code: string): Promise<boolean> {
    const smsCode = await prisma.smsCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: { gt: new Date() }
      }
    })

    if (!smsCode) {
      return false
    }

    // 删除已使用的验证码
    await prisma.smsCode.delete({
      where: { id: smsCode.id }
    })

    return true
  }

  // 风险评估
  async assessRisk(userId: string, context: {
    ipAddress: string
    userAgent: string
    location?: string
    timeOfDay: number
  }): Promise<{ riskScore: number; action: 'allow' | 'challenge' | 'block' }> {
    let riskScore = 0

    // 检查异常登录时间
    if (context.timeOfDay < 6 || context.timeOfDay > 23) {
      riskScore += 20
    }

    // 检查设备信任
    const deviceFingerprint = this.generateDeviceFingerprint({
      userAgent: context.userAgent,
      screen: '',
      timezone: '',
      language: '',
      platform: '',
      cookieEnabled: true,
      doNotTrack: ''
    })

    const isTrustedDevice = await this.checkDeviceTrust(userId, deviceFingerprint)
    if (!isTrustedDevice) {
      riskScore += 30
    }

    // 检查登录频率
    const recentLogins = await prisma.userActivity.count({
      where: {
        userId,
        action: 'login',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 过去1小时
        }
      }
    })

    if (recentLogins > 5) {
      riskScore += 40
    }

    // 决定行动
    let action: 'allow' | 'challenge' | 'block' = 'allow'
    if (riskScore >= 70) {
      action = 'block'
    } else if (riskScore >= 40) {
      action = 'challenge'
    }

    return { riskScore, action }
  }

  // 记录用户活动
  async logUserActivity(
    userId: string, 
    action: string, 
    details: Record<string, any> = {}
  ): Promise<void> {
    await prisma.userActivity.create({
      data: {
        userId,
        action,
        details: JSON.stringify(details),
        ipAddress: details.ipAddress || '',
        userAgent: details.userAgent || ''
      }
    })
  }
}

// 默认配置
export const defaultProgressiveAuthConfig: ProgressiveAuthConfig = {
  passwordless: {
    magicLink: true,
    smsCode: true,
    biometric: false, // 需要WebAuthn支持
    socialLogin: true
  },
  deviceTrust: {
    autoLogin: true,
    trustDuration: 30, // 30天
    deviceLimit: 5 // 最多5个设备
  },
  contextAware: {
    locationBased: true,
    timeBased: true,
    behaviorBased: true
  }
}

export const progressiveAuth = new ProgressiveAuth(defaultProgressiveAuthConfig)
