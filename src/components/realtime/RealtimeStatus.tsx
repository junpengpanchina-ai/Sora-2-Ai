'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Card } from '@/components/ui/Card'

interface RealtimeStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  message?: string
  showDetails?: boolean
}

export function RealtimeStatus({ status, message, showDetails = false }: RealtimeStatusProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (status === 'connecting' || status === 'error') {
      setIsVisible(true)
    } else if (status === 'connected') {
      // 连接成功后短暂显示
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (!isVisible && status === 'connected') return null

  const statusConfig = {
    connected: {
      icon: 'checkCircle',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      text: '已连接',
      animation: 'pulse'
    },
    connecting: {
      icon: 'loader',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      text: '连接中...',
      animation: 'spin'
    },
    disconnected: {
      icon: 'wifiOff',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      text: '已断开',
      animation: 'none'
    },
    error: {
      icon: 'alertCircle',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      text: '连接错误',
      animation: 'bounce'
    }
  }

  const config = statusConfig[status]

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className={`p-3 ${config.bgColor} ${config.borderColor} border transition-all duration-300`}>
        <div className="flex items-center space-x-2">
          <Icon
            name={config.icon as any}
            className={`w-4 h-4 ${config.color} ${
              config.animation === 'spin' ? 'animate-spin' : 
              config.animation === 'pulse' ? 'animate-pulse' :
              config.animation === 'bounce' ? 'animate-bounce' : ''
            }`}
          />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        </div>
        
        {message && showDetails && (
          <div className="mt-2 text-xs text-gray-600">
            {message}
          </div>
        )}
      </Card>
    </div>
  )
}

// 实时数据指示器
interface RealtimeDataIndicatorProps {
  data: any
  lastUpdated: Date
  isLive: boolean
}

export function RealtimeDataIndicator({ data, lastUpdated, isLive }: RealtimeDataIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdated.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      if (seconds < 60) {
        setTimeAgo(`${seconds}秒前`)
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}分钟前`)
      } else {
        setTimeAgo(`${hours}小时前`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span>{isLive ? '实时数据' : '数据已停止更新'}</span>
      <span className="text-xs">•</span>
      <span className="text-xs">{timeAgo}</span>
    </div>
  )
}

// 实时活动指示器
interface RealtimeActivityIndicatorProps {
  activities: Array<{
    id: string
    type: 'user' | 'system' | 'ai'
    message: string
    timestamp: Date
  }>
  maxItems?: number
}

export function RealtimeActivityIndicator({ activities, maxItems = 5 }: RealtimeActivityIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const recentActivities = activities.slice(-maxItems)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return 'user'
      case 'system': return 'settings'
      case 'ai': return 'bot'
      default: return 'activity'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500'
      case 'system': return 'text-gray-500'
      case 'ai': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">实时活动</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>

        <div className="space-y-2">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-2">
              <Icon
                name={getActivityIcon(activity.type) as any}
                className={`w-3 h-3 mt-0.5 ${getActivityColor(activity.type)}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 truncate">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isExpanded && activities.length > maxItems && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              还有 {activities.length - maxItems} 个活动
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
