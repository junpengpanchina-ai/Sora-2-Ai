'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

interface InvitationChannel {
  id: string
  name: string
  icon: string
  enabled: boolean
  template: string
  shareUrl?: string
}

interface ContactSuggestion {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  relationship: string
  inviteProbability: number
  lastContact?: string
}

interface ViralMetrics {
  totalInvites: number
  successfulInvites: number
  conversionRate: number
  viralCoefficient: number
  socialShares: number
  leaderboardPosition: number
}

export default function SocialInvitation() {
  const [channels, setChannels] = useState<InvitationChannel[]>([])
  const [suggestions, setSuggestions] = useState<ContactSuggestion[]>([])
  const [metrics, setMetrics] = useState<ViralMetrics | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 加载数据
  useEffect(() => {
    loadChannels()
    loadSuggestions()
    loadMetrics()
  }, [])

  const loadChannels = async () => {
    try {
      const response = await fetch('/api/invitation/channels')
      if (response.ok) {
        const data = await response.json()
        setChannels(data.channels || [])
        if (data.channels.length > 0) {
          setSelectedChannel(data.channels[0].id)
        }
      }
    } catch (error) {
      console.error('加载邀请渠道错误:', error)
    }
  }

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/invitation/suggestions')
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('加载联系人推荐错误:', error)
    }
  }

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/invitation/metrics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
      }
    } catch (error) {
      console.error('加载指标错误:', error)
    }
  }

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSendInvitation = async () => {
    if (!selectedChannel || selectedContacts.length === 0) {
      setError('请选择邀请渠道和至少一个联系人')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/invitation/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedChannel,
          recipients: selectedContacts,
          message: customMessage,
          personalized: true
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`邀请发送成功！发送了${data.result.sent}个邀请`)
        setSelectedContacts([])
        setCustomMessage('')
        loadMetrics() // 刷新指标
      } else {
        setError(data.error || '发送邀请失败')
      }
    } catch (error) {
      setError('发送邀请失败')
    } finally {
      setIsLoading(false)
    }
  }

  const getChannelIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'mail': 'mail',
      'phone': 'phone',
      'facebook': 'facebook',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
      'message-circle': 'message-circle',
      'qr-code': 'qr-code',
      'link': 'link'
    }
    return iconMap[iconName] || 'share'
  }

  return (
    <div className="space-y-6">
      {/* 病毒式传播指标 */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalInvites}</div>
            <div className="text-sm text-gray-600">总邀请数</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.successfulInvites}</div>
            <div className="text-sm text-gray-600">成功邀请</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(metrics.conversionRate * 100)}%
            </div>
            <div className="text-sm text-gray-600">转化率</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              #{metrics.leaderboardPosition}
            </div>
            <div className="text-sm text-gray-600">排行榜</div>
          </Card>
        </div>
      )}

      {/* 邀请渠道选择 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">选择邀请方式</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                selectedChannel === channel.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon name={getChannelIcon(channel.icon)} className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{channel.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 智能联系人推荐 */}
      {suggestions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">智能推荐联系人</h3>
          <div className="space-y-3">
            {suggestions.map((contact) => (
              <label
                key={contact.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedContacts.includes(contact.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleContactToggle(contact.id)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-600">
                    {contact.email || contact.phone} • {contact.relationship}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-600">
                      邀请概率: {Math.round(contact.inviteProbability * 100)}%
                    </span>
                    {contact.lastContact && (
                      <span className="text-xs text-gray-500">
                        上次联系: {new Date(contact.lastContact).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* 自定义消息 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">自定义邀请消息</h3>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="输入您的邀请消息（可选，系统会生成个性化消息）"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={4}
        />
        <p className="text-sm text-gray-600 mt-2">
          留空将使用系统生成的个性化消息
        </p>
      </Card>

      {/* 错误和成功消息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* 发送按钮 */}
      <Button
        onClick={handleSendInvitation}
        disabled={isLoading || !selectedChannel || selectedContacts.length === 0}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
            发送中...
          </>
        ) : (
          <>
            <Icon name="send" className="w-5 h-5 mr-2" />
            发送邀请 ({selectedContacts.length} 个联系人)
          </>
        )}
      </Button>

      {/* 病毒式传播提示 */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start space-x-3">
          <Icon name="zap" className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900">病毒式传播技巧</h4>
            <ul className="text-sm text-purple-700 mt-2 space-y-1">
              <li>• 选择最佳邀请时间（工作日晚上7-9点）</li>
              <li>• 使用个性化消息提高转化率</li>
              <li>• 分享到社交媒体获得更多曝光</li>
              <li>• 邀请朋友的朋友，扩大传播范围</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
