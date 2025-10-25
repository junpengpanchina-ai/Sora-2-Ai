import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { socialInvitation } from '@/lib/social-invitation'

export const dynamic = 'force-dynamic'

// 获取病毒式传播指标
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const metrics = await socialInvitation.getViralMetrics(session.user.id)
    
    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('获取病毒式传播指标错误:', error)
    return NextResponse.json(
      { error: '获取指标失败' },
      { status: 500 }
    )
  }
}
