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
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()

  // 检查用户是否已经登录 - 优化性能
  useEffect(() => {
    let mounted = true
    
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (mounted && session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        if (mounted) {
          setIsCheckingSession(false)
        }
      }
    }
    
    checkSession()
    
    return () => {
      mounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        setError(t.auth('invalidCredentials'))
      } else if (result?.ok) {
        // 登录成功，直接跳转
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Login error:', error)
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
    signIn('google', { callbackUrl: '/dashboard' })
  }

  // 如果正在检查会话，显示加载状态
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    )
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
              {t.auth('signup')}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 py-8 px-4 sm:px-10">
          <ProgressiveSignIn onSuccess={() => router.push('/dashboard')} />
        </Card>
      </div>
    </div>
  )
}