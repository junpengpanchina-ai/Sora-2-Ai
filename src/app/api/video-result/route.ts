import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SoraAPI } from '@/lib/sora-api'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ 
        error: '任务ID不能为空' 
      }, { status: 400 })
    }

    // 调用Sora2 API获取结果
    const soraAPI = new SoraAPI()
    const result = await soraAPI.getResult(id)

    // 根据结果状态返回相应的响应
    if (result.status === 'failed') {
      return NextResponse.json({
        success: false,
        error: result.error || '获取结果失败',
        data: result
      })
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('获取视频结果错误:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '获取视频结果失败: ' + (error instanceof Error ? error.message : '未知错误')
      },
      { status: 500 }
    )
  }
}
