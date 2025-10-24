'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function TestLogoutPage() {
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    try {
      console.log('开始退出登录...')
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
      console.log('退出登录成功')
    } catch (error) {
      console.error('退出登录失败:', error)
      alert('退出登录失败: ' + error)
    }
  }

  const handleLogoutNoRedirect = async () => {
    try {
      console.log('开始退出登录（不重定向）...')
      await signOut({ 
        redirect: false 
      })
      console.log('退出登录成功（不重定向）')
      alert('退出登录成功！请刷新页面查看状态')
    } catch (error) {
      console.error('退出登录失败:', error)
      alert('退出登录失败: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">退出登录测试</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">当前状态:</h2>
          <p><strong>状态:</strong> {status}</p>
          {session ? (
            <div>
              <p><strong>用户:</strong> {session.user?.name || session.user?.email}</p>
              <p><strong>ID:</strong> {session.user?.id}</p>
            </div>
          ) : (
            <p>未登录</p>
          )}
        </div>

        {session ? (
          <div className="space-y-4">
            <Button onClick={handleLogout} className="w-full">
              退出登录（重定向到首页）
            </Button>
            <Button onClick={handleLogoutNoRedirect} variant="outline" className="w-full">
              退出登录（不重定向）
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              刷新页面
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">您已经退出登录</p>
            <Button onClick={() => window.location.href = '/auth/signin'} className="w-full">
              重新登录
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>测试说明:</strong></p>
          <p>1. 点击"退出登录"按钮</p>
          <p>2. 检查控制台日志</p>
          <p>3. 观察页面状态变化</p>
        </div>
      </Card>
    </div>
  )
}
