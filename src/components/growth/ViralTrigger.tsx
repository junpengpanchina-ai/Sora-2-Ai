'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { viralEngine, ViralEvent } from '@/lib/viral-engine'
import { useTranslations } from '@/hooks/useTranslations'

interface ViralTriggerProps {
  onTriggerAction?: (triggerId: string, action: string) => void
}

export default function ViralTriggerComponent({ onTriggerAction }: ViralTriggerProps) {
  const t = useTranslations()
  const [triggers, setTriggers] = useState<ViralEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    totalVideos: 15,
    monthlyVideos: 8,
    socialShares: 12,
    referralCount: 3,
    totalLikes: 156,
    streakDays: 5
  })

  useEffect(() => {
    fetchTriggers()
  }, [])

  const fetchTriggers = async () => {
    try {
      // 使用病毒式传播引擎获取个性化事件
      const personalizedTriggers = viralEngine.getPersonalizedEvents('user123', userStats)
      setTriggers(personalizedTriggers)
    } catch (error) {
      console.error('获取触发器失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerAction = async (triggerId: string, action: string) => {
    setActionLoading(triggerId)
    try {
      // 使用病毒式传播引擎处理事件
      const result = await viralEngine.processViralEvent(triggerId, 'user123', action)
      
      if (result.success) {
        // 显示成功消息
        alert(result.message)
        onTriggerAction?.(triggerId, action)
        
        // 刷新触发器列表
        fetchTriggers()
      } else {
        alert(t.notifications('errorOccurred'))
      }
    } catch (error) {
      console.error('处理触发器失败:', error)
      alert(t.notifications('errorOccurred'))
    } finally {
      setActionLoading(null)
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'social_currency': return 'share'
      case 'trigger': return 'zap'
      case 'emotion': return 'heart'
      case 'public': return 'eye'
      case 'practical': return 'tool'
      case 'story': return 'book-open'
      default: return 'star'
    }
  }

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'social_currency': return 'bg-blue-500'
      case 'trigger': return 'bg-yellow-500'
      case 'emotion': return 'bg-pink-500'
      case 'public': return 'bg-green-500'
      case 'practical': return 'bg-purple-500'
      case 'story': return 'bg-indigo-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (triggers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="zap" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.notifications('info')}</h3>
        <p className="text-gray-500">{t.mvp('personalizedRecommendations')}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <Card 
          key={trigger.id} 
          className={`p-4 border-l-4 ${
            trigger.type === 'social_currency' ? 'border-l-blue-500 bg-blue-50' :
            trigger.type === 'trigger' ? 'border-l-yellow-500 bg-yellow-50' :
            trigger.type === 'emotion' ? 'border-l-pink-500 bg-pink-50' :
            trigger.type === 'public' ? 'border-l-green-500 bg-green-50' :
            trigger.type === 'practical' ? 'border-l-purple-500 bg-purple-50' :
            'border-l-indigo-500 bg-indigo-50'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full ${getTriggerColor(trigger.type)} flex items-center justify-center flex-shrink-0`}>
              <Icon name={getTriggerIcon(trigger.type) as any} className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {trigger.title}
              </h3>
              <p className="text-gray-600 mb-3">
                {trigger.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="gift" className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    {trigger.reward}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleTriggerAction(trigger.id, 'action')}
                  loading={actionLoading === trigger.id}
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  {trigger.action}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
