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
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your creative needs. All plans include our core AI video generation technology.
          </p>
          {session && (
            <div className="mt-8">
              <button 
                onClick={handleManageSubscription}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage My Subscription
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
                    ? 'Get Invitation Code'
                    : session 
                      ? (key === 'gold' ? 'Choose Gold Member' : 
                         key === 'bronze' ? 'Choose Bronze Member' : 
                         key === 'silver' ? 'Choose Silver Member' : 
                         key === 'diamond' ? 'Choose Diamond Member' : 'Contact Sales')
                      : 'Login to Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>

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