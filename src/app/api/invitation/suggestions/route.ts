import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { socialInvitation } from '@/lib/social-invitation'

export const dynamic = 'force-dynamic'

// 获取联系人推荐
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const suggestions = await socialInvitation.getContactSuggestions(session.user.id)
    
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('获取联系人推荐错误:', error)
    return NextResponse.json(
      { error: '获取联系人推荐失败' },
      { status: 500 }
    )
  }
}
