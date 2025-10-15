'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/stripe'
import Link from 'next/link'

export default function PricingPage() {
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('pro')

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!session) {
      // 重定向到登录页面
      window.location.href = '/auth/signin'
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            选择适合您的方案
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            灵活的定价方案，满足不同需求
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <Card 
              key={key} 
              className={`p-8 relative ${
                key === 'pro' 
                  ? 'ring-2 ring-primary-500 shadow-lg scale-105' 
                  : ''
              }`}
            >
              {key === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    推荐
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-600">/月</span>
                </div>

                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Icon name="check" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(key as SubscriptionPlan)}
                  className={`w-full ${
                    key === 'pro' 
                      ? 'bg-primary-600 hover:bg-primary-700' 
                      : ''
                  }`}
                  variant={key === 'pro' ? 'primary' : 'outline'}
                  size="lg"
                >
                  {session ? '立即订阅' : '登录后订阅'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 免费试用说明 */}
        <div className="mt-12 text-center">
          <Card className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Icon name="star" className="h-8 w-8 text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">免费试用</h3>
            </div>
            <p className="text-gray-600 mb-4">
              所有方案都提供7天免费试用，无需信用卡即可开始体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">开始免费试用</Button>
              </Link>
              <Link href="/generate">
                <Button variant="outline" size="lg">先体验功能</Button>
              </Link>
            </div>
          </Card>
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
                是的，您可以随时在账户设置中取消订阅，不会产生额外费用。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持信用卡、支付宝、微信支付等多种支付方式。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                视频生成需要多长时间？
              </h3>
              <p className="text-gray-600">
                通常需要1-3分钟，具体时间取决于视频长度和复杂度。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                有API接口吗？
              </h3>
              <p className="text-gray-600">
                企业版用户可以使用我们的API接口进行批量视频生成。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
