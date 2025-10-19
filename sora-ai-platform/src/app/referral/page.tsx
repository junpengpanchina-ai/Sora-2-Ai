'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

interface ReferralData {
  user: {
    referralCode: string
    referralCount: number
    freeVideosLeft: number
  }
  rewards: Array<{
    id: string
    rewardType: string
    rewardCount: number
    claimed: boolean
    createdAt: string
    referee: {
      name: string
      email: string
      createdAt: string
    }
  }>
}

export default function ReferralPage() {
  const { data: session } = useSession()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (session) {
      fetchReferralData()
    }
  }, [session])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral/rewards')
      const data = await response.json()
      setReferralData(data)
    } catch (error) {
      console.error('获取邀请数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReferralCode = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/referral/generate-code', {
        method: 'POST'
      })
      const data = await response.json()
      if (data.referralCode) {
        await fetchReferralData()
      }
    } catch (error) {
      console.error('生成邀请码失败:', error)
    } finally {
      setGenerating(false)
    }
  }

  const claimReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/referral/claim-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rewardId })
      })
      const data = await response.json()
      if (data.success) {
        await fetchReferralData()
        alert(data.message)
      } else {
        alert(data.error || '领取失败')
      }
    } catch (error) {
      console.error('领取奖励失败:', error)
      alert('领取失败')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
          <p className="text-gray-600 mb-6">登录后即可查看您的邀请奖励</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            立即登录
          </Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            邀请奖励中心
          </h1>
          <p className="text-xl text-gray-600">
            邀请好友注册，获得免费视频奖励
          </p>
        </div>

        {/* 邀请码和统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Icon name="gift" className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">我的邀请码</h3>
            {referralData?.user.referralCode ? (
              <div>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  {referralData.user.referralCode}
                </p>
                <p className="text-sm text-gray-600">
                  分享此邀请码给好友
                </p>
              </div>
            ) : (
              <Button 
                onClick={generateReferralCode}
                loading={generating}
                className="w-full"
              >
                生成邀请码
              </Button>
            )}
          </Card>

          <Card className="p-6 text-center">
            <Icon name="users" className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">邀请人数</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {referralData?.user.referralCount || 0}
            </p>
            <p className="text-sm text-gray-600">成功邀请的好友</p>
          </Card>

          <Card className="p-6 text-center">
            <Icon name="video" className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">剩余免费视频</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {referralData?.user.freeVideosLeft || 0}
            </p>
            <p className="text-sm text-gray-600">可生成视频数量</p>
          </Card>
        </div>

        {/* 邀请链接 */}
        {referralData?.user.referralCode && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">邀请链接</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={`${window.location.origin}/auth/signup?ref=${referralData.user.referralCode}`}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/auth/signup?ref=${referralData.user.referralCode}`)
                  alert('邀请链接已复制到剪贴板')
                }}
                variant="outline"
              >
                复制链接
              </Button>
            </div>
          </Card>
        )}

        {/* 奖励记录 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">奖励记录</h3>
          {referralData?.rewards.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="gift" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无奖励记录</p>
              <p className="text-sm text-gray-400 mt-2">
                邀请好友注册后，奖励将显示在这里
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {referralData?.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon 
                        name={reward.claimed ? "check-circle" : "gift"} 
                        className={`h-8 w-8 ${reward.claimed ? 'text-green-500' : 'text-yellow-500'}`} 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        邀请 {reward.referee.name || reward.referee.email} 注册
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(reward.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {reward.rewardCount}个{reward.rewardType === 'video_10s' ? '10秒' : '15秒'}视频
                      </p>
                      <p className={`text-sm ${reward.claimed ? 'text-green-600' : 'text-yellow-600'}`}>
                        {reward.claimed ? '已领取' : '待领取'}
                      </p>
                    </div>
                    {!reward.claimed && (
                      <Button
                        onClick={() => claimReward(reward.id)}
                        size="sm"
                      >
                        领取
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
