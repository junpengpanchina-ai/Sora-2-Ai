'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'

interface ProgressiveSignInProps {
  onSuccess?: () => void
}

export default function ProgressiveSignIn({ onSuccess }: ProgressiveSignInProps) {
  const t = useTranslations()
  const router = useRouter()
  
  // 认证方式状态
  const [authMethod, setAuthMethod] = useState<'password' | 'magic-link' | 'sms'>('password')
  
  // 表单状态
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [smsCode, setSmsCode] = useState('')
  
  // UI状态
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [smsSent, setSmsSent] = useState(false)

  // 传统密码登录
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t.auth('invalidCredentials'))
      } else {
        setSuccess('登录成功！')
        onSuccess?.()
        router.push('/dashboard')
      }
    } catch (error) {
      setError(t.auth('signInError'))
    } finally {
      setIsLoading(false)
    }
  }

  // 魔法链接登录
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMagicLinkSent(true)
        setSuccess('魔法链接已发送到您的邮箱！')
      } else {
        setError(data.error || '发送魔法链接失败')
      }
    } catch (error) {
      setError('发送魔法链接失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 发送SMS验证码
  const handleSendSMS = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/sms-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setSmsSent(true)
        setSuccess('SMS验证码已发送！')
      } else {
        setError(data.error || '发送SMS验证码失败')
      }
    } catch (error) {
      setError('发送SMS验证码失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 验证SMS验证码
  const handleVerifySMS = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/sms-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: smsCode })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('SMS验证成功！')
        onSuccess?.()
        router.push('/dashboard')
      } else {
        setError(data.error || 'SMS验证失败')
      }
    } catch (error) {
      setError('SMS验证失败')
    } finally {
      setIsLoading(false)
    }
  }

  // Google登录
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="space-y-6">
      {/* 认证方式选择 */}
      <div className="flex space-x-2">
        <Button
          variant={authMethod === 'password' ? 'primary' : 'outline'}
          onClick={() => setAuthMethod('password')}
          className="flex-1"
        >
          <Icon name="lock" className="w-4 h-4 mr-2" />
          密码登录
        </Button>
        <Button
          variant={authMethod === 'magic-link' ? 'primary' : 'outline'}
          onClick={() => setAuthMethod('magic-link')}
          className="flex-1"
        >
          <Icon name="mail" className="w-4 h-4 mr-2" />
          魔法链接
        </Button>
        <Button
          variant={authMethod === 'sms' ? 'primary' : 'outline'}
          onClick={() => setAuthMethod('sms')}
          className="flex-1"
        >
          <Icon name="phone" className="w-4 h-4 mr-2" />
          SMS登录
        </Button>
      </div>

      {/* 错误和成功消息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* 密码登录表单 */}
      {authMethod === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>
      )}

      {/* 魔法链接登录表单 */}
      {authMethod === 'magic-link' && (
        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
          <div>
            <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <Input
              id="magic-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || magicLinkSent} className="w-full">
            {isLoading ? '发送中...' : magicLinkSent ? '已发送' : '发送魔法链接'}
          </Button>
          {magicLinkSent && (
            <p className="text-sm text-gray-600 text-center">
              请检查您的邮箱并点击魔法链接完成登录
            </p>
          )}
        </form>
      )}

      {/* SMS登录表单 */}
      {authMethod === 'sms' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              手机号码
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号码"
              required
            />
          </div>
          
          {!smsSent ? (
            <Button onClick={handleSendSMS} disabled={isLoading} className="w-full">
              {isLoading ? '发送中...' : '发送验证码'}
            </Button>
          ) : (
            <form onSubmit={handleVerifySMS} className="space-y-4">
              <div>
                <label htmlFor="sms-code" className="block text-sm font-medium text-gray-700 mb-1">
                  验证码
                </label>
                <Input
                  id="sms-code"
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? '验证中...' : '验证登录'}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* 社交登录 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">或使用社交账号</span>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        <Icon name="google" className="w-5 h-5 mr-2" />
        使用 Google 登录
      </Button>
    </div>
  )
}
