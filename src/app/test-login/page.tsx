'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function TestLoginPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        alert('登录失败: ' + result.error)
      } else {
        alert('登录成功!')
      }
    } catch (error) {
      alert('登录错误: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">登录状态测试</h1>
        
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

        {!session ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              退出登录
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              进入仪表板
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>测试账号:</strong></p>
          <p>邮箱: test@example.com</p>
          <p>密码: 123456</p>
        </div>
      </Card>
    </div>
  )
}
