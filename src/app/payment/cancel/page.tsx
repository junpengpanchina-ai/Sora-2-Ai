'use client'

import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function PaymentCancelPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <Icon name="x" className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              支付已取消
            </h1>
            <p className="text-gray-600">
              您的支付已被取消，没有产生任何费用。
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">需要帮助？</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 查看我们的定价方案</li>
                <li>• 联系客服获取支持</li>
                <li>• 了解我们的服务优势</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="flex-1">
                <Button className="w-full" size="lg">
                  查看定价
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  返回控制台
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              如果您遇到技术问题，请联系我们的技术支持团队
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
