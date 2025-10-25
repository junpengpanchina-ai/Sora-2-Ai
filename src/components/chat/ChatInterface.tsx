'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'

interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (message: string) => void
  messages: Message[]
  isTyping: boolean
  placeholder?: string
}

export function ChatInterface({
  isOpen,
  onClose,
  onSendMessage,
  messages,
  isTyping,
  placeholder = "输入您的问题..."
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      />
      
      {/* 聊天窗口 */}
      <Card className="relative w-full max-w-md h-96 flex flex-col bg-white shadow-xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Icon name="bot" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI助手</h3>
              <p className="text-xs text-gray-500">在线</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="x" className="w-4 h-4" />
          </Button>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* 输入中指示器 */}
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="bot" className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
            >
              <Icon name="send" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// 消息气泡组件
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user'
  const isSystem = message.type === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gray-100'
        }`}>
          <Icon
            name={isUser ? 'user' : 'bot'}
            className={`w-4 h-4 ${isUser ? 'text-white' : 'text-gray-600'}`}
          />
        </div>

        {/* 消息内容 */}
        <div className={`rounded-lg px-3 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// 聊天按钮
interface ChatButtonProps {
  onClick: () => void
  unreadCount?: number
}

export function ChatButton({ onClick, unreadCount = 0 }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg z-40"
    >
      <div className="relative">
        <Icon name="messageCircle" className="w-6 h-6" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    </Button>
  )
}

// 快速回复按钮
interface QuickRepliesProps {
  replies: string[]
  onSelect: (reply: string) => void
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(reply)}
          className="text-xs"
        >
          {reply}
        </Button>
      ))}
    </div>
  )
}
