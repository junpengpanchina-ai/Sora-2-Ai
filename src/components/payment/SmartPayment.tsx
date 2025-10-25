'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

interface SavedPaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'digital_wallet'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: string
}

interface PaymentRecommendation {
  method: string
  reason: string
  confidence: number
  benefits: string[]
}

interface InstallmentTerm {
  id: string
  name: string
  months: number
  interestRate: number
  minAmount: number
  maxAmount: number
}

interface SmartPaymentProps {
  amount: number
  currency?: string
  description: string
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

export default function SmartPayment({ 
  amount, 
  currency = 'usd', 
  description, 
  onSuccess, 
  onError 
}: SmartPaymentProps) {
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([])
  const [recommendation, setRecommendation] = useState<PaymentRecommendation | null>(null)
  const [installmentOptions, setInstallmentOptions] = useState<InstallmentTerm[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [selectedInstallment, setSelectedInstallment] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 加载支付方式和推荐
  useEffect(() => {
    loadPaymentData()
  }, [amount, currency])

  const loadPaymentData = async () => {
    try {
      // 获取保存的支付方式
      const methodsResponse = await fetch('/api/payments/smart')
      if (methodsResponse.ok) {
        const methodsData = await methodsResponse.json()
        setSavedMethods(methodsData.savedMethods || [])
      }

      // 获取支付推荐
      const recommendationResponse = await fetch(
        `/api/payments/recommendation?amount=${amount}&currency=${currency}`
      )
      if (recommendationResponse.ok) {
        const recData = await recommendationResponse.json()
        setRecommendation(recData.recommendation)
        setInstallmentOptions(recData.installmentOptions || [])
        
        // 自动选择推荐的方法
        if (recData.recommendation) {
          setSelectedMethod(recData.recommendation.method)
        }
      }
    } catch (error) {
      console.error('加载支付数据错误:', error)
    }
  }

  const handleOneClickPayment = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/one-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description,
          paymentMethodId: selectedMethod || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess?.(data.paymentIntentId)
      } else {
        setError(data.error || '支付失败')
        onError?.(data.error || '支付失败')
      }
    } catch (error) {
      const errorMessage = '支付失败，请重试'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa': return 'credit-card'
      case 'mastercard': return 'credit-card'
      case 'amex': return 'credit-card'
      default: return 'credit-card'
    }
  }

  return (
    <div className="space-y-6">
      {/* 支付金额显示 */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{description}</h3>
            <p className="text-sm text-gray-600">支付金额</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatAmount(amount)}</div>
            <div className="text-sm text-gray-600">{currency.toUpperCase()}</div>
          </div>
        </div>
      </Card>

      {/* 智能推荐 */}
      {recommendation && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Icon name="lightbulb" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">智能推荐</h4>
              <p className="text-sm text-blue-700">{recommendation.reason}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendation.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 保存的支付方式 */}
      {savedMethods.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">选择支付方式</h4>
          <div className="space-y-2">
            {savedMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <Icon name={getCardIcon(method.brand)} className="w-5 h-5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">
                    {method.brand.toUpperCase()} •••• {method.last4}
                  </div>
                  <div className="text-sm text-gray-600">
                    过期时间: {method.expiryMonth}/{method.expiryYear}
                    {method.isDefault && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        默认
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 分期付款选项 */}
      {installmentOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">分期付款选项</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {installmentOptions.map((option) => {
              const monthlyAmount = amount / option.months
              const totalAmount = amount + (amount * option.interestRate / 100)
              
              return (
                <label
                  key={option.id}
                  className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedInstallment === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="installment"
                    value={option.id}
                    checked={selectedInstallment === option.id}
                    onChange={(e) => setSelectedInstallment(e.target.value)}
                    className="mb-2"
                  />
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-600">
                    每月 {formatAmount(monthlyAmount)}
                  </div>
                  {option.interestRate > 0 && (
                    <div className="text-xs text-red-600">
                      利率: {option.interestRate}%
                    </div>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 一键支付按钮 */}
      <Button
        onClick={handleOneClickPayment}
        disabled={isLoading || (!selectedMethod && savedMethods.length > 0)}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Icon name="credit-card" className="w-5 h-5 mr-2" />
            一键支付 {formatAmount(amount)}
          </>
        )}
      </Button>

      {/* 安全提示 */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Icon name="shield" className="w-4 h-4" />
        <span>您的支付信息受到256位SSL加密保护</span>
      </div>
    </div>
  )
}
