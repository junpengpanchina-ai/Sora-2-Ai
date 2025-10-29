'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { useTranslations } from '@/hooks/useTranslations'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'

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
  const { user, loading, logout } = useSimpleAuth()
  const router = useRouter()
  const t = useTranslations()

  const handleAuthAction = async () => {
    if (user) {
      // 用户已登录，执行退出操作
      try {
        console.log('🔐 智能按钮开始登出...')
        
        // 先尝试 NextAuth signOut（用于 Google OAuth 登录）
        try {
          await signOut({ redirect: false, callbackUrl: '/' })
          console.log('✅ NextAuth 登出成功')
        } catch (nextAuthError) {
          console.log('⚠️ NextAuth 登出失败或未使用 NextAuth:', nextAuthError)
        }
        
        // 再调用 simple-auth logout（用于其他登录方式）
        const result = await logout()
        console.log('✅ Simple Auth 登出结果:', result)
        
        // 执行自定义退出回调
        if (onLogout) {
          onLogout()
        }
        
        // 强制刷新页面以确保状态更新
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      } catch (error) {
        console.error('❌ 智能按钮退出失败:', error)
        // 即使出错也尝试跳转到首页
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    } else {
      // 用户未登录，跳转到登录页面
      router.push('/auth/signin')
    }
  }

  const getButtonText = () => {
    if (loading) {
      return 'Loading...'
    }
    
    if (user) {
      return t.common('logout') || 'Logout'
    }
    
    return t.common('login') || 'Login'
  }

  const getButtonVariant = () => {
    if (user) {
      return 'outline' // 退出按钮使用outline样式
    }
    return variant // 登录按钮使用传入的样式
  }

  return (
    <div className="flex items-center space-x-2">
      {showUserInfo && user && (
        <span className="text-sm text-gray-700">
          {user.name || user.email}
        </span>
      )}
      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleAuthAction}
        className={className}
        disabled={loading}
      >
        {getButtonText()}
      </Button>
    </div>
  )
}
