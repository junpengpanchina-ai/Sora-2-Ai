// 邀请码管理系统
import { prisma } from './prisma'

export interface InviteCode {
  id: string
  code: string
  createdBy: string
  usedBy?: string
  usedAt?: Date
  expiresAt: Date
  isActive: boolean
}

// 生成邀请码
export async function generateInviteCode(userId: string, expiresInDays: number = 30): Promise<string> {
  const code = generateRandomCode()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  await prisma.inviteCode.create({
    data: {
      code,
      createdBy: userId,
      expiresAt,
      isActive: true
    }
  })

  return code
}

// 验证邀请码
export async function validateInviteCode(code: string): Promise<{ valid: boolean; message?: string }> {
  const inviteCode = await prisma.inviteCode.findUnique({
    where: { code }
  })

  if (!inviteCode) {
    return { valid: false, message: '邀请码不存在' }
  }

  if (!inviteCode.isActive) {
    return { valid: false, message: '邀请码已被禁用' }
  }

  if (inviteCode.usedBy) {
    return { valid: false, message: '邀请码已被使用' }
  }

  if (inviteCode.expiresAt < new Date()) {
    return { valid: false, message: '邀请码已过期' }
  }

  return { valid: true }
}

// 使用邀请码
export async function useInviteCode(code: string, userId: string): Promise<{ success: boolean; message?: string }> {
  const validation = await validateInviteCode(code)
  
  if (!validation.valid) {
    return { success: false, message: validation.message }
  }

  try {
    await prisma.inviteCode.update({
      where: { code },
      data: {
        usedBy: userId,
        usedAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    return { success: false, message: '使用邀请码失败' }
  }
}

// 获取用户的邀请码
export async function getUserInviteCodes(userId: string): Promise<InviteCode[]> {
  return await prisma.inviteCode.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: 'desc' }
  })
}

// 生成随机邀请码
function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 检查用户是否可以生成邀请码
export async function canGenerateInviteCode(userId: string): Promise<boolean> {
  // 检查用户是否有付费订阅
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscriptions: true }
  })

  if (!user) return false

  // 有付费订阅的用户可以生成邀请码
  const hasActiveSubscription = user.subscriptions.some(sub => 
    sub.status === 'active' && new Date(sub.currentPeriodEnd) > new Date()
  )

  return hasActiveSubscription
}
