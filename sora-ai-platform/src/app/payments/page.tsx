'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Payment {
  id: string
  stripePaymentId: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  description: string
  plan: string
  billingPeriod: string
  refundedAmount: number
  refundedAt: string | null
  refundReason: string | null
  createdAt: string
  paidAt: string | null
}

interface PaymentStats {
  totalAmount: number
  totalRefunded: number
  netAmount: number
  totalPayments: number
  successRate: number
}

export default function PaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter) params.append('status', statusFilter)
      if (planFilter) params.append('plan', planFilter)

      const response = await fetch(`/api/payments?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPayments(data.payments)
        setStats(data.stats)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('获取支付记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchPayments()
    }
  }, [session, page, statusFilter, planFilter])

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-orange-600 bg-orange-100'
      case 'canceled': return 'text-gray-600 bg-gray-100'
      case 'disputed': return 'text-purple-600 bg-purple-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'succeeded': return '支付成功'
      case 'failed': return '支付失败'
      case 'refunded': return '已退款'
      case 'canceled': return '已取消'
      case 'disputed': return '争议中'
      case 'pending': return '处理中'
      default: return status
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600">您需要登录才能查看支付记录</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">支付记录</h1>
          <p className="mt-2 text-gray-600">查看您的所有支付和退款记录</p>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-500">总支付金额</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(stats.totalAmount, 'cny')}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-500">已退款金额</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatAmount(stats.totalRefunded, 'cny')}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-500">净收入</div>
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(stats.netAmount, 'cny')}
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-gray-500">成功率</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.successRate.toFixed(1)}%
              </div>
            </Card>
          </div>
        )}

        {/* 过滤器 */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态筛选
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">全部状态</option>
                <option value="succeeded">支付成功</option>
                <option value="failed">支付失败</option>
                <option value="refunded">已退款</option>
                <option value="canceled">已取消</option>
                <option value="disputed">争议中</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                计划筛选
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">全部计划</option>
                <option value="basic">基础版</option>
                <option value="pro">专业版</option>
                <option value="enterprise">企业版</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setStatusFilter('')
                  setPlanFilter('')
                  setPage(1)
                }}
                variant="outline"
              >
                重置筛选
              </Button>
            </div>
          </div>
        </Card>

        {/* 支付记录列表 */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">暂无支付记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支付信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金额
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      计划
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支付时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {payment.stripePaymentId.slice(-8)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </div>
                        {payment.refundedAmount > 0 && (
                          <div className="text-sm text-orange-600">
                            已退款: {formatAmount(payment.refundedAmount, payment.currency)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                        {payment.refundReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {payment.refundReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.plan} ({payment.billingPeriod})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // 这里可以添加查看详情的功能
                            console.log('查看详情:', payment.id)
                          }}
                        >
                          详情
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  下一页
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    第 <span className="font-medium">{page}</span> 页，共{' '}
                    <span className="font-medium">{totalPages}</span> 页
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="rounded-l-md"
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-r-md"
                    >
                      下一页
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
