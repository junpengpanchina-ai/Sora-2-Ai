'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import ShareButton from '@/components/social/ShareButton'
import ViralTrigger from '@/components/growth/ViralTrigger'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { notificationManager } from '@/components/ui/Notification'
import { viralEngine } from '@/lib/viral-engine'

export default function MVPDashboard() {
  const { data: session } = useSession()
  const [userStats, setUserStats] = useState({
    totalVideos: 0,
    monthlyVideos: 0,
    referralCount: 0,
    freeVideosLeft: 0,
    userTier: 'bronze',
    achievements: []
  })
  const [socialProof, setSocialProof] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalShares: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      // 模拟用户数据
      setUserStats({
        totalVideos: 15,
        monthlyVideos: 8,
        referralCount: 3,
        freeVideosLeft: 2,
        userTier: 'silver',
        achievements: ['first_video', 'video_master']
      })
      
      // 获取社交证明数据
      const socialProofData = viralEngine.getSocialProof()
      setSocialProof(socialProofData)
    } catch (error) {
      console.error('获取用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: { name: '铜牌创作者', icon: '🥉', color: 'text-yellow-600' },
      silver: { name: '银牌创作者', icon: '🥈', color: 'text-gray-400' },
      gold: { name: '金牌创作者', icon: '🥇', color: 'text-yellow-500' },
      diamond: { name: '钻石创作者', icon: '💎', color: 'text-blue-400' }
    }
    return tiers[tier as keyof typeof tiers] || tiers.bronze
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">欢迎使用Sora AI</h2>
          <p className="text-gray-600 mb-6">登录后即可体验AI视频生成和增长功能</p>
          <Button onClick={() => window.location.href = '/auth/signin'} size="lg">
            立即登录
          </Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="加载用户数据..." />
      </div>
    )
  }

  const tierInfo = getTierInfo(userStats.userTier)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 欢迎横幅 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            欢迎回来，{session.user?.name}！
          </h1>
          <p className="text-xl text-gray-600">
            继续您的AI视频创作之旅
          </p>
        </div>

        {/* 用户等级卡片 */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{tierInfo.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{tierInfo.name}</h2>
                <p className="text-gray-600">您已生成 {userStats.totalVideos} 个视频</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">剩余免费视频</p>
              <p className="text-3xl font-bold text-primary-600">{userStats.freeVideosLeft}</p>
            </div>
          </div>
        </Card>

        {/* 核心功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 创作视频 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="video" className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">创作视频</h3>
            </div>
            <p className="text-gray-600 mb-4">使用AI生成高质量视频内容</p>
            <Button 
              onClick={() => {
                notificationManager.show({
                  type: 'info',
                  title: '开始创作',
                  message: '正在跳转到视频生成页面...'
                })
                window.location.href = '/generate'
              }}
              className="w-full"
            >
              立即创作
            </Button>
          </Card>

          {/* 邀请好友 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="users" className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">邀请好友</h3>
            </div>
            <p className="text-gray-600 mb-4">邀请好友获得免费视频奖励</p>
            <Button 
              onClick={() => window.location.href = '/referral'}
              variant="outline"
              className="w-full"
            >
              查看邀请
            </Button>
          </Card>

          {/* 成就系统 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="trophy" className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">成就系统</h3>
            </div>
            <p className="text-gray-600 mb-4">解锁成就获得专属奖励</p>
            <Button 
              onClick={() => window.location.href = '/achievements'}
              variant="outline"
              className="w-full"
            >
              查看成就
            </Button>
          </Card>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Icon name="video" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.totalVideos}</p>
            <p className="text-sm text-gray-500">总视频数</p>
          </Card>
          <Card className="p-6 text-center">
            <Icon name="calendar" className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.monthlyVideos}</p>
            <p className="text-sm text-gray-500">本月视频</p>
          </Card>
          <Card className="p-6 text-center">
            <Icon name="users" className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.referralCount}</p>
            <p className="text-sm text-gray-500">邀请人数</p>
          </Card>
          <Card className="p-6 text-center">
            <Icon name="gift" className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userStats.achievements.length}</p>
            <p className="text-sm text-gray-500">解锁成就</p>
          </Card>
        </div>

        {/* 社交证明 */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">社区活跃度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{socialProof.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-500">总用户数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{socialProof.totalVideos.toLocaleString()}</p>
              <p className="text-sm text-gray-500">总视频数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{socialProof.totalShares.toLocaleString()}</p>
              <p className="text-sm text-gray-500">总分享数</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">最近活动</h4>
            <div className="space-y-1">
              {socialProof.recentActivity.slice(0, 3).map((activity, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {activity.user} {activity.action}
                </p>
              ))}
            </div>
          </div>
        </Card>

        {/* 病毒式传播触发器 */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">个性化推荐</h3>
          <ViralTrigger />
        </Card>

        {/* 快速分享 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">分享您的创作</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-gray-600 mb-2">分享视频到社交媒体，获得更多曝光</p>
              <div className="flex space-x-2">
                <ShareButton 
                  videoId="demo123"
                  videoTitle="我的AI视频作品"
                  videoUrl="https://sora-ai.com/video/demo123"
                />
                <Button variant="outline" onClick={() => window.location.href = '/videos'}>
                  查看作品
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
