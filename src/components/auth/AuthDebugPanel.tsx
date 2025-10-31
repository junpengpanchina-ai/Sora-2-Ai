'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import { isSimpleAuthCompatEnabled } from '@/lib/utils'

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

  // 定期检查 session（默认关闭高频轮询，仅首次与手动触发；兼容层开启时亦不高频）
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
        const nextAuthRes = await fetch('/api/auth/session', { credentials: 'include' })
        const nextAuthData = await nextAuthRes.json()

        // 仅当兼容层开启时才检查 simple-auth
        let simpleAuthData: any = { user: null }
        if (isSimpleAuthCompatEnabled()) {
          const simpleAuthRes = await fetch('/api/simple-auth/session', { credentials: 'include' })
          simpleAuthData = await simpleAuthRes.json()
        }

        addLog('🔄 定期检查 Session', { nextAuth: nextAuthData, simpleAuth: simpleAuthData })
      } catch (error) {
        addLog('❌ Session 检查失败', { error: String(error) })
      }
    }

    // 默认不再高频轮询：仅初始化检查一次
    checkSession()
    return () => {}
  }, [])

  // 手动刷新按钮
  const handleManualRefresh = async () => {
    addLog('🔘 手动刷新 Session', {})
    
    try {
      const nextAuthRes = await fetch('/api/auth/session', { credentials: 'include' })
      const nextAuthData = await nextAuthRes.json()

      let simpleAuthData: any = { user: null }
      if (isSimpleAuthCompatEnabled()) {
        const simpleAuthRes = await fetch('/api/simple-auth/session', { credentials: 'include' })
        simpleAuthData = await simpleAuthRes.json()
      }

      addLog('✅ 手动刷新完成', { nextAuth: nextAuthData, simpleAuth: simpleAuthData })

      // 强制刷新页面
      window.location.reload()
    } catch (error) {
      addLog('❌ 手动刷新失败', { error: String(error) })
    }
  }

  // 乱码/跳转异常诊断
  const handleDiagnoseGarbled = async () => {
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : 'N/A'
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'N/A'
      const currentPort = typeof window !== 'undefined' ? window.location.port || '80' : 'N/A'

      // 1) 检查 NextAuth providers（尝试拿到回调/登录地址）
      let providers: any = null
      try {
        const res = await fetch('/api/auth/providers', { credentials: 'include' })
        providers = await res.json()
      } catch (e) {
        // ignore
      }

      // 2) 检查布局样式是否 404（常见“页面样式错乱/乱码”根因）
      let layoutCssStatus: number | string = 'N/A'
      try {
        const cssRes = await fetch('/_next/static/css/app/layout.css', { method: 'HEAD' })
        layoutCssStatus = cssRes.status
      } catch (e) {
        layoutCssStatus = 'fetch_error'
      }

      // 3) 端口不一致启发式：如果 providers 中含有 google 且带 callbackUrl/signinUrl，尝试解析端口
      let providerPortHint: string | null = null
      try {
        const google = providers?.google
        const urlCandidates: string[] = []
        if (google && typeof google === 'object') {
          if (google.callbackUrl && typeof google.callbackUrl === 'string') urlCandidates.push(google.callbackUrl)
          if (google.signinUrl && typeof google.signinUrl === 'string') urlCandidates.push(google.signinUrl)
          if (google.authorization && typeof google.authorization === 'string') urlCandidates.push(google.authorization)
        }
        const parsedPorts = urlCandidates
          .map(u => { try { return new URL(u).port || '80' } catch { return null } })
          .filter(Boolean)
        providerPortHint = parsedPorts.length ? parsedPorts.join(',') : null
      } catch {}

      // 4) 端口不一致推断
      const portMismatch = providerPortHint && currentPort && !providerPortHint.split(',').includes(currentPort)

      addLog('🧪 乱码诊断结果', {
        currentUrl,
        currentOrigin,
        currentPort,
        providerSample: providers?.google ? {
          id: providers.google.id,
          name: providers.google.name,
          signinUrl: providers.google.signinUrl,
          callbackUrl: providers.google.callbackUrl,
        } : providers,
        layoutCssHeadStatus: layoutCssStatus,
        portMismatchHint: portMismatch ? `可能的端口不一致：当前 ${currentPort} vs Provider ${providerPortHint}` : '未发现明显端口不一致',
        suggestions: [
          '固定在同一端口开发（优先 3000），并设置 NEXTAUTH_URL 对齐',
          'Google 控制台回调 URI 与本地端口一致（含完整路径）',
          layoutCssStatus === 404 ? 'layout.css 404：请 rm -rf .next 后重启，或检查自定义构建产物' : '样式文件可访问'
        ]
      })
    } catch (error) {
      addLog('❌ 乱码诊断失败', { error: String(error) })
    }
  }

  // 清除日志
  const handleClearLogs = () => {
    setLogs([])
    addLog('🗑️ 日志已清除', {})
  }

  // 复制所有错误和混乱逻辑到剪贴板
  const handleCopyErrors = async () => {
    try {
      // 收集所有错误和警告
      const errorLogs = logs.filter(log => 
        log.event.includes('错误') || 
        log.event.includes('失败') || 
        log.event.includes('❌') ||
        log.event.includes('⚠️') ||
        log.event.includes('混乱') ||
        log.event.includes('问题')
      )
      
      // 收集状态不一致的日志（逻辑混乱的迹象）
      const inconsistentLogs = logs.filter(log => {
        try {
          if (!log.data) return false
          const data = JSON.parse(log.data)
          // 检测状态不一致：比如 session 说有用户但 simpleAuth 说没有
          // 注意：Simple Auth 可以返回 NextAuth 的用户（通过 useSimpleAuth 合并），所以这种不一致可能是正常的检查过程
          if (log.event.includes('定期检查 Session') || log.event.includes('Session')) {
            const nextAuth = data.nextAuth
            const simpleAuth = data.simpleAuth
            if (nextAuth && simpleAuth) {
              const nextAuthHasUser = nextAuth.user && Object.keys(nextAuth.user).length > 0
              const simpleAuthHasUser = simpleAuth.user && Object.keys(simpleAuth.user).length > 0
              // 只有当前状态都稳定了还有不一致才算问题（排除加载过程中的临时不一致）
              // 如果最终状态一致，这些中间过程的不一致不算问题
              const currentNextAuthHasUser = nextAuthSession?.user !== null && nextAuthSession?.user !== undefined
              const currentSimpleAuthHasUser = simpleAuthUser !== null && simpleAuthUser !== undefined
              // 如果当前最终状态一致，那么这些日志中的不一致只是加载过程中的正常现象
              if (currentNextAuthHasUser === currentSimpleAuthHasUser) {
                return false // 最终状态一致，不算问题
              }
              return nextAuthHasUser !== simpleAuthHasUser
            }
          }
          return false
        } catch {
          return false
        }
      })
      
      // 收集所有日志内容
      const allLogsText = logs.map(log => {
        const timestamp = log.timestamp
        const event = log.event
        let dataStr = ''
        try {
          const data = log.data ? JSON.parse(log.data) : {}
          dataStr = JSON.stringify(data, null, 2)
        } catch {
          dataStr = log.data || ''
        }
        return `${timestamp} - ${event}\n${dataStr}`
      }).join('\n\n')

      // 当前状态信息（包含可能的问题）
      const hasUser = nextAuthSession?.user || simpleAuthUser
      const statusMismatch = (nextAuthSession?.user && !simpleAuthUser) || (!nextAuthSession?.user && simpleAuthUser)
      
      const statusInfo = `
=== 🔍 认证调试信息 ===
生成时间: ${new Date().toLocaleString('zh-CN')}

=== 当前认证状态 ===
NextAuth 状态: ${nextAuthStatus}
NextAuth 用户: ${nextAuthSession?.user?.email || nextAuthSession?.user?.name || '无'}
NextAuth 用户ID: ${nextAuthSession?.user?.id || '无'}
Simple Auth 加载: ${simpleAuthLoading}
Simple Auth 用户: ${simpleAuthUser?.email || simpleAuthUser?.name || '无'}
Simple Auth 用户ID: ${simpleAuthUser?.id || '无'}

⚠️ 状态不一致: ${statusMismatch ? '是（发现逻辑混乱）' : '否'}

=== ❌ 错误和警告日志 (${errorLogs.length}条) ===
${errorLogs.length > 0 ? errorLogs.map(log => {
  let dataStr = ''
  try {
    const data = log.data ? JSON.parse(log.data) : {}
    dataStr = JSON.stringify(data, null, 2)
  } catch {
    dataStr = log.data || ''
  }
  return `${log.timestamp} - ${log.event}\n${dataStr}`
}).join('\n\n') : '无错误日志'}

=== 🔀 状态不一致日志 (${inconsistentLogs.length}条) ===
${inconsistentLogs.length > 0 ? inconsistentLogs.map(log => {
  let dataStr = ''
  try {
    const data = log.data ? JSON.parse(log.data) : {}
    dataStr = JSON.stringify(data, null, 2)
  } catch {
    dataStr = log.data || ''
  }
  return `${log.timestamp} - ${log.event}\n${dataStr}`
}).join('\n\n') : '无状态不一致'}

=== 📋 所有日志 (最近${logs.length}条) ===
${allLogsText}

=== 🌐 浏览器信息 ===
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
Cookies: ${typeof document !== 'undefined' ? document.cookie.split(';').length + ' 个' : 'N/A'}

=== 🍪 关键 Cookies ===
${typeof document !== 'undefined' ? 
  (() => {
    const allCookies = document.cookie.split(';').map(c => c.trim())
    const authCookies = allCookies.filter(c => 
      c.toLowerCase().includes('auth') || 
      c.toLowerCase().includes('session') || 
      c.toLowerCase().includes('token') ||
      c.toLowerCase().includes('csrf')
    )
    if (authCookies.length === 0) {
      // 如果没有找到关键 cookies，显示所有 cookies 用于调试
      const allCookiesList = allCookies.length > 0 
        ? allCookies.map(c => {
            const [name, value] = c.split('=')
            return `${name || '未知'}=${value ? value.substring(0, 20) + '...' : '空'}`
          }).join('\n')
        : '无 cookies'
      return `未找到关键认证 cookies\n\n所有 cookies (${allCookies.length} 个):\n${allCookiesList}`
    }
    return authCookies.map(c => {
      const [name, value] = c.split('=')
      return `${name || '未知'}=${value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '空'}`
    }).join('\n')
  })()
  : 'N/A'}

=== 💡 可能的问题 ===
${statusMismatch ? '⚠️ NextAuth 和 Simple Auth 状态不一致' : ''}
${nextAuthStatus === 'loading' && !simpleAuthLoading ? '⚠️ NextAuth 加载中但 Simple Auth 已完成' : ''}
${simpleAuthLoading && nextAuthStatus !== 'loading' ? '⚠️ Simple Auth 加载中但 NextAuth 已完成' : ''}
${errorLogs.length > 0 ? `⚠️ 发现 ${errorLogs.length} 个错误或警告` : ''}
${inconsistentLogs.length > 0 ? `⚠️ 发现 ${inconsistentLogs.length} 次状态不一致（逻辑混乱）` : ''}
`

      // 复制到剪贴板
      await navigator.clipboard.writeText(statusInfo)
      addLog('📋 已复制错误和日志到剪贴板', { 
        错误数量: errorLogs.length,
        状态不一致数量: inconsistentLogs.length 
      })
      
      // 显示成功提示
      alert(`✅ 已复制所有调试信息到剪贴板！\n\n包含：\n- ${errorLogs.length} 条错误日志\n- ${inconsistentLogs.length} 条状态不一致日志\n- ${logs.length} 条总日志\n- 当前状态信息`)
    } catch (error) {
      console.error('复制失败:', error)
      addLog('❌ 复制失败', { error: String(error) })
      alert('❌ 复制失败，请查看控制台: ' + String(error))
    }
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
      <div className="p-2 bg-gray-100 border-b flex flex-wrap gap-2">
        <button
          onClick={handleManualRefresh}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 min-w-[120px]"
        >
          🔄 刷新并重载
        </button>
        <button
          onClick={handleDiagnoseGarbled}
          className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 min-w-[120px]"
          title="检测端口不一致、样式丢失、回调URL配置等常见乱码原因"
        >
          🧪 乱码诊断
        </button>
        <button
          onClick={handleCopyErrors}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 min-w-[120px]"
          title="复制所有错误和日志到剪贴板"
        >
          📋 复制错误日志
        </button>
        <button
          onClick={handleClearLogs}
          className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 min-w-[120px]"
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

