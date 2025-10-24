'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { usePerformanceMonitor } from '@/lib/performance-monitor'
import { apiCache } from '@/lib/api-cache'
import { useTranslations } from '@/hooks/useTranslations'

export default function PerformancePage() {
  const t = useTranslations()
  const { metrics, score, recommendations } = usePerformanceMonitor()
  const [cacheStats, setCacheStats] = useState(() => {
    if (typeof window !== 'undefined') {
      return apiCache.getStats()
    }
    return { size: 0, maxSize: 100, hitRate: 0 }
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshMetrics = async () => {
    setIsRefreshing(true)
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCacheStats(apiCache.getStats())
    setIsRefreshing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="loader" className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.performance('title')}</h1>
          <p className="text-gray-600 mt-2">{t.performance('subtitle')}</p>
        </div>

        {/* 性能评分 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(score)} mb-4`}>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.performance('performanceScore')}</h3>
            <p className="text-sm text-gray-600">
              {score >= 90 ? t.performance('excellent') : score >= 70 ? t.performance('good') : t.performance('needsOptimization')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Icon name="clock" className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">{t.performance('pageLoadTime')}</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.pageLoadTime.toFixed(0)}ms
            </p>
            <p className="text-sm text-gray-600">
              {metrics.pageLoadTime < 3000 ? t.performance('excellent') : metrics.pageLoadTime < 5000 ? t.performance('good') : t.performance('needsOptimization')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Icon name="paint-brush" className="h-6 w-6 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">{t.performance('firstContentfulPaint')}</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </p>
            <p className="text-sm text-gray-600">
              {metrics.firstContentfulPaint < 1500 ? t.performance('excellent') : metrics.firstContentfulPaint < 2500 ? t.performance('good') : t.performance('needsOptimization')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Icon name="database" className="h-6 w-6 text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">{t.performance('memoryUsage')}</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {metrics.memoryUsage.toFixed(1)}MB
            </p>
            <p className="text-sm text-gray-600">
              {metrics.memoryUsage < 50 ? t.performance('excellent') : metrics.memoryUsage < 100 ? t.performance('good') : t.performance('needsOptimization')}
            </p>
          </Card>
        </div>

        {/* 详细指标 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 核心指标 */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.performance('coreMetrics')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">累积布局偏移 (CLS)</span>
                <span className="font-semibold">
                  {metrics.cumulativeLayoutShift.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">首次输入延迟 (FID)</span>
                <span className="font-semibold">
                  {metrics.firstInputDelay.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">总阻塞时间 (TBT)</span>
                <span className="font-semibold">
                  {metrics.totalBlockingTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API</span>
                <span className="font-semibold">
                  {metrics.apiResponseTime.toFixed(0)}ms
                </span>
              </div>
            </div>
          </Card>

          {/* 缓存统计 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{t.performance('cacheStats')}</h3>
              <Button 
                onClick={refreshMetrics}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                {isRefreshing ? t.common('refresh') : t.performance('refreshData')}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">缓存项数量</span>
                <span className="font-semibold">
                  {cacheStats.size} / {cacheStats.maxSize}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">命中率</span>
                <span className="font-semibold">
                  {(cacheStats.hitRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(cacheStats.size / cacheStats.maxSize) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        {/* 优化建议 */}
        {recommendations.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.performance('optimizationRecommendations')}</h3>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Icon name="lightbulb" className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={refreshMetrics} disabled={isRefreshing}>
            <Icon name="refresh-cw" className="h-4 w-4 mr-2" />
            {t.performance('refreshData')}
          </Button>
          <Button 
            onClick={() => apiCache.clear()}
            variant="outline"
          >
            <Icon name="trash-2" className="h-4 w-4 mr-2" />
            {t.performance('clearCache')}
          </Button>
        </div>
      </div>
    </div>
  )
}
