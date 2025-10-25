'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { growthEngine, GrowthMetrics } from '@/lib/growth-engine'
import { useTranslations } from '@/hooks/useTranslations'

export default function GrowthDashboard() {
  const t = useTranslations()
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (session) {
      fetchGrowthMetrics()
    }
  }, [session])

  const fetchGrowthMetrics = async () => {
    try {
      // 模拟获取增长数据
      const mockMetrics: GrowthMetrics = {
        acquisition: {
          totalUsers: 12543,
          newUsersToday: 127,
          referralRate: 0.35,
          organicRate: 0.65
        },
        activation: {
          firstVideoRate: 0.78,
          timeToFirstVideo: 2.3,
          templateUsageRate: 0.45
        },
        retention: {
          day1Retention: 0.85,
          day7Retention: 0.42,
          day30Retention: 0.18,
          monthlyActiveUsers: 2847
        },
        referral: {
          totalReferrals: 4389,
          viralCoefficient: 0.35,
          shareRate: 0.23
        },
        revenue: {
          monthlyRecurringRevenue: 125430,
          averageRevenuePerUser: 9.99,
          conversionRate: 0.12
        }
      }
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('获取增长数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.errors('unauthorized')}</h2>
          <p className="text-gray-600 mb-6">{t.mvp('communityActivity.recentActivity')}</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            {t.common('signin')}
          </Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: t.performance('coreMetrics'), icon: 'chart' },
    { id: 'acquisition', name: '成就', icon: 'users' },
    { id: 'retention', name: t.mvp('communityActivity.title'), icon: 'clock' },
    { id: 'revenue', name: t.pricing('title'), icon: 'dollar-sign' }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon name="users" className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.mvp('communityActivity.totalUsers')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.acquisition.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon name="trending-up" className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.notifications('new')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.acquisition.newUsersToday}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Icon name="dollar-sign" className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.pricing('title')}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics?.revenue.monthlyRecurringRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Icon name="share" className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.referral('title')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.referral.viralCoefficient.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 增长趋势图 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.mvp('communityActivity.recentActivity')}</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">{t.common('loading')}</p>
        </div>
      </Card>

      {/* 增长建议 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.mvp('personalizedRecommendations')}</h3>
        <div className="space-y-3">
          {growthEngine.getGrowthRecommendations().map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon name="lightbulb" className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderAcquisition = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">推荐</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(metrics?.acquisition.referralRate || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {(metrics?.acquisition.referralRate || 0) * 100}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.notifications('info')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(metrics?.acquisition.organicRate || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {(metrics?.acquisition.organicRate || 0) * 100}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.mvp('quickActions.title')}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{t.notifications('videoGenerated')}</span>
                <span>{(metrics?.activation.firstVideoRate || 0) * 100}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(metrics?.activation.firstVideoRate || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{t.home('features.easyToUse.title')}</span>
                <span>{(metrics?.activation.templateUsageRate || 0) * 100}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${(metrics?.activation.templateUsageRate || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderRetention = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.performance('excellent')}</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">
            {(metrics?.retention.day1Retention || 0) * 100}%
          </p>
          <p className="text-sm text-gray-500">60%</p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.performance('good')}</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {(metrics?.retention.day7Retention || 0) * 100}%
          </p>
          <p className="text-sm text-gray-500">25%</p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.performance('needsOptimization')}</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">
            {(metrics?.retention.day30Retention || 0) * 100}%
          </p>
          <p className="text-sm text-gray-500">行业平均: 10%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.mvp('communityActivity.totalUsers')}</h3>
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {metrics?.retention.monthlyActiveUsers.toLocaleString()}
          </p>
          <p className="text-gray-600">{t.mvp('communityActivity.totalUsers')}</p>
        </div>
      </Card>
    </div>
  )

  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.pricing('title')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.pricing('pro.period')}</span>
              <span className="font-semibold text-gray-900">
                ${metrics?.revenue.monthlyRecurringRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ARPU</span>
              <span className="font-semibold text-gray-900">
                ${metrics?.revenue.averageRevenuePerUser.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CVR</span>
              <span className="font-semibold text-gray-900">
                {(metrics?.revenue.conversionRate || 0) * 100}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.referral('title')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">成功邀请</span>
              <span className="font-semibold text-gray-900">
                {metrics?.referral.totalReferrals.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">K</span>
              <span className="font-semibold text-gray-900">
                {metrics?.referral.viralCoefficient.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.notifications('shareSuccessful')}</span>
              <span className="font-semibold text-gray-900">
                {(metrics?.referral.shareRate || 0) * 100}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.mvp('title')}</h1>
          <p className="text-gray-600">{t.mvp('subtitle')}</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name={tab.icon as any} className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'acquisition' && renderAcquisition()}
        {activeTab === 'retention' && renderRetention()}
        {activeTab === 'revenue' && renderRevenue()}
      </div>
    </div>
  )
}
