import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 检查Sora2 API连接
    const response = await fetch('https://grsai.dakka.com.cn/v1/video/sora-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sora-2',
        prompt: 'health check',
        aspectRatio: '9:16',
        duration: 10,
        size: 'small',
        webHook: '-1',
        shutProgress: false
      })
    })

    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        sora2Api: 'connected',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        sora2Api: 'disconnected',
        error: `HTTP ${response.status}`,
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      sora2Api: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
