'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { VIRAL_TRIGGERS, ViralTrigger } from '@/lib/growth-engine'

interface ViralTriggerProps {
  onTriggerAction?: (triggerId: string, action: string) => void
}

export default function ViralTriggerComponent({ onTriggerAction }: ViralTriggerProps) {
  const [triggers, setTriggers] = useState<ViralTrigger[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchTriggers()
  }, [])

  const fetchTriggers = async () => {
    try {
      const response = await fetch('/api/growth/triggers')
      const data = await response.json()
      setTriggers(data.triggers || [])
    } catch (error) {
      console.error('获取触发器失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerAction = async (triggerId: string, action: string) => {
    setActionLoading(triggerId)
    try {
      const response = await fetch('/api/growth/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerId, action })
      })
      
      const result = await response.json()
      if (result.success) {
        // 显示成功消息
        alert(result.message)
        onTriggerAction?.(triggerId, action)
      } else {
        alert(result.error || '操作失败')
      }
    } catch (error) {
      console.error('处理触发器失败:', error)
      alert('操作失败')
    } finally {
      setActionLoading(null)
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'social': return 'share'
      case 'achievement': return 'trophy'
      case 'scarcity': return 'clock'
      case 'fear': return 'alert-triangle'
      case 'surprise': return 'gift'
      default: return 'star'
    }
  }

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'social': return 'bg-blue-500'
      case 'achievement': return 'bg-yellow-500'
      case 'scarcity': return 'bg-red-500'
      case 'fear': return 'bg-orange-500'
      case 'surprise': return 'bg-purple-500'
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无触发器</h3>
        <p className="text-gray-500">继续使用平台，触发更多个性化推荐</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <Card 
          key={trigger.id} 
          className={`p-4 border-l-4 ${
            trigger.type === 'achievement' ? 'border-l-green-500 bg-green-50' :
            trigger.type === 'social' ? 'border-l-blue-500 bg-blue-50' :
            trigger.type === 'scarcity' ? 'border-l-red-500 bg-red-50' :
            trigger.type === 'fear' ? 'border-l-orange-500 bg-orange-50' :
            'border-l-purple-500 bg-purple-50'
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
