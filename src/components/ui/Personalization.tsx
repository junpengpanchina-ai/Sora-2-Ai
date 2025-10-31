'use client'

import React, { useState, useEffect } from 'react'
import { SUBSCRIPTION_PLANS } from '@/lib/plans'

interface PersonalizationProps {
  userProfile?: {
    industry?: string
    teamSize?: number
    budget?: number
    experience?: 'beginner' | 'intermediate' | 'expert'
    useCase?: string[]
  }
}

export default function Personalization({ userProfile }: PersonalizationProps) {
  const [recommendation, setRecommendation] = useState<{
    plan: 'solo' | 'teams'
    reason: string
    features: string[]
    confidence: number
  } | null>(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (userProfile) {
      analyzeUserProfile()
    }
  }, [userProfile])

  const analyzeUserProfile = async () => {
    setIsAnalyzing(true)
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const { industry, teamSize, budget, experience, useCase } = userProfile || {}
    
    let recommendedPlan: 'solo' | 'teams' = 'solo'
    let reason = ''
    let features: string[] = []
    let confidence = 0.8

    // 基于团队规模推荐
    if (teamSize && teamSize > 3) {
      recommendedPlan = 'teams'
      reason = '您的团队规模较大，Teams方案提供协作功能和更多额度'
      features = ['团队协作', 'API接口', '批量处理', '专属客户经理']
      confidence = 0.9
    } else if (budget && budget >= 200) {
      recommendedPlan = 'teams'
      reason = '基于您的预算，Teams方案能提供更好的ROI'
      features = ['更多视频额度', '高级功能', '优先支持']
      confidence = 0.85
    } else {
      recommendedPlan = 'solo'
      reason = 'Solo方案适合个人创作者，性价比最高'
      features = ['AI智能剪辑', '4K画质', '无水印导出']
      confidence = 0.8
    }

    // 基于行业调整推荐
    if (industry === 'marketing' || industry === 'advertising') {
      features.push('营销模板', 'A/B测试支持')
      confidence += 0.05
    } else if (industry === 'education') {
      features.push('教育模板', '批量生成')
      confidence += 0.05
    }

    setRecommendation({
      plan: recommendedPlan,
      reason,
      features,
      confidence
    })
    
    setIsAnalyzing(false)
  }

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-lg font-semibold text-gray-700">正在分析您的需求...</span>
          </div>
          <p className="text-gray-600 mt-2">我们的AI正在为您匹配最适合的方案</p>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">个性化推荐</h3>
        <p className="text-gray-600 mb-4">告诉我们您的需求，我们将为您推荐最适合的方案</p>
        <button 
          onClick={() => setUserProfile({
            industry: 'technology',
            teamSize: 2,
            budget: 100,
            experience: 'intermediate',
            useCase: ['marketing', 'social-media']
          })}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          开始个性化分析
        </button>
      </div>
    )
  }

  const plan = SUBSCRIPTION_PLANS[recommendation.plan]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">为您推荐</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">匹配度</span>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${recommendation.confidence * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold text-gray-900 ml-2">
            {Math.round(recommendation.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
          <span className="text-2xl font-bold text-blue-600">${plan.price}/月</span>
        </div>
        <p className="text-gray-600 mb-3">{recommendation.reason}</p>
        
        <div className="flex flex-wrap gap-2">
          {recommendation.features.map((feature, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          选择推荐方案
        </button>
        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          重新分析
        </button>
      </div>
    </div>
  )
}

// 辅助函数，实际项目中应该从用户数据中获取
function setUserProfile(profile: any) {
  // 这里应该调用实际的用户数据更新API
  console.log('Setting user profile:', profile)
}
