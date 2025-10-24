import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { videoId, platform, timestamp } = await request.json()

    // 记录分享行为
    console.log(`用户 ${session.user.id} 在 ${platform} 分享了视频 ${videoId}`)
    
    // 这里可以存储到数据库或分析服务
    // 暂时只记录日志

    return NextResponse.json({ 
      success: true, 
      message: '分享记录成功' 
    })
  } catch (error) {
    console.error('记录分享失败:', error)
    return NextResponse.json({ error: '记录分享失败' }, { status: 500 })
  }
}
