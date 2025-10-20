import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      )
    }

    const { prompt, aspectRatio = '16:9', size = 'large' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { message: '请输入视频描述' },
        { status: 400 }
      )
    }

    // 检查用户剩余视频数
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    if (user.freeVideosLeft <= 0 && user.subscriptionPlan === 'free') {
      return NextResponse.json(
        { message: '免费视频次数已用完，请升级套餐' },
        { status: 403 }
      )
    }

    // 创建视频记录
    const video = await prisma.video.create({
      data: {
        title: prompt.substring(0, 50),
        prompt,
        aspectRatio,
        size,
        status: 'pending',
        progress: 0,
        userId: session.user.id
      }
    })

    // 减少用户免费视频数
    if (user.subscriptionPlan === 'free') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          freeVideosLeft: { decrement: 1 }
        }
      })
    }

    // 模拟视频生成过程
    setTimeout(async () => {
      try {
        // 更新进度
        await prisma.video.update({
          where: { id: video.id },
          data: { progress: 25 }
        })

        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await prisma.video.update({
          where: { id: video.id },
          data: { progress: 50 }
        })

        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await prisma.video.update({
          where: { id: video.id },
          data: { 
            progress: 100,
            status: 'completed',
            url: `https://example.com/videos/${video.id}.mp4`,
            duration: 15
          }
        })
      } catch (error) {
        console.error('视频生成错误:', error)
        await prisma.video.update({
          where: { id: video.id },
          data: { 
            status: 'failed',
            progress: 0
          }
        })
      }
    }, 1000)

    return NextResponse.json({
      message: '视频生成已开始',
      video: {
        id: video.id,
        status: video.status,
        progress: video.progress
      }
    })

  } catch (error) {
    console.error('视频生成错误:', error)
    return NextResponse.json(
      { message: '视频生成失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (videoId) {
      // 获取单个视频
      const video = await prisma.video.findFirst({
        where: {
          id: videoId,
          userId: session.user.id
        }
      })

      if (!video) {
        return NextResponse.json(
          { message: '视频不存在' },
          { status: 404 }
        )
      }

      return NextResponse.json({ video })
    } else {
      // 获取用户所有视频
      const videos = await prisma.video.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ videos })
    }

  } catch (error) {
    console.error('获取视频错误:', error)
    return NextResponse.json(
      { message: '获取视频失败' },
      { status: 500 }
    )
  }
}