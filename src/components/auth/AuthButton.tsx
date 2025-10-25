'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useTranslations } from '@/hooks/useTranslations'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showUserInfo?: boolean
  onLogout?: () => void
}

export default function AuthButton({ 
  variant = 'outline', 
  size = 'md',
  className = '',
  showUserInfo = false,
  onLogout
}: AuthButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations()

  const handleAuthAction = async () => {
    if (session) {
      // 用户已登录，执行退出操作
      try {
        console.log('🔐 智能按钮开始登出...')
        const result = await signOut({ redirect: false })
        console.log('✅ 智能按钮登出结果:', result)
        
        // 执行自定义退出回调
        if (onLogout) {
          onLogout()
        }
        
        // 跳转到首页
        router.push('/')
      } catch (error) {
        console.error('❌ 智能按钮退出失败:', error)
        // 即使出错也尝试跳转到首页
        router.push('/')
      }
    } else {
      // 用户未登录，跳转到登录页面
      router.push('/auth/signin')
    }
  }

  const getButtonText = () => {
    if (status === 'loading') {
      return t.common('loading') || 'Loading...'
    }
    
    if (session) {
      return t.common('logout') || 'Logout'
    }
    
    return t.common('login') || 'Login'
  }

  const getButtonVariant = () => {
    if (session) {
      return 'outline' // 退出按钮使用outline样式
    }
    return variant // 登录按钮使用传入的样式
  }

  return (
    <div className="flex items-center space-x-2">
      {showUserInfo && session && (
        <span className="text-sm text-gray-700">
          {session.user?.name || session.user?.email}
        </span>
      )}
      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleAuthAction}
        className={className}
        disabled={status === 'loading'}
      >
        {getButtonText()}
      </Button>
    </div>
  )
}
