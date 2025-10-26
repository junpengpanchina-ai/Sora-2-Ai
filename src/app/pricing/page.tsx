'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/stripe'
import Link from 'next/link'

export default function PricingPage() {
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('gold')

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!session) {
      // 重定向到登录页面
      window.location.href = '/auth/signin'
      return
    }

    // 免费版需要邀请码，跳转到注册页面
    if (plan === 'free') {
      window.location.href = '/auth/signup?plan=free'
      return
    }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和说明 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            简单透明的定价
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            为您的创作需求选择完美方案。所有方案都包含我们的核心AI视频生成技术。
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

        {/* 定价方案 - 5个会员体系 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div 
              key={key}
              className={`bg-white rounded-2xl border shadow-sm p-6 relative ${
                key === 'gold' 
                  ? 'border-2 border-yellow-500' 
                  : 'border-gray-200'
              }`}
            >
              {key === 'gold' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    推荐方案
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {plan.price === 0 ? '$0' : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-lg text-gray-500">/月</span>}
                </div>

                <ul className="space-y-2 text-gray-600 mb-6 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(key as SubscriptionPlan)}
                  className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 text-base w-full ${
                    key === 'gold' 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm hover:shadow-md' 
                      : key === 'free'
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
                  }`}
                >
                  {key === 'free' 
                    ? '获取邀请码'
                    : session 
                      ? (key === 'gold' ? '选择黄金会员' : 
                         key === 'bronze' ? '选择青铜会员' : 
                         key === 'silver' ? '选择白银会员' : 
                         key === 'diamond' ? '选择钻石会员' : '联系销售')
                      : '登录订阅'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 会员对比表 */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            会员功能对比
          </h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    功能
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    体验版
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    青铜会员
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    白银会员
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    黄金会员
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    钻石会员
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    月视频数量
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10个</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">30个</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">60个</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">120个</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">200个</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    视频时长
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">5秒</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">5秒</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10秒</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15秒</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">15秒</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    视频质量
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">720p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">720p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1080p</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4K</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    客服支持
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">社区</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">优先</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">专属</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">专属</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">客户经理</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    API访问
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">❌</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">✅</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">企业API</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    积分奖励
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
            常见问题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                可以随时取消订阅吗？
              </h3>
              <p className="text-gray-600">
                是的，您可以随时取消订阅。取消后，您仍可使用到当前计费周期结束。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持所有主要信用卡、借记卡和数字钱包支付。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                视频生成需要多长时间？
              </h3>
              <p className="text-gray-600">
                通常5-15秒的视频需要1-3分钟生成，具体时间取决于视频复杂度。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                是否提供API访问？
              </h3>
              <p className="text-gray-600">
                白银会员及以上提供API访问，钻石会员提供企业级API。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}