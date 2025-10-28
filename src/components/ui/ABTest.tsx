'use client'

import React, { useState, useEffect } from 'react'

interface ABTestProps {
  testId: string
  variants: {
    [key: string]: {
      component: React.ReactNode
      weight: number
    }
  }
  onVariantSelect?: (variantId: string) => void
}

export default function ABTest({ testId, variants, onVariantSelect }: ABTestProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟A/B测试逻辑
    const selectVariant = () => {
      setIsLoading(true)
      
      // 模拟网络延迟
      setTimeout(() => {
        const variantIds = Object.keys(variants)
        const weights = Object.values(variants).map(v => v.weight)
        
        // 基于权重随机选择变体
        const random = Math.random()
        let cumulativeWeight = 0
        let selectedId = variantIds[0]
        
        for (let i = 0; i < variantIds.length; i++) {
          cumulativeWeight += weights[i]
          if (random <= cumulativeWeight) {
            selectedId = variantIds[i]
            break
          }
        }
        
        setSelectedVariant(selectedId)
        setIsLoading(false)
        
        // 记录A/B测试事件
        trackABTestEvent(testId, selectedId)
        
        if (onVariantSelect) {
          onVariantSelect(selectedId)
        }
      }, 500)
    }
    
    selectVariant()
  }, [testId, variants, onVariantSelect])

  const trackABTestEvent = (testId: string, variantId: string) => {
    // 实际项目中应该发送到分析服务
    console.log(`A/B Test Event: ${testId} -> ${variantId}`)
    
    // 可以发送到Google Analytics, Mixpanel等
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_view', {
        test_id: testId,
        variant_id: variantId
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!selectedVariant || !variants[selectedVariant]) {
    return <div>Error: Invalid variant selected</div>
  }

  return <>{variants[selectedVariant].component}</>
}

// A/B测试配置
export const ABTestConfigs = {
  pricingPageTitle: {
    testId: 'pricing_title_v1',
    variants: {
      control: {
        component: (
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
            简单透明的定价
          </h2>
        ),
        weight: 0.5
      },
      variant_a: {
        component: (
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            选择您的AI视频方案
          </h2>
        ),
        weight: 0.3
      },
      variant_b: {
        component: (
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            开始您的AI创作之旅
          </h2>
        ),
        weight: 0.2
      }
    }
  },
  
  ctaButton: {
    testId: 'cta_button_v1',
    variants: {
      control: {
        component: (
          <button className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">
            开始3天免费试用
          </button>
        ),
        weight: 0.4
      },
      variant_a: {
        component: (
          <button className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">
            立即免费试用
          </button>
        ),
        weight: 0.3
      },
      variant_b: {
        component: (
          <button className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700">
            免费体验AI视频生成
          </button>
        ),
        weight: 0.3
      }
    }
  }
}

// A/B测试结果分析组件
export function ABTestAnalytics({ testId }: { testId: string }) {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    conversions: 0,
    conversionRate: 0,
    variants: {} as Record<string, { views: number; conversions: number; rate: number }>
  })

  useEffect(() => {
    // 模拟获取A/B测试分析数据
    const loadAnalytics = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAnalytics({
        totalViews: 1250,
        conversions: 89,
        conversionRate: 7.12,
        variants: {
          control: { views: 625, conversions: 45, rate: 7.2 },
          variant_a: { views: 375, conversions: 28, rate: 7.47 },
          variant_b: { views: 250, conversions: 16, rate: 6.4 }
        }
      })
    }
    
    loadAnalytics()
  }, [testId])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">A/B测试分析 - {testId}</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalViews}</div>
          <div className="text-sm text-gray-600">总访问量</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{analytics.conversions}</div>
          <div className="text-sm text-gray-600">转化数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{analytics.conversionRate}%</div>
          <div className="text-sm text-gray-600">转化率</div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(analytics.variants).map(([variant, data]) => (
          <div key={variant} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 capitalize">{variant}</span>
              <span className="text-sm text-gray-600">{data.rate}% 转化率</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{data.views} 访问</span>
              <span>{data.conversions} 转化</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${(data.conversions / data.views) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
