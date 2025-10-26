'use client'

import { useState, useEffect } from 'react'

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
      const response = await fetch('/api/simple-auth/session', {
        credentials: 'include', // 重要：包含cookie
      })
      const data = await response.json()
      
      setAuthState({
        user: data.user,
        loading: false
      })
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
      await fetch('/api/simple-auth/logout', {
        method: 'POST',
        credentials: 'include', // 重要：包含cookie
      })
      
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
    checkSession()
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    login,
    logout,
    checkSession
  }
}
