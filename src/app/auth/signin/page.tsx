'use client'

import React, { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'
// import ProgressiveSignIn from '@/components/auth/ProgressiveSignIn'

export default function SignInPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(false)
  const router = useRouter()

  // 简化的会话检查 - 只在后台检查，不阻塞UI
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }
    
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 登录表单提交:', { email, password: '***' })
    setIsLoading(true)
    setError('')

    try {
      console.log('🚀 开始调用 signIn...')
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      console.log('📡 signIn 结果:', result)

      if (result?.error) {
        console.log('❌ 登录失败:', result.error)
        setError(t.auth('invalidCredentials'))
      } else if (result?.ok) {
        console.log('✅ 登录成功，准备跳转到首页...')
        // 登录成功，跳转到首页显示登录状态
        window.location.href = '/'
      } else {
        console.log('⚠️ 未知的登录结果:', result)
      }
    } catch (error) {
      console.error('❌ 登录错误:', error)
      setError(t.auth('signInError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // 检查 Google 凭据是否配置
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      alert('Google 登录功能暂未配置，请使用邮箱登录')
      return
    }
    signIn('google', { callbackUrl: '/' })
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t.auth('signInTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.auth('noAccount')}{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t.auth('signUp')}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 py-8 px-4 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.auth('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth('email')}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.auth('password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth('password')}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t.auth('signingIn') : t.auth('signin')}
              </Button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {t.auth('signInWithGoogle')}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full"
                  >
                    <Icon name="google" className="w-5 h-5 mr-2" />
                    {t.auth('signInWithGoogle')}
                  </Button>
                </div>
              </div>
            </form>
        </Card>
      </div>
    </div>
  )
}