// AI智能客服系统
import { prisma } from './prisma'

export interface ChatMessage {
  id: string
  userId: string
  content: string
  type: 'user' | 'ai' | 'system'
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: Record<string, any>
    responseTime?: number
  }
}

export interface ChatSession {
  id: string
  userId: string
  status: 'active' | 'closed' | 'transferred'
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
  summary?: string
}

export interface AIResponse {
  content: string
  intent: string
  confidence: number
  suggestions?: string[]
  actions?: Array<{
    type: 'navigate' | 'api' | 'modal'
    label: string
    data: any
  }>
}

// 意图识别
export function analyzeIntent(message: string): { intent: string; confidence: number; entities: Record<string, any> } {
  const lowerMessage = message.toLowerCase()
  
  // 问候意图
  if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return { intent: 'greeting', confidence: 0.9, entities: {} }
  }
  
  // 帮助意图
  if (lowerMessage.includes('帮助') || lowerMessage.includes('help') || lowerMessage.includes('怎么')) {
    return { intent: 'help', confidence: 0.8, entities: {} }
  }
  
  // 视频生成意图
  if (lowerMessage.includes('视频') || lowerMessage.includes('video') || lowerMessage.includes('生成')) {
    return { intent: 'video_generation', confidence: 0.85, entities: { feature: 'video_generation' } }
  }
  
  // 账户问题意图
  if (lowerMessage.includes('账户') || lowerMessage.includes('account') || lowerMessage.includes('登录')) {
    return { intent: 'account_issue', confidence: 0.8, entities: {} }
  }
  
  // 支付问题意图
  if (lowerMessage.includes('支付') || lowerMessage.includes('payment') || lowerMessage.includes('付费')) {
    return { intent: 'payment_issue', confidence: 0.85, entities: {} }
  }
  
  // 技术支持意图
  if (lowerMessage.includes('技术') || lowerMessage.includes('technical') || lowerMessage.includes('bug')) {
    return { intent: 'technical_support', confidence: 0.8, entities: {} }
  }
  
  // 默认意图
  return { intent: 'general_inquiry', confidence: 0.5, entities: {} }
}

// 生成AI响应
export function generateAIResponse(intent: string, entities: Record<string, any>, userContext?: any): AIResponse {
  const responses: Record<string, AIResponse> = {
    greeting: {
      content: '您好！我是AI助手，很高兴为您服务。请问有什么可以帮助您的吗？',
      intent: 'greeting',
      confidence: 0.9,
      suggestions: ['如何生成视频？', '查看我的账户', '联系技术支持']
    },
    
    help: {
      content: '我很乐意为您提供帮助！您可以询问关于视频生成、账户管理、支付问题等任何问题。',
      intent: 'help',
      confidence: 0.8,
      suggestions: ['视频生成教程', '账户设置', '支付方式']
    },
    
    video_generation: {
      content: '关于视频生成，我可以帮您了解如何使用我们的AI视频生成功能。您想要生成什么类型的视频呢？',
      intent: 'video_generation',
      confidence: 0.85,
      suggestions: ['生成教程', '查看示例', '开始生成'],
      actions: [{
        type: 'navigate',
        label: '开始生成视频',
        data: { url: '/generate' }
      }]
    },
    
    account_issue: {
      content: '关于账户问题，我可以帮您解决登录、注册、密码重置等问题。请告诉我具体遇到了什么问题？',
      intent: 'account_issue',
      confidence: 0.8,
      suggestions: ['重置密码', '更新个人信息', '账户安全']
    },
    
    payment_issue: {
      content: '关于支付问题，我可以帮您处理订阅、退款、发票等问题。请描述您遇到的具体问题。',
      intent: 'payment_issue',
      confidence: 0.85,
      suggestions: ['查看订阅', '联系客服', '申请退款']
    },
    
    technical_support: {
      content: '关于技术问题，我会尽力帮您解决。请详细描述您遇到的技术问题，我会为您提供解决方案。',
      intent: 'technical_support',
      confidence: 0.8,
      suggestions: ['报告问题', '查看状态', '联系工程师']
    },
    
    general_inquiry: {
      content: '我理解您的问题。请告诉我更多详细信息，我会尽力为您提供帮助。',
      intent: 'general_inquiry',
      confidence: 0.6,
      suggestions: ['重新描述问题', '查看帮助文档', '联系人工客服']
    }
  }
  
  return responses[intent] || responses.general_inquiry
}

// 创建聊天会话
export async function createChatSession(userId: string): Promise<ChatSession> {
  const session = await prisma.userActivity.create({
    data: {
      userId,
      action: 'chat_session_start',
      details: JSON.stringify({
        sessionId: `chat_${Date.now()}`,
        timestamp: new Date()
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'AI-Chat-System'
    }
  })

  return {
    id: session.id,
    userId,
    status: 'active',
    createdAt: session.createdAt,
    updatedAt: session.createdAt,
    messages: []
  }
}

// 发送消息
export async function sendMessage(
  sessionId: string,
  userId: string,
  content: string,
  type: 'user' | 'ai' | 'system' = 'user'
): Promise<ChatMessage> {
  const startTime = Date.now()
  
  // 分析用户意图
  const { intent, confidence, entities } = analyzeIntent(content)
  
  // 生成AI响应
  let aiResponse: AIResponse | null = null
  if (type === 'user') {
    aiResponse = generateAIResponse(intent, entities)
  }
  
  const responseTime = Date.now() - startTime
  
  // 创建消息记录
  const message: ChatMessage = {
    id: `msg_${Date.now()}`,
    userId,
    content,
    type,
    timestamp: new Date(),
    metadata: {
      intent,
      confidence,
      entities,
      responseTime
    }
  }
  
  // 保存到数据库
  await prisma.userActivity.create({
    data: {
      userId,
      action: 'chat_message',
      details: JSON.stringify({
        sessionId,
        message,
        aiResponse
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'AI-Chat-System'
    }
  })
  
  return message
}

// 获取聊天历史
export async function getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
  const activities = await prisma.userActivity.findMany({
    where: {
      userId,
      action: 'chat_message'
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
  
  const messages: ChatMessage[] = []
  
  for (const activity of activities) {
    try {
      const details = JSON.parse(activity.details)
      if (details.message) {
        messages.push(details.message)
      }
    } catch (error) {
      console.error('解析聊天消息失败:', error)
    }
  }
  
  return messages.reverse()
}

// 获取聊天会话
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const activity = await prisma.userActivity.findUnique({
    where: { id: sessionId }
  })
  
  if (!activity) return null
  
  const messages = await getChatHistory(activity.userId, 100)
  
  return {
    id: activity.id,
    userId: activity.userId,
    status: 'active',
    createdAt: activity.createdAt,
    updatedAt: activity.createdAt,
    messages
  }
}

// 关闭聊天会话
export async function closeChatSession(sessionId: string): Promise<void> {
  await prisma.userActivity.update({
    where: { id: sessionId },
    data: {
      action: 'chat_session_end',
      details: JSON.stringify({
        sessionId,
        timestamp: new Date()
      })
    }
  })
}

// 获取聊天统计
export async function getChatStats(userId: string): Promise<{
  totalMessages: number
  averageResponseTime: number
  mostCommonIntent: string
  satisfactionScore: number
}> {
  const activities = await prisma.userActivity.findMany({
    where: {
      userId,
      action: 'chat_message'
    }
  })
  
  const totalMessages = activities.length
  let totalResponseTime = 0
  const intentCounts: Record<string, number> = {}
  
  for (const activity of activities) {
    try {
      const details = JSON.parse(activity.details)
      if (details.message?.metadata?.responseTime) {
        totalResponseTime += details.message.metadata.responseTime
      }
      if (details.message?.metadata?.intent) {
        intentCounts[details.message.metadata.intent] = (intentCounts[details.message.metadata.intent] || 0) + 1
      }
    } catch (error) {
      console.error('解析聊天统计失败:', error)
    }
  }
  
  const averageResponseTime = totalMessages > 0 ? totalResponseTime / totalMessages : 0
  const mostCommonIntent = Object.keys(intentCounts).reduce((a, b) => intentCounts[a] > intentCounts[b] ? a : b, 'general_inquiry')
  
  return {
    totalMessages,
    averageResponseTime,
    mostCommonIntent,
    satisfactionScore: 0.8 // 这里应该基于实际反馈计算
  }
}
