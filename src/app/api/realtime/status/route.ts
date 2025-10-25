import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { realtimeManager } from '@/lib/realtime'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const stats = realtimeManager.getStats()
    const connections = realtimeManager.getAllConnections()
    const eventHistory = realtimeManager.getEventHistory(20)

    return NextResponse.json({
      success: true,
      data: {
        stats,
        connections: connections.length,
        recentEvents: eventHistory,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('获取实时状态失败:', error)
    return NextResponse.json(
      { error: '获取实时状态失败' },
      { status: 500 }
    )
  }
}
