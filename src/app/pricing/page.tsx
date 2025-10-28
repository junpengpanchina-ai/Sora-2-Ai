'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/stripe'
import Link from 'next/link'
import ABTest, { ABTestConfigs } from '@/components/ui/ABTest'
import Personalization from '@/components/ui/Personalization'
import UsageStats from '@/components/ui/UsageStats'

export default function PricingPage() {
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('solo')

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!session) {
      // 重定向到登录页面
      window.location.href = '/auth/signin'
      return
    }

    // 所有方案都需要登录后订阅

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: SUBSCRIPTION_PLANS[plan].priceId,
          plan: plan,
          locale: 'zh', // 支持本地化
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('订阅失败:', error)
    }
  }

  const handleManageSubscription = async () => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('打开客户门户失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和说明 */}
        <div className="text-center mb-16">
          <div className="relative">
            <ABTest {...ABTestConfigs.pricingPageTitle} />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            选择适合您的AI视频生成方案。所有方案都包含<strong className="text-green-600">3天免费试用</strong>，让您充分体验我们的AI技术。
          </p>
          {session && (
            <div className="mt-8">
              <button 
                onClick={handleManageSubscription}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                管理我的订阅
              </button>
            </div>
          )}
        </div>

        {/* 个性化推荐 */}
        <div className="mb-16">
          <Personalization />
        </div>

        {/* 定价方案 - Memelord风格双方案 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 添加装饰性背景元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div 
              key={key}
              className={`bg-white rounded-3xl border shadow-xl hover:shadow-2xl p-8 relative transition-all duration-500 group ${
                key === 'teams' 
                  ? 'border-2 border-blue-500 scale-105 shadow-blue-100 hover:scale-110' 
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
            >
              {key === 'teams' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    推荐方案
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  ${plan.price}
                  <span className="text-2xl text-gray-500 font-normal">/月</span>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {plan.trialDays}天免费试用
                </div>

                <ul className="space-y-3 text-gray-600 mb-8 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(key as SubscriptionPlan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    key === 'teams'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
                  }`}
                >
                  开始{plan.trialDays}天免费试用
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 用户评价和案例展示 */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              用户评价和成功案例
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              看看其他创作者如何使用我们的AI视频生成技术创造精彩内容
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 用户评价卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  张
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">张小明</h4>
                  <p className="text-sm text-gray-500">内容创作者</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "使用Sora Solo后，我的视频制作效率提升了300%。AI智能剪辑功能让我能够专注于创意，而不是技术细节。"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  李
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">李华</h4>
                  <p className="text-sm text-gray-500">营销经理</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "Sora Teams的团队协作功能让我们整个营销团队都能高效制作视频内容。API接口也让我们能够集成到现有工作流中。"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  王
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">王芳</h4>
                  <p className="text-sm text-gray-500">自媒体博主</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic">
                "4K画质和AI配音功能让我的视频质量有了质的飞跃。粉丝们都夸我的内容越来越专业了！"
              </p>
            </div>
          </div>

          {/* 成功案例数据展示 */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">用户成功数据</h4>
              <p className="text-gray-600">真实用户使用我们的AI视频生成技术取得的成果</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">月活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500万+</div>
                <div className="text-gray-600">AI视频生成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">用户满意度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">300%</div>
                <div className="text-gray-600">效率提升</div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用统计 - 仅对已登录用户显示 */}
        {session && (
          <div className="mt-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">您的使用统计</h3>
              <p className="text-gray-600">了解您的AI视频生成使用情况</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <UsageStats userId={session.user?.id} plan={selectedPlan} />
            </div>
          </div>
        )}

        {/* Membership Comparison Table */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Membership Feature Comparison
          </h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Starter
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bronze
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Silver
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gold
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diamond
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Videos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">30</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">60</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">120</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">200</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Video Duration
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">5s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">5s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15s</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Video Quality
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">720p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">720p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1080p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4K</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Support
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Community</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Priority</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Dedicated</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Dedicated</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Account Manager</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    API Access
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Enterprise API</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Points Rewards
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. After cancellation, you can still use the service until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you support?
              </h3>
              <p className="text-gray-600">
                We support all major credit cards, debit cards, and digital wallet payments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does video generation take?
              </h3>
              <p className="text-gray-600">
                Typically, 5-15 second videos take 1-3 minutes to generate, depending on the complexity of the video.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide API access?
              </h3>
              <p className="text-gray-600">
                Silver members and above get API access, while Diamond members get enterprise-level API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}