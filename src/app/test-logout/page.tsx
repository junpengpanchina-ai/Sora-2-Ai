'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function TestLogoutPage() {
  const { data: session, status } = useSession()

  const handleTestLogout = async () => {
    console.log('🧪 测试退出开始...')
    console.log('当前会话状态:', session)
    
    try {
      const result = await signOut({ redirect: false })
      console.log('退出结果:', result)
      
      // 强制刷新页面
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      console.error('退出失败:', error)
    }
  }

  const handleForceLogout = async () => {
    console.log('🚀 强制退出开始...')
    
    try {
      // 清除所有可能的session数据
      if (typeof window !== 'undefined') {
        // 清除localStorage
        localStorage.clear()
        // 清除sessionStorage
        sessionStorage.clear()
        // 跳转到首页
        window.location.href = '/'
      }
    } catch (error) {
      console.error('强制退出失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">退出功能测试</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">当前状态</h2>
              <p className="text-gray-600">
                登录状态: {status === 'loading' ? '加载中...' : status === 'authenticated' ? '已登录' : '未登录'}
              </p>
              {session && (
                <p className="text-gray-600">
                  用户: {session.user?.name || session.user?.email}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">测试退出</h2>
              
              <Button 
                onClick={handleTestLogout}
                className="w-full"
                variant="outline"
              >
                测试 NextAuth 退出
              </Button>
              
              <Button 
                onClick={handleForceLogout}
                className="w-full"
                variant="outline"
              >
                强制退出（清除所有数据）
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">调试信息</h3>
              <p className="text-sm text-blue-700">
                请打开浏览器开发者工具查看控制台输出，了解退出过程的详细信息。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}