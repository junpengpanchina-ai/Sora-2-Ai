'use client'

import React, { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function TestLoginPage() {
  const [email, setEmail] = useState('test123@qq.com')
  const [password, setPassword] = useState('123456')
  const [result, setResult] = useState('')
  const { data: session, status } = useSession()

  const handleTestLogin = async () => {
    setResult('正在测试登录...')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setResult(`登录失败: ${result.error}`)
      } else if (result?.ok) {
        setResult('登录成功!')
      } else {
        setResult(`未知结果: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      setResult(`错误: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">登录测试页面</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
            />
          </div>
          
          <Button onClick={handleTestLogin} className="w-full">
            测试登录
          </Button>
          
          {result && (
            <div className="p-3 bg-gray-100 rounded">
              <strong>结果:</strong> {result}
            </div>
          )}
          
          <div className="p-3 bg-blue-50 rounded">
            <strong>会话状态:</strong> {status}
            {session && (
              <div>
                <strong>用户:</strong> {session.user?.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}