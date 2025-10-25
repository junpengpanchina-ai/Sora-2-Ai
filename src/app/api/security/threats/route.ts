import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getThreats, getSecurityMetrics, resolveThreat } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const [threats, metrics] = await Promise.all([
      getThreats(limit),
      getSecurityMetrics()
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        threats,
        metrics,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('获取安全威胁失败:', error)
    return NextResponse.json(
      { error: '获取安全威胁失败' },
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

    const { threatId, action } = await request.json()
    
    if (!threatId || !action) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    if (action === 'resolve') {
      await resolveThreat(threatId)
      return NextResponse.json({
        success: true,
        message: '威胁已解决'
      })
    }
    
    return NextResponse.json({ error: '无效的操作' }, { status: 400 })
  } catch (error) {
    console.error('处理安全威胁失败:', error)
    return NextResponse.json(
      { error: '处理威胁失败' },
      { status: 500 }
    )
  }
}
