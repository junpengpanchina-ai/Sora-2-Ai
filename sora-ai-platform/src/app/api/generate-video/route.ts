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

    const { prompt, url, aspectRatio, duration, size } = await request.json()

    // 验证必填参数
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ 
        error: '提示词不能为空' 
      }, { status: 400 })
    }

    // 验证参数值
    const validAspectRatios = ['9:16', '16:9']
    const validDurations = [10, 15]
    const validSizes = ['small', 'large']

    if (aspectRatio && !validAspectRatios.includes(aspectRatio)) {
      return NextResponse.json({ 
        error: '不支持的视频比例' 
      }, { status: 400 })
    }

    if (duration && !validDurations.includes(duration)) {
      return NextResponse.json({ 
        error: '不支持的视频时长' 
      }, { status: 400 })
    }

    if (size && !validSizes.includes(size)) {
      return NextResponse.json({ 
        error: '不支持的视频质量' 
      }, { status: 400 })
    }

    // 调用Sora2 API生成视频
    const soraAPI = new SoraAPI()
    const response = await soraAPI.generateVideo({
      prompt,
      url,
      aspectRatio: aspectRatio || '9:16',
      duration: duration || 10,
      size: size || 'small'
    })

    if (response.code === 0 && response.data?.id) {
      return NextResponse.json({
        success: true,
        data: {
          id: response.data.id,
          message: '视频生成任务已创建'
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: response.msg || '视频生成失败'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('生成视频错误:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '生成视频失败: ' + (error instanceof Error ? error.message : '未知错误')
      },
      { status: 500 }
    )
  }
}
