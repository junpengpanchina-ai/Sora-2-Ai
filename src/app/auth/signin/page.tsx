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

  // 检查会话状态 - 使用useEffect但避免DOM渲染问题
  useEffect(() => {
    let mounted = true
    
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (mounted && session) {
          // 使用setTimeout避免立即重定向导致的React渲染问题
          setTimeout(() => {
            router.push('/dashboard')
          }, 100)
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }
    
    checkSession()
    
    return () => {
      mounted = false
    }
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

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    try {
      console.log('🔐 开始Google登录...')
      setIsGoogleLoading(true)
      setError('')
      
      // 直接调用 signIn，NextAuth 会自动处理重定向
      const result = await signIn('google', { 
        redirect: true, // 使用默认重定向
        callbackUrl: '/'
      })
      
      console.log('✅ Google登录发起成功，结果:', result)
    } catch (error: any) {
      console.error('❌ Google登录失败:', error)
      setIsGoogleLoading(false)
      setError(error?.message || 'Google登录失败，请重试')
    }
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
          {/* Google 登录 - 放在表单前面，最显眼 */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-md"
              disabled={isGoogleLoading || isLoading}
              type="button"
              size="lg"
            >
              {isGoogleLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  正在跳转到Google...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold">使用 Google 一键登录</span>
                </>
              )}
            </Button>
            {error && error.includes('Google') && (
              <div className="mt-2 text-sm text-red-600 text-center">
                {error}
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                或使用邮箱登录
              </span>
            </div>
          </div>

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
                <Link
                  href="/auth/forgot-password"
                  className="block text-sm text-primary-600 hover:text-primary-500 mb-2"
                >
                  Forgot your password?
                </Link>
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
            </form>
        </Card>
      </div>
    </div>
  )
}