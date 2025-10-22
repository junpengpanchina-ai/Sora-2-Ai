import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SoraAPI } from '@/lib/sora-api'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      )
    }

    const { 
      prompt, 
      aspectRatio = '16:9', 
      size = 'medium',
      style = 'realistic',
      motion = 'medium',
      duration = 15
    } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { message: '请输入视频描述' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    // 移除免费视频次数限制 - 允许无限制生成

    // 创建视频记录
    const video = await prisma.video.create({
      data: {
        title: prompt.substring(0, 50),
        prompt,
        aspectRatio,
        size,
        duration,
        style,
        motion,
        status: 'pending',
        progress: 0,
        userId: session.user.id
      }
    })

    // 移除免费视频次数扣减 - 允许无限制生成

    // 调用真正的 Sora API
    const soraAPI = new SoraAPI()
    
    try {
      // 调用 Sora API 生成视频
      const apiResponse = await soraAPI.generateVideo({
        prompt,
        aspectRatio: aspectRatio as '9:16' | '16:9',
        duration: duration as 10 | 15,
        size: size as 'small' | 'large'
      })

      if (apiResponse.code === 0 && apiResponse.data?.id) {
        // 更新视频记录，保存 API 返回的任务 ID
        await prisma.video.update({
          where: { id: video.id },
          data: { 
            status: 'processing',
            progress: 10,
            externalId: apiResponse.data.id // 保存外部 API 的任务 ID
          }
        })

        // 开始轮询结果
        soraAPI.pollResult(apiResponse.data.id, async (result) => {
          try {
            await prisma.video.update({
              where: { id: video.id },
              data: {
                progress: result.progress,
                status: result.status === 'succeeded' ? 'completed' : 
                       result.status === 'failed' ? 'failed' : 'processing',
                url: result.results?.[0]?.url || null,
                duration: duration
              }
            })
          } catch (error) {
            console.error('更新视频状态错误:', error)
          }
        }).then(async (finalResult) => {
          try {
            await prisma.video.update({
              where: { id: video.id },
              data: {
                progress: finalResult.progress,
                status: finalResult.status === 'succeeded' ? 'completed' : 'failed',
                url: finalResult.results?.[0]?.url || null,
                duration: duration,
                error: finalResult.error || finalResult.failure_reason || null
              }
            })
          } catch (error) {
            console.error('最终更新视频状态错误:', error)
          }
        })
      } else {
        // API 调用失败
        await prisma.video.update({
          where: { id: video.id },
          data: { 
            status: 'failed',
            progress: 0,
            error: apiResponse.msg || 'API 调用失败'
          }
        })
      }
    } catch (error) {
      console.error('Sora API 调用错误:', error)
      await prisma.video.update({
        where: { id: video.id },
        data: { 
          status: 'failed',
          progress: 0,
          error: `API 调用失败: ${error instanceof Error ? error.message : '未知错误'}`
        }
      })
    }

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