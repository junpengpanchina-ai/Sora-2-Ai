'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

interface SecurityStatusProps {
  level: 'high' | 'medium' | 'low' | 'critical'
  threats: Array<{
    id: string
    type: 'suspicious' | 'malicious' | 'warning' | 'info'
    message: string
    timestamp: Date
    resolved: boolean
  }>
  onThreatClick?: (threatId: string) => void
}

export function SecurityStatus({ level, threats, onThreatClick }: SecurityStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)

  const levelConfig = {
    high: {
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: 'shield',
      text: '安全',
      description: '系统运行正常'
    },
    medium: {
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: 'alertTriangle',
      text: '注意',
      description: '发现潜在风险'
    },
    low: {
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: 'alertCircle',
      text: '警告',
      description: '存在安全威胁'
    },
    critical: {
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: 'alertTriangle',
      text: '危险',
      description: '严重安全威胁'
    }
  }

  const config = levelConfig[level]
  const unresolvedThreats = threats.filter(t => !t.resolved)

  // 危险级别闪烁效果
  useEffect(() => {
    if (level === 'critical' || level === 'low') {
      setIsBlinking(true)
      const timer = setTimeout(() => setIsBlinking(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [level])

  return (
    <div className="fixed top-4 left-4 z-50">
      <Card className={`p-3 ${config.bgColor} ${config.borderColor} border transition-all duration-300 ${
        isBlinking ? 'animate-pulse' : ''
      }`}>
        <div className="flex items-center space-x-2">
          <Icon
            name={config.icon as any}
            className={`w-4 h-4 ${config.color}`}
          />
          <div>
            <div className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </div>
            <div className="text-xs text-gray-600">
              {config.description}
            </div>
          </div>
          {unresolvedThreats.length > 0 && (
            <div className="ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {unresolvedThreats.length} 个威胁
                <Icon name={isExpanded ? "chevronUp" : "chevronDown"} className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {isExpanded && unresolvedThreats.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-2">
              {unresolvedThreats.slice(0, 3).map((threat) => (
                <ThreatItem
                  key={threat.id}
                  threat={threat}
                  onClick={() => onThreatClick?.(threat.id)}
                />
              ))}
              {unresolvedThreats.length > 3 && (
                <div className="text-xs text-gray-500">
                  还有 {unresolvedThreats.length - 3} 个威胁...
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// 威胁项目组件
function ThreatItem({ 
  threat, 
  onClick 
}: { 
  threat: SecurityStatusProps['threats'][0]
  onClick: () => void
}) {
  const threatConfig = {
    suspicious: {
      color: 'text-yellow-600',
      icon: 'eye'
    },
    malicious: {
      color: 'text-red-600',
      icon: 'alertTriangle'
    },
    warning: {
      color: 'text-orange-600',
      icon: 'alertCircle'
    },
    info: {
      color: 'text-blue-600',
      icon: 'info'
    }
  }

  const config = threatConfig[threat.type]

  return (
    <div
      className="flex items-start space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <Icon
        name={config.icon as any}
        className={`w-3 h-3 mt-0.5 ${config.color}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 truncate">
          {threat.message}
        </p>
        <p className="text-xs text-gray-500">
          {threat.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

// 安全仪表板
interface SecurityDashboardProps {
  metrics: {
    totalThreats: number
    resolvedThreats: number
    activeThreats: number
    securityScore: number
  }
  recentActivity: Array<{
    id: string
    action: string
    timestamp: Date
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
}

export function SecurityDashboard({ metrics, recentActivity }: SecurityDashboardProps) {
  const securityScoreColor = metrics.securityScore >= 80 ? 'text-green-500' :
                            metrics.securityScore >= 60 ? 'text-yellow-500' :
                            metrics.securityScore >= 40 ? 'text-orange-500' : 'text-red-500'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {/* 安全评分 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">安全评分</p>
            <p className={`text-2xl font-bold ${securityScoreColor}`}>
              {metrics.securityScore}
            </p>
          </div>
          <Icon name="shield" className="w-8 h-8 text-gray-400" />
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                metrics.securityScore >= 80 ? 'bg-green-500' :
                metrics.securityScore >= 60 ? 'bg-yellow-500' :
                metrics.securityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.securityScore}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 威胁统计 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">总威胁数</p>
            <p className="text-2xl font-bold text-gray-900">
              {metrics.totalThreats}
            </p>
          </div>
          <Icon name="alertTriangle" className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          已解决: {metrics.resolvedThreats}
        </div>
      </Card>

      {/* 活跃威胁 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">活跃威胁</p>
            <p className="text-2xl font-bold text-red-500">
              {metrics.activeThreats}
            </p>
          </div>
          <Icon name="activity" className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          需要关注
        </div>
      </Card>

      {/* 最近活动 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">最近活动</p>
            <p className="text-2xl font-bold text-blue-500">
              {recentActivity.length}
            </p>
          </div>
          <Icon name="clock" className="w-8 h-8 text-blue-400" />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          24小时内
        </div>
      </Card>
    </div>
  )
}

// 安全警告横幅
interface SecurityAlertBannerProps {
  alert: {
    id: string
    title: string
    message: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    action?: {
      label: string
      onClick: () => void
    }
  }
  onDismiss: () => void
}

export function SecurityAlertBanner({ alert, onDismiss }: SecurityAlertBannerProps) {
  const severityConfig = {
    low: {
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'info'
    },
    medium: {
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'alertTriangle'
    },
    high: {
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      icon: 'alertCircle'
    },
    critical: {
      color: 'bg-red-50 border-red-200 text-red-800',
      icon: 'alertTriangle'
    }
  }

  const config = severityConfig[alert.severity]

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${config.color} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={config.icon as any} className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">{alert.title}</h3>
              <p className="text-sm">{alert.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {alert.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={alert.action.onClick}
                className="text-xs"
              >
                {alert.action.label}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-xs"
            >
              <Icon name="x" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
