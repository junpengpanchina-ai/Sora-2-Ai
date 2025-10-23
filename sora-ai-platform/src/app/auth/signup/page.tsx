'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '../../../../hooks/useTranslations'

export default function SignUpPage() {
  const t = useTranslations()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError(t.auth('passwordMismatch'))
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 注册成功后自动登录
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/dashboard')
        } else {
          router.push('/auth/signin')
        }
      } else {
        setError(data.message || t.auth('signUpFailed'))
      }
    } catch (err) {
      setError(t.auth('signUpFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // 检查 Google 凭据是否配置
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      alert('Google 登录功能暂未配置，请使用邮箱注册')
      return
    }
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t.auth('signUpTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.auth('hasAccount')} <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">{t.auth('signIn')}</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
                {t.auth('name')}
              </label>
              <div className="mt-1">
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.auth('name')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                {t.auth('email')}
              </label>
              <div className="mt-1">
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth('email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                {t.auth('password')}
              </label>
              <div className="mt-1">
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth('password')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">
                {t.auth('confirmPassword')}
              </label>
              <div className="mt-1">
                <Input
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.auth('confirmPassword')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-referralCode" className="block text-sm font-medium text-gray-700">
                {t.auth('referralCode')} <span className="text-gray-400">({t.auth('optional')})</span>
              </label>
              <div className="mt-1">
                <Input
                  id="signup-referralCode"
                  name="referralCode"
                  type="text"
                  autoComplete="off"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder={t.auth('referralCodePlaceholder')}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
              >
                {t.common('signup')}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t.auth('signUpWithGoogle')}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full"
              >
                <Icon name="google" className="w-5 h-5 mr-2" />
                {t.auth('signUpWithGoogle')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}