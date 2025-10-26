'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ThemeSelector } from '@/components/theme/ThemeSelector'
import { RealtimeStatus, RealtimeDataIndicator, RealtimeActivityIndicator } from '@/components/realtime/RealtimeStatus'
import { ChatInterface, ChatButton, QuickReplies } from '@/components/chat/ChatInterface'
import { SecurityStatus, SecurityDashboard, SecurityAlertBanner } from '@/components/security/SecurityStatus'
import { useAITheme } from '@/components/theme/AIThemeProvider'

export default function DemoPage() {
  const { currentTheme } = useAITheme()
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('connected')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'ai' | 'user';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'ai' as const,
      content: '您好！我是AI助手，有什么可以帮助您的吗？',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<'high' | 'medium' | 'low' | 'critical'>('high')
  const [showSecurityAlert, setShowSecurityAlert] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])
  const [securityThreats, setSecurityThreats] = useState<any[]>([])
  const [securityMetrics, setSecurityMetrics] = useState<any>(null)

  // 模拟实时数据
  const [realtimeData, setRealtimeData] = useState({
    value: Math.random() * 100,
    lastUpdated: new Date(),
    isLive: true
  })

  // 模拟活动数据
  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'user' as const,
      message: '用户登录系统',
      timestamp: new Date(Date.now() - 1000 * 60 * 2)
    },
    {
      id: '2',
      type: 'ai' as const,
      message: 'AI处理视频生成请求',
      timestamp: new Date(Date.now() - 1000 * 60 * 1)
    },
    {
      id: '3',
      type: 'system' as const,
      message: '系统更新完成',
      timestamp: new Date(Date.now() - 1000 * 30)
    }
  ])

  // 模拟威胁数据
  const [threats, setThreats] = useState([
    {
      id: '1',
      type: 'suspicious' as const,
      message: '检测到异常登录尝试',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      resolved: false
    },
    {
      id: '2',
      type: 'warning' as const,
      message: '密码强度不足',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      resolved: true
    }
  ])

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        value: Math.random() * 100,
        lastUpdated: new Date(),
        isLive: true
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 加载AI推荐
  useEffect(() => {
    const loadAIRecommendations = async () => {
      try {
        const response = await fetch('/api/ai/recommendations')
        if (response.ok) {
          const data = await response.json()
          setAiRecommendations(data.recommendations || [])
        }
      } catch (error) {
        console.error('加载AI推荐失败:', error)
      }
    }

    loadAIRecommendations()
  }, [])

  // 加载安全数据
  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        const response = await fetch('/api/security/threats')
        if (response.ok) {
          const data = await response.json()
          setSecurityThreats(data.data?.threats || [])
          setSecurityMetrics(data.data?.metrics || null)
        }
      } catch (error) {
        console.error('加载安全数据失败:', error)
      }
    }

    loadSecurityData()
  }, [])

  // 处理聊天消息
  const handleSendMessage = (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: '感谢您的消息！我正在处理您的请求...',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  // 快速回复
  const quickReplies = [
    '如何生成视频？',
    '查看我的账户',
    '联系客服',
    '系统帮助'
  ]

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  // 安全指标
  const currentSecurityMetrics = {
    totalThreats: threats.length,
    resolvedThreats: threats.filter(t => t.resolved).length,
    activeThreats: threats.filter(t => !t.resolved).length,
    securityScore: 85
  }

  const recentActivity = [
    {
      id: '1',
      action: '用户登录',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      severity: 'low' as const
    },
    {
      id: '2',
      action: '文件上传',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      severity: 'medium' as const
    },
    {
      id: '3',
      action: '系统扫描',
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      severity: 'high' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Day 2 样式优化演示
          </h1>
          <p className="text-lg text-gray-600">
            展示AI个性化主题、实时功能、智能客服和安全防护样式
          </p>
        </div>

        {/* 1. AI个性化主题 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="palette" className="w-5 h-5 mr-2" />
            AI个性化主题系统
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">当前主题:</span>
              <span className="font-medium">{currentTheme.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">主题选择器:</span>
              <ThemeSelector />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">专业商务</div>
                <div className="text-xs text-blue-600">简洁专业，适合商务办公</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-800">创意艺术</div>
                <div className="text-xs text-purple-600">色彩丰富，激发创意灵感</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800">科技未来</div>
                <div className="text-xs text-green-600">科技感十足，未来风格</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-800">温暖舒适</div>
                <div className="text-xs text-orange-600">温暖舒适，放松身心</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. 实时功能样式 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="activity" className="w-5 h-5 mr-2" />
            实时功能样式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">连接状态</h3>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => setRealtimeStatus('connected')}
                  variant={realtimeStatus === 'connected' ? 'primary' : 'outline'}
                >
                  已连接
                </Button>
                <Button
                  size="sm"
                  onClick={() => setRealtimeStatus('connecting')}
                  variant={realtimeStatus === 'connecting' ? 'primary' : 'outline'}
                >
                  连接中
                </Button>
                <Button
                  size="sm"
                  onClick={() => setRealtimeStatus('error')}
                  variant={realtimeStatus === 'error' ? 'primary' : 'outline'}
                >
                  错误
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">实时数据</h3>
              <RealtimeDataIndicator
                data={realtimeData}
                lastUpdated={realtimeData.lastUpdated}
                isLive={realtimeData.isLive}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">活动指示器</h3>
              <Button
                size="sm"
                onClick={() => setActivities(prev => [...prev, {
                  id: Date.now().toString(),
                  type: 'system',
                  message: '新活动已添加',
                  timestamp: new Date()
                }])}
              >
                添加活动
              </Button>
            </div>
          </div>
        </Card>

        {/* 3. 智能客服样式 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="messageCircle" className="w-5 h-5 mr-2" />
            智能客服样式
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsChatOpen(true)}>
                打开聊天界面
              </Button>
              <span className="text-sm text-gray-600">
                消息数: {chatMessages.length}
              </span>
            </div>
            <div>
              <h3 className="font-medium mb-2">快速回复</h3>
              <QuickReplies
                replies={quickReplies}
                onSelect={handleQuickReply}
              />
            </div>
          </div>
        </Card>

        {/* 4. 安全防护样式 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="shield" className="w-5 h-5 mr-2" />
            安全防护样式
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                onClick={() => setSecurityLevel('high')}
                variant={securityLevel === 'high' ? 'primary' : 'outline'}
              >
                安全
              </Button>
              <Button
                size="sm"
                onClick={() => setSecurityLevel('medium')}
                variant={securityLevel === 'medium' ? 'primary' : 'outline'}
              >
                注意
              </Button>
              <Button
                size="sm"
                onClick={() => setSecurityLevel('low')}
                variant={securityLevel === 'low' ? 'primary' : 'outline'}
              >
                警告
              </Button>
              <Button
                size="sm"
                onClick={() => setSecurityLevel('critical')}
                variant={securityLevel === 'critical' ? 'primary' : 'outline'}
              >
                危险
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                onClick={() => setShowSecurityAlert(!showSecurityAlert)}
              >
                {showSecurityAlert ? '隐藏' : '显示'}安全警告
              </Button>
            </div>
          </div>
        </Card>

        {/* AI推荐系统 */}
        {aiRecommendations.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Icon name="sparkles" className="w-5 h-5 mr-2" />
              AI智能推荐
            </h2>
            <div className="space-y-3">
              {aiRecommendations.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-900">{recommendation.title}</h3>
                      <p className="text-sm text-blue-700 mt-1">{recommendation.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs text-blue-600">
                          置信度: {Math.round(recommendation.confidence * 100)}%
                        </span>
                        <span className="text-xs text-blue-600">
                          类型: {recommendation.type}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 安全仪表板 */}
        <SecurityDashboard
          metrics={currentSecurityMetrics}
          recentActivity={recentActivity}
        />
      </div>

      {/* 实时状态指示器 */}
      <RealtimeStatus
        status={realtimeStatus}
        message="系统运行正常"
        showDetails={true}
      />

      {/* 实时活动指示器 */}
      <RealtimeActivityIndicator
        activities={activities}
        maxItems={3}
      />

      {/* 聊天界面 */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSendMessage={handleSendMessage}
        messages={chatMessages}
        isTyping={isTyping}
      />

      {/* 聊天按钮 */}
      <ChatButton
        onClick={() => setIsChatOpen(true)}
        unreadCount={0}
      />

      {/* 安全状态指示器 */}
      <SecurityStatus
        level={securityLevel}
        threats={threats}
        onThreatClick={(threatId) => console.log('Threat clicked:', threatId)}
      />

      {/* 安全警告横幅 */}
      {showSecurityAlert && (
        <SecurityAlertBanner
          alert={{
            id: '1',
            title: '安全警告',
            message: '检测到可疑活动，请立即检查您的账户安全设置。',
            severity: 'high',
            action: {
              label: '立即检查',
              onClick: () => console.log('Security check clicked')
            }
          }}
          onDismiss={() => setShowSecurityAlert(false)}
        />
      )}
    </div>
  )
}
