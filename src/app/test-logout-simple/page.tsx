'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function TestLogoutSimplePage() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    console.log('🔐 简单退出测试开始')
    console.log('当前会话:', session)
    
    try {
      console.log('🚀 调用 signOut...')
      const result = await signOut({ redirect: false })
      console.log('📡 signOut 结果:', result)
      
      console.log('✅ 退出成功，准备跳转...')
      window.location.href = '/'
    } catch (error) {
      console.error('❌ 退出错误:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">简单退出测试</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">当前状态:</h3>
            <p className="text-sm text-gray-700">
              {session ? `已登录: ${session.user?.email}` : '未登录'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            退出登录测试
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
