'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/stripe'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function PricingPage() {
  const t = useTranslations()
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
            {t.pricing('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.pricing('subtitle')}
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
                    {t.pricing('pro.popular')}
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
                  {plan.price > 0 && <span className="text-gray-600">/月</span>}
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
                      : key === 'free'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : ''
                  }`}
                  variant={key === 'pro' ? 'primary' : key === 'free' ? 'primary' : 'outline'}
                  size="lg"
                >
                  {key === 'free' 
                    ? t.pricing('basic.button')
                    : session 
                      ? (key === 'pro' ? t.pricing('pro.button') : t.pricing('enterprise.button'))
                      : t.pricing('cta.loginToSubscribe')}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 邀请奖励说明 */}
        <div className="mt-12 text-center">
          <Card className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Icon name="gift" className="h-8 w-8 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">{t.pricing('invitationReward.title')}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {t.pricing('invitationReward.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t.pricing('invitationReward.title')}</h4>
                <p className="text-sm text-gray-600">{t.pricing('invitationReward.newUserReward')}</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t.pricing('invitationReward.title')}</h4>
                <p className="text-sm text-gray-600">{t.pricing('invitationReward.referralRewards.0')}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t.pricing('invitationReward.title')}</h4>
                <p className="text-sm text-gray-600">{t.pricing('invitationReward.referralRewards.1')}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">{t.common('signup')}</Button>
              </Link>
              <Link href="/generate">
                <Button variant="outline" size="lg">{t.home('watchDemo')}</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t.pricing('faqTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.pricing('faq.cancelAnytime.q')}
              </h3>
              <p className="text-gray-600">
                {t.pricing('faq.cancelAnytime.a')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.pricing('faq.paymentMethods.q')}
              </h3>
              <p className="text-gray-600">
                {t.pricing('faq.paymentMethods.a')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.pricing('faq.generationTime.q')}
              </h3>
              <p className="text-gray-600">
                {t.pricing('faq.generationTime.a')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.pricing('faq.apiAvailability.q')}
              </h3>
              <p className="text-gray-600">
                {t.pricing('faq.apiAvailability.a')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
