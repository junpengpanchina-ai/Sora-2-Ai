// 实时功能系统
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

export interface RealtimeEvent {
  id: string
  type: 'user_activity' | 'system_status' | 'data_update' | 'notification'
  data: any
  timestamp: Date
  userId?: string
}

export interface RealtimeStatus {
  connected: boolean
  lastPing: Date
  connectionId: string
  userId?: string
}

class RealtimeManager {
  private io: SocketIOServer | null = null
  private connections: Map<string, RealtimeStatus> = new Map()
  private eventHistory: RealtimeEvent[] = []

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.io.on('connection', (socket) => {
      console.log(`用户连接: ${socket.id}`)
      
      this.connections.set(socket.id, {
        connected: true,
        lastPing: new Date(),
        connectionId: socket.id
      })

      // 处理用户认证
      socket.on('authenticate', (data) => {
        if (data.userId) {
          const status = this.connections.get(socket.id)
          if (status) {
            status.userId = data.userId
            this.connections.set(socket.id, status)
          }
        }
      })

      // 处理心跳
      socket.on('ping', () => {
        const status = this.connections.get(socket.id)
        if (status) {
          status.lastPing = new Date()
          this.connections.set(socket.id, status)
        }
        socket.emit('pong')
      })

      // 处理断开连接
      socket.on('disconnect', () => {
        console.log(`用户断开连接: ${socket.id}`)
        this.connections.delete(socket.id)
      })

      // 处理实时数据请求
      socket.on('subscribe_data', (data) => {
        socket.join(`data_${data.type}`)
        console.log(`用户订阅数据: ${data.type}`)
      })

      // 处理取消订阅
      socket.on('unsubscribe_data', (data) => {
        socket.leave(`data_${data.type}`)
        console.log(`用户取消订阅: ${data.type}`)
      })
    })

    // 定期清理过期连接
    setInterval(() => {
      this.cleanupExpiredConnections()
    }, 30000) // 30秒清理一次
  }

  // 广播事件到所有连接
  broadcast(event: RealtimeEvent) {
    if (!this.io) return

    this.eventHistory.push(event)
    
    // 限制历史记录大小
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-500)
    }

    this.io.emit('realtime_event', event)
  }

  // 发送事件到特定用户
  sendToUser(userId: string, event: RealtimeEvent) {
    if (!this.io) return

    this.eventHistory.push(event)
    
    // 找到用户的连接
    for (const [connectionId, status] of this.connections) {
      if (status.userId === userId) {
        this.io.to(connectionId).emit('realtime_event', event)
        break
      }
    }
  }

  // 发送事件到特定房间
  sendToRoom(room: string, event: RealtimeEvent) {
    if (!this.io) return

    this.eventHistory.push(event)
    this.io.to(room).emit('realtime_event', event)
  }

  // 获取连接状态
  getConnectionStatus(connectionId: string): RealtimeStatus | null {
    return this.connections.get(connectionId) || null
  }

  // 获取所有连接
  getAllConnections(): RealtimeStatus[] {
    return Array.from(this.connections.values())
  }

  // 获取事件历史
  getEventHistory(limit: number = 50): RealtimeEvent[] {
    return this.eventHistory.slice(-limit)
  }

  // 清理过期连接
  private cleanupExpiredConnections() {
    const now = new Date()
    const timeout = 5 * 60 * 1000 // 5分钟超时

    for (const [connectionId, status] of this.connections) {
      if (now.getTime() - status.lastPing.getTime() > timeout) {
        console.log(`清理过期连接: ${connectionId}`)
        this.connections.delete(connectionId)
      }
    }
  }

  // 获取统计信息
  getStats() {
    const totalConnections = this.connections.size
    const activeConnections = Array.from(this.connections.values()).filter(
      status => new Date().getTime() - status.lastPing.getTime() < 60000
    ).length

    return {
      totalConnections,
      activeConnections,
      eventHistorySize: this.eventHistory.length,
      uptime: process.uptime()
    }
  }
}

// 单例实例
export const realtimeManager = new RealtimeManager()

// 实时数据生成器
export class RealtimeDataGenerator {
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.generateData()
    }, 5000) // 每5秒生成一次数据
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }

  private generateData() {
    // 生成系统状态数据
    const systemStatus = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100
    }

    realtimeManager.broadcast({
      id: `system_${Date.now()}`,
      type: 'system_status',
      data: systemStatus,
      timestamp: new Date()
    })

    // 生成用户活动数据
    const userActivity = {
      activeUsers: realtimeManager.getAllConnections().length,
      newUsers: Math.floor(Math.random() * 5),
      totalSessions: Math.floor(Math.random() * 100)
    }

    realtimeManager.broadcast({
      id: `activity_${Date.now()}`,
      type: 'user_activity',
      data: userActivity,
      timestamp: new Date()
    })

    // 生成数据更新
    const dataUpdate = {
      value: Math.random() * 100,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: (Math.random() - 0.5) * 20
    }

    realtimeManager.sendToRoom('data_metrics', {
      id: `data_${Date.now()}`,
      type: 'data_update',
      data: dataUpdate,
      timestamp: new Date()
    })
  }
}

// 实时数据生成器实例
export const dataGenerator = new RealtimeDataGenerator()
