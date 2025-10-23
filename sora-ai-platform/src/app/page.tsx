'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/hooks/useTranslations'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'

export default function HomePage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleGetStarted = () => {
    if (status === 'loading') {
      return // 等待加载完成
    }
    
    if (session) {
      // 已登录，跳转到视频生成页面
      router.push('/generate')
    } else {
      // 未登录，跳转到登录页面
      router.push('/auth/signin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{t.home('title')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t.home('subtitle')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleGetStarted}
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? t.common('loading') : t.home('getStarted')}
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/pricing">
                      <Button variant="outline" size="lg" className="w-full">
                        {t.home('learnMore')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              {t.home('features.title')}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t.home('features.title')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <Card className="p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <Icon name="video" className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {t.home('features.aiGeneration.title')}
                </h3>
                <p className="text-base text-gray-500">
                  {t.home('features.aiGeneration.description')}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <Icon name="zap" className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {t.home('features.easyToUse.title')}
                </h3>
                <p className="text-base text-gray-500">
                  {t.home('features.easyToUse.description')}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <Icon name="clock" className="h-6 w-6" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {t.home('features.fastProcessing.title')}
                </h3>
                <p className="text-base text-gray-500">
                  {t.home('features.fastProcessing.description')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t.home('growthFeatures.title')}
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Icon name="award" className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t.home('growthFeatures.userLevel.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t.home('growthFeatures.userLevel.description')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Icon name="gift" className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t.home('growthFeatures.invitationReward.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t.home('growthFeatures.invitationReward.description')}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Icon name="share-2" className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t.home('growthFeatures.socialSharing.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t.home('growthFeatures.socialSharing.description')}
              </p>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link href="/mvp">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {t.home('watchDemo')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
