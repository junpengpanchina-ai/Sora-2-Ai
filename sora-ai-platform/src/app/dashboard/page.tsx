'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">用户仪表板</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                欢迎，{session?.user?.name || session?.user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 快速操作卡片 */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="video" className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">创建视频</h3>
                  <p className="text-sm text-gray-500">开始生成新的AI视频</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/generate">
                  <Button className="w-full">
                    开始创作
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
                  <h3 className="text-lg font-medium text-gray-900">订阅管理</h3>
                  <p className="text-sm text-gray-500">查看和管理您的订阅</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    查看方案
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
                  <h3 className="text-lg font-medium text-gray-900">我的视频</h3>
                  <p className="text-sm text-gray-500">查看已生成的视频</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/videos">
                  <Button variant="outline" className="w-full">
                    查看历史
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* 统计信息 */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">使用统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">0</div>
                  <div className="text-sm text-gray-500">已生成视频</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-500">本月使用量</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">免费</div>
                  <div className="text-sm text-gray-500">当前方案</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
