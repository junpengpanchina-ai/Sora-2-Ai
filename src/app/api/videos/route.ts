import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 模拟视频数据
    const videos = [
      {
        id: '1',
        title: '示例视频',
        prompt: '一只可爱的小猫在花园里玩耍',
        url: null,
        status: 'completed',
        progress: 100,
        duration: 10,
        aspectRatio: '16:9',
        size: 'small',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('获取视频列表错误:', error)
    return NextResponse.json(
      { error: '获取视频列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { title, prompt, duration, aspectRatio, size } = await request.json()

    // 模拟创建视频
    const video = {
      id: Date.now().toString(),
      title,
      prompt,
      duration,
      aspectRatio,
      size,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error('创建视频错误:', error)
    return NextResponse.json(
      { error: '创建视频失败' },
      { status: 500 }
    )
  }
}
