'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function HomePage() {
  const t = useTranslations()
  const { user: simpleAuthUser, loading: simpleAuthLoading, checkSession } = useSimpleAuth()
  const { data: nextAuthSession, status: nextAuthStatus } = useSession()
  const router = useRouter()
  
  // 合并两种登录方式的状态
  const user = nextAuthSession?.user || simpleAuthUser
  const loading = simpleAuthLoading || nextAuthStatus === 'loading'
  
  // 如果用户已登录，显示欢迎信息
  const showWelcomeMessage = user && !loading
  
  // 页面加载时检查 session（用于 Google OAuth 回调后刷新状态）
  useEffect(() => {
    // 如果是 Google OAuth 回调返回且已登录，立即刷新
    if (nextAuthStatus === 'authenticated') {
      console.log('✅ NextAuth 已认证，刷新 session')
      checkSession()
    }
  }, [nextAuthStatus, checkSession])
  
  // URL 参数检测（用于 Google 回调后强制刷新）
  useEffect(() => {
    // 检查是否是 OAuth 回调返回（URL 可能包含相关参数）
    const urlParams = new URLSearchParams(window.location.search)
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state')
    
    if (hasOAuthParams) {
      console.log('🔐 检测到 OAuth 回调参数，准备刷新 session')
      
      // OAuth 回调返回，多次刷新确保 session 已创建
      const timers: NodeJS.Timeout[] = []
      
      // 立即尝试刷新（可能还太快）
      timers.push(setTimeout(() => {
        console.log('🔄 第1次尝试刷新 session (0.5秒)')
        checkSession()
      }, 500))
      
      // 延迟刷新（确保 session cookie 已设置）
      timers.push(setTimeout(() => {
        console.log('🔄 第2次尝试刷新 session (1秒)')
        checkSession()
        // 强制刷新 NextAuth session
        import('next-auth/react').then(({ getSession }) => {
          getSession().then(session => {
            console.log('📡 NextAuth getSession 结果:', session?.user?.email || '无')
          })
        })
      }, 1000))
      
      // 再次延迟刷新（确保稳定）
      timers.push(setTimeout(() => {
        console.log('🔄 第3次尝试刷新 session (2秒)')
        checkSession()
      }, 2000))
      
      // 清除 URL 参数
      window.history.replaceState({}, '', window.location.pathname)
      
      return () => {
        timers.forEach(timer => clearTimeout(timer))
      }
    }
  }, [checkSession])
  
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 登录成功状态显示 */}
            {showWelcomeMessage && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <Icon name="checkCircle" className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Welcome back, {user.name || user.email}! 🎉
                  </span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  You are successfully logged in
                </p>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t.home('title')}
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home('subtitle')}
            </p>
            <div className="mt-10 flex flex-col gap-4 justify-center items-center">
              {showWelcomeMessage ? (
                <>
                  <Link href="/generate">
                    <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                      <Icon name="video" className="w-5 h-5 mr-2" />
                      Start Creating Videos
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto min-w-[200px]"
                    >
                      <Icon name="user" className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Google 一键登录 - 最显眼的按钮 */}
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto min-w-[280px] bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-lg"
                    onClick={() => {
                      console.log('🚀 首页直接Google登录')
                      // 使用 redirect: true 让 NextAuth 自动处理重定向到 Google
                      signIn('google', { 
                        callbackUrl: '/',
                        redirect: true 
                      }).catch((error) => {
                        console.error('❌ Google登录错误:', error)
                      })
                    }}
                    type="button"
                  >
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-semibold">使用 Google 一键登录</span>
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-2">或</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/auth/signin">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[140px]">
                        邮箱登录
                      </Button>
                    </Link>
                    <Link href="/generate">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[140px]">
                        <Icon name="video" className="w-5 h-5 mr-2" />
                        查看演示
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t.home('features.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.home('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="zap" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.aiGeneration.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.aiGeneration.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="clock" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.fastProcessing.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.fastProcessing.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="users" className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.easyToUse.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.easyToUse.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="award" className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Quality</h3>
              <p className="text-gray-600">
                Generate 4K ultra-high-definition videos with multiple styles and formats to meet all your creative needs
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="gift" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Referral Rewards</h3>
              <p className="text-gray-600">
                Invite friends to use our platform and earn free video generation credits and exclusive features
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="shield" className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security ensures your creative ideas and content are fully protected
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to generate professional videos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Vision</h3>
              <p className="text-gray-600">
                Use simple text to describe the video content you want to create, and our AI will understand your creative ideas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Smart Generation</h3>
              <p className="text-gray-600">
                Our AI system analyzes your description and generates high-quality videos that meet your requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Share</h3>
              <p className="text-gray-600">
                Once generation is complete, you can download your video or share it directly on social media
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              简单透明的定价
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              选择适合您的AI视频生成方案。所有方案都包含3天免费试用，让您充分体验我们的AI技术。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sora Solo */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sora Solo</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">$42<span className="text-2xl text-gray-500 font-normal">/月</span></div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  3天免费试用
                </div>
                <ul className="space-y-2 text-gray-600 mb-6 text-sm">
                  <li>• 每月50个AI视频生成</li>
                  <li>• 最长30秒视频时长</li>
                  <li>• 4K超高清画质</li>
                  <li>• AI智能剪辑和配音</li>
                  <li>• 无水印导出</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-gray-800 hover:bg-gray-900">开始3天免费试用</Button>
                </Link>
              </div>
            </Card>

            {/* Sora Teams - Recommended */}
            <Card className="p-8 border-2 border-blue-500 relative scale-105 shadow-blue-100 hover:shadow-2xl transition-all duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  推荐方案
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sora Teams</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">$299<span className="text-2xl text-gray-500 font-normal">/月</span></div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  3天免费试用
                </div>
                <ul className="space-y-2 text-gray-600 mb-6 text-sm">
                  <li>• 每月200个AI视频生成</li>
                  <li>• 最长60秒视频时长</li>
                  <li>• 4K超高清画质</li>
                  <li>• 团队协作功能(最多10人)</li>
                  <li>• API接口访问</li>
                  <li>• 专属客户经理</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">开始3天免费试用</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* View Full Pricing */}
          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <Icon name="arrow-right" className="w-5 h-5 mr-2" />
                查看完整定价详情
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your AI Video Creation Journey?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of creators and unleash unlimited creativity with AI technology
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Icon name="rocket" className="w-5 h-5 mr-2" />
                {t.common('signup')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}