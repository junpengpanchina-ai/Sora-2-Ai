import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 生成邀请码
    const referralCode = generateReferralCode()
    
    // 更新用户的邀请码
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode }
    })

    return NextResponse.json({ 
      referralCode,
      shareUrl: `${process.env.NEXTAUTH_URL}/auth/signup?ref=${referralCode}`
    })
  } catch (error) {
    console.error('生成邀请码失败:', error)
    return NextResponse.json({ error: '生成邀请码失败' }, { status: 500 })
  }
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
