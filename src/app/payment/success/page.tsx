'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function PaymentSuccessPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // 这里可以调用API获取session详情
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证支付信息...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Icon name="check" className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              支付成功！
            </h1>
            <p className="text-gray-600">
              感谢您的订阅，您现在可以开始使用我们的服务了。
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">下一步</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 检查您的邮箱确认邮件</li>
                <li>• 开始创建您的第一个视频</li>
                <li>• 探索所有可用功能</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full" size="lg">
                  进入控制台
                </Button>
              </Link>
              <Link href="/generate" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  开始创作
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              如有任何问题，请联系我们的客服团队
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
