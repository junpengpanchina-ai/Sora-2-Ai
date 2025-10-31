'use client'

import { useState, useEffect } from 'react'
import { isSimpleAuthCompatEnabled } from '@/lib/utils'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  loading: boolean
}

export function useSimpleAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  })

  // 检查会话状态
  const checkSession = async () => {
    try {
      // 首先检查 NextAuth session（用于 Google OAuth 登录）
      const nextAuthResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      })
      
      if (nextAuthResponse.ok) {
        const nextAuthData = await nextAuthResponse.json()
        if (nextAuthData?.user) {
          setAuthState({
            user: {
              id: nextAuthData.user.id || '',
              email: nextAuthData.user.email || '',
              name: nextAuthData.user.name || nextAuthData.user.email || '',
            },
            loading: false
          })
          return
        }
      }
      
      // 如果 NextAuth 没有 session，且兼容层启用，再检查 simple-auth
      if (isSimpleAuthCompatEnabled()) {
        const response = await fetch('/api/simple-auth/session', {
          credentials: 'include',
        })
        const data = await response.json()
        setAuthState({
          user: data.user,
          loading: false
        })
      } else {
        setAuthState({ user: null, loading: false })
      }
    } catch (error) {
      console.error('Session check error:', error)
      setAuthState({
        user: null,
        loading: false
      })
    }
  }

  // 登录
  const login = async (email: string, password: string) => {
    try {
      if (!isSimpleAuthCompatEnabled()) {
        return { success: false, error: 'SimpleAuth disabled' }
      }
      const response = await fetch('/api/simple-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 重要：包含cookie
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // 登录成功后重新检查会话
        await checkSession()
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  // 登出
  const logout = async () => {
    try {
      if (isSimpleAuthCompatEnabled()) {
        await fetch('/api/simple-auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      }
      
      setAuthState({
        user: null,
        loading: false
      })
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  // 组件挂载时检查会话
  useEffect(() => {
    // 检查是否刚刚退出登录
    const isJustLoggedOut = typeof window !== 'undefined' && 
      sessionStorage.getItem('just_logged_out') === 'true'
    
    if (isJustLoggedOut) {
      // 如果刚刚退出，清除标志并跳过检查
      sessionStorage.removeItem('just_logged_out')
      setAuthState({
        user: null,
        loading: false
      })
      console.log('⏭️ 跳过 session 检查（刚刚退出登录）')
      return
    }
    
    // 立即检查一次（不延迟）
    checkSession()
    
    // 监听页面焦点变化，当页面获得焦点时刷新 session（用于检测 Google OAuth 登录后）
    const handleFocus = () => {
      if (sessionStorage.getItem('just_logged_out') !== 'true') {
        checkSession()
      }
    }
    
    // 监听页面可见性变化，当页面变为可见时刷新 session
    const handleVisibilityChange = () => {
      if (!document.hidden && sessionStorage.getItem('just_logged_out') !== 'true') {
        checkSession()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    login,
    logout,
    checkSession
  }
}
