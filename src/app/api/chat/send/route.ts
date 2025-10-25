import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendMessage, generateAIResponse, analyzeIntent } from '@/lib/ai-chat'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { message, sessionId } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })
    }

    // 发送用户消息
    const userMessage = await sendMessage(sessionId || 'default', session.user.id, message, 'user')
    
    // 分析意图并生成AI响应
    const { intent, confidence, entities } = analyzeIntent(message)
    const aiResponse = generateAIResponse(intent, entities)
    
    // 发送AI响应
    const aiMessage = await sendMessage(sessionId || 'default', session.user.id, aiResponse.content, 'ai')
    
    return NextResponse.json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        intent,
        confidence,
        suggestions: aiResponse.suggestions,
        actions: aiResponse.actions
      }
    })
  } catch (error) {
    console.error('发送聊天消息失败:', error)
    return NextResponse.json(
      { error: '发送消息失败' },
      { status: 500 }
    )
  }
}
