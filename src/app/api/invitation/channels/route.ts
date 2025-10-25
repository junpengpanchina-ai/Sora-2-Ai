import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { socialInvitation } from '@/lib/social-invitation'

export const dynamic = 'force-dynamic'

// 获取邀请渠道
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const channels = socialInvitation.getInvitationChannels()
    
    return NextResponse.json({ channels })
  } catch (error) {
    console.error('获取邀请渠道错误:', error)
    return NextResponse.json(
      { error: '获取邀请渠道失败' },
      { status: 500 }
    )
  }
}
