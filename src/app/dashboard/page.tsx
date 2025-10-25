'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function DashboardPage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">仪表板</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 快速操作卡片 */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="video" className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{t.mvp('quickActions.generateVideo')}</h3>
                  <p className="text-sm text-gray-500">{t.home('subtitle')}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/generate">
                  <Button className="w-full">
                    {t.home('getStarted')}
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 订阅状态卡片 */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="credit-card" className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{t.mvp('quickActions.upgradeSubscription')}</h3>
                  <p className="text-sm text-gray-500">{t.pricing('subtitle')}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    {t.pricing('title')}
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 视频历史卡片 */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="film" className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">生成视频</h3>
                  <p className="text-sm text-gray-500">{t.notifications('videoGenerated')}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/videos">
                  <Button variant="outline" className="w-full">
                    {t.common('view')}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* 统计信息 */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t.mvp('communityActivity.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">0</div>
                  <div className="text-sm text-gray-500">{t.mvp('communityActivity.totalVideos')}</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-500">{t.mvp('communityActivity.recentActivity')}</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{t.common('free')}</div>
                  <div className="text-sm text-gray-500">{t.pricing('title')}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
