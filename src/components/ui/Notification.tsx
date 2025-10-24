'use client'

import React, { useState, useEffect } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Icon } from './Icon'
import { useTranslations } from '@/hooks/useTranslations'

export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

export default function Notification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}: NotificationProps) {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 显示动画
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // 自动关闭
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200',
          bgColor: 'bg-green-50'
        }
      case 'error':
        return {
          icon: 'x-circle',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200',
          bgColor: 'bg-red-50'
        }
      case 'warning':
        return {
          icon: 'alert-triangle',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200',
          bgColor: 'bg-yellow-50'
        }
      case 'info':
        return {
          icon: 'info',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50'
        }
      default:
        return {
          icon: 'info',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50'
        }
    }
  }

  const styles = getTypeStyles()
  const resolvedTitle = title || t.notifications(type)
  const resolvedMessage = message || (type === 'error' ? `${t.errors('networkErrorDescription')} ${t.t('guidance.tryLater')}.` : '')
  const resolvedActionLabel = action?.label || t.common('ok')

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className={`p-4 border-l-4 ${styles.borderColor} ${styles.bgColor} max-w-sm`}>
        <div className="flex items-start space-x-3">
          <Icon 
            name={styles.icon as any} 
            className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} 
          />
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">{resolvedTitle}</h4>
            {resolvedMessage && (
              <p className="text-sm text-gray-600 mt-1">{resolvedMessage}</p>
            )}
            
            {action && (
              <div className="mt-3">
                <Button
                  onClick={action.onClick}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {resolvedActionLabel}
                </Button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(id), 300)
            }}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label={t.common('close')}
          >
            <Icon name="x" className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </Card>
    </div>
  )
}

// 通知管理器
export class NotificationManager {
  private notifications: NotificationProps[] = []
  private listeners: ((notifications: NotificationProps[]) => void)[] = []

  subscribe(listener: (notifications: NotificationProps[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  show(notification: Omit<NotificationProps, 'id' | 'onClose'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: this.remove.bind(this)
    }
    
    this.notifications.push(newNotification)
    this.notify()
    
    return id
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notify()
  }

  clear() {
    this.notifications = []
    this.notify()
  }
}

export const notificationManager = new NotificationManager()
