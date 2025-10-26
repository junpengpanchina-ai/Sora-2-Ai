'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function TestAuthPage() {
  const [email, setEmail] = useState('test123@qq.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [session, setSession] = useState<any>(null)

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('开始测试登录...')
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      console.log('登录结果:', loginResult)
      setResult(JSON.stringify(loginResult, null, 2))
      
      // 检查会话
      const currentSession = await getSession()
      console.log('当前会话:', currentSession)
      setSession(currentSession)
      
    } catch (error) {
      console.error('登录错误:', error)
      setResult(`错误: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      const currentSession = await getSession()
      setSession(currentSession)
      setResult(`会话检查: ${currentSession ? '已登录' : '未登录'}`)
    } catch (error) {
      setResult(`会话检查错误: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NextAuth 认证测试</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">邮箱:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">密码:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-4">
          <Button onClick={testLogin} disabled={loading}>
            {loading ? '测试中...' : '测试登录'}
          </Button>
          
          <Button onClick={checkSession} variant="outline">
            检查会话
          </Button>
        </div>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">结果:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      {session && (
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-medium mb-2">会话信息:</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
