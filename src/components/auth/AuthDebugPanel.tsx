'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'

interface DebugInfo {
  timestamp: string
  event: string
  data: any
}

export default function AuthDebugPanel() {
  const [isOpen, setIsOpen] = useState(true)
  const [logs, setLogs] = useState<DebugInfo[]>([])
  const { data: nextAuthSession, status: nextAuthStatus } = useSession()
  const { user: simpleAuthUser, loading: simpleAuthLoading } = useSimpleAuth()

  const addLog = (event: string, data?: any) => {
    const newLog: DebugInfo = {
      timestamp: new Date().toLocaleTimeString(),
      event,
      data: data ? JSON.stringify(data, null, 2) : undefined
    }
    setLogs(prev => [newLog, ...prev].slice(0, 50)) // 保留最近50条
  }

  // 监听 NextAuth session 变化
  useEffect(() => {
    addLog('NextAuth Session 状态变化', {
      status: nextAuthStatus,
      session: nextAuthSession,
      user: nextAuthSession?.user
    })
  }, [nextAuthStatus, nextAuthSession])

  // 监听 Simple Auth 变化
  useEffect(() => {
    addLog('Simple Auth 状态变化', {
      loading: simpleAuthLoading,
      user: simpleAuthUser
    })
  }, [simpleAuthLoading, simpleAuthUser])

  // 监听页面焦点
  useEffect(() => {
    const handleFocus = () => {
      addLog('🔵 页面获得焦点', { time: new Date().toISOString() })
    }

    const handleBlur = () => {
      addLog('⚪ 页面失去焦点', { time: new Date().toISOString() })
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // 监听页面可见性
  useEffect(() => {
    const handleVisibilityChange = () => {
      addLog('👁️ 页面可见性变化', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 定期检查 session（但检查退出标志）
  useEffect(() => {
    // 检查是否刚刚退出登录
    const isJustLoggedOut = typeof window !== 'undefined' && 
      sessionStorage.getItem('just_logged_out') === 'true'
    
    if (isJustLoggedOut) {
      addLog('⏭️ 跳过定期检查（刚刚退出登录）', {})
      return
    }
    
    const checkSession = async () => {
      // 再次检查退出标志（可能在检查过程中用户退出）
      if (typeof window !== 'undefined' && 
          sessionStorage.getItem('just_logged_out') === 'true') {
        addLog('⏭️ 定期检查中断（检测到退出标志）', {})
        return
      }
      
      try {
        // 检查 NextAuth
        const nextAuthRes = await fetch('/api/auth/session', {
          credentials: 'include'
        })
        const nextAuthData = await nextAuthRes.json()

        // 检查 Simple Auth
        const simpleAuthRes = await fetch('/api/simple-auth/session', {
          credentials: 'include'
        })
        const simpleAuthData = await simpleAuthRes.json()

        addLog('🔄 定期检查 Session', {
          nextAuth: nextAuthData,
          simpleAuth: simpleAuthData
        })
      } catch (error) {
        addLog('❌ Session 检查失败', { error: String(error) })
      }
    }

    // 每5秒检查一次
    const interval = setInterval(checkSession, 5000)
    
    // 立即检查一次
    checkSession()

    return () => clearInterval(interval)
  }, [])

  // 手动刷新按钮
  const handleManualRefresh = async () => {
    addLog('🔘 手动刷新 Session', {})
    
    try {
      const nextAuthRes = await fetch('/api/auth/session', {
        credentials: 'include'
      })
      const nextAuthData = await nextAuthRes.json()

      const simpleAuthRes = await fetch('/api/simple-auth/session', {
        credentials: 'include'
      })
      const simpleAuthData = await simpleAuthRes.json()

      addLog('✅ 手动刷新完成', {
        nextAuth: nextAuthData,
        simpleAuth: simpleAuthData
      })

      // 强制刷新页面
      window.location.reload()
    } catch (error) {
      addLog('❌ 手动刷新失败', { error: String(error) })
    }
  }

  // 清除日志
  const handleClearLogs = () => {
    setLogs([])
    addLog('🗑️ 日志已清除', {})
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-blue-700"
      >
        显示调试面板
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white border-2 border-blue-500 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold text-sm">🔍 登录状态调试面板</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>

      {/* 当前状态 */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold">NextAuth 状态:</span>
            <span className={`px-2 py-1 rounded ${nextAuthStatus === 'authenticated' ? 'bg-green-100 text-green-800' : nextAuthStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {nextAuthStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">NextAuth 用户:</span>
            <span className="text-gray-600">
              {nextAuthSession?.user?.email || '无'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Simple Auth 加载:</span>
            <span className={`px-2 py-1 rounded ${simpleAuthLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {simpleAuthLoading ? '是' : '否'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Simple Auth 用户:</span>
            <span className="text-gray-600">
              {simpleAuthUser?.email || '无'}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="p-2 bg-gray-100 border-b flex gap-2">
        <button
          onClick={handleManualRefresh}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
        >
          🔄 刷新并重载
        </button>
        <button
          onClick={handleClearLogs}
          className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
        >
          🗑️ 清除日志
        </button>
      </div>

      {/* 日志列表 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
        {logs.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            暂无日志
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded p-2 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-blue-600">{log.event}</span>
                <span className="text-gray-400 text-xs">{log.timestamp}</span>
              </div>
              {log.data && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-1 max-h-32 overflow-y-auto">
                  {log.data}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

