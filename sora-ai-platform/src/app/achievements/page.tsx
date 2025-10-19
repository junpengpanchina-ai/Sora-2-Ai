'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { USER_TIERS, growthEngine } from '@/lib/growth-engine'

interface UserAchievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: Date
  reward: string
}

export default function AchievementsPage() {
  const { data: session } = useSession()
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [userTier, setUserTier] = useState(USER_TIERS[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserAchievements()
    }
  }, [session])

  const fetchUserAchievements = async () => {
    try {
      // 模拟获取用户成就数据
      const mockAchievements: UserAchievement[] = [
        {
          id: 'first_video',
          title: '初出茅庐',
          description: '生成第一个视频',
          icon: '🎬',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: new Date('2024-01-15'),
          reward: '获得1个免费视频'
        },
        {
          id: 'video_master',
          title: '视频大师',
          description: '生成10个视频',
          icon: '🎭',
          progress: 7,
          maxProgress: 10,
          unlocked: false,
          reward: '获得5个免费视频'
        },
        {
          id: 'social_butterfly',
          title: '社交达人',
          description: '分享10个视频到社交媒体',
          icon: '📱',
          progress: 3,
          maxProgress: 10,
          unlocked: false,
          reward: '获得专属分享工具'
        },
        {
          id: 'referral_king',
          title: '邀请之王',
          description: '成功邀请5个好友',
          icon: '👑',
          progress: 2,
          maxProgress: 5,
          unlocked: false,
          reward: '获得1个月专业版'
        },
        {
          id: 'streak_master',
          title: '连续创作',
          description: '连续7天创作视频',
          icon: '🔥',
          progress: 3,
          maxProgress: 7,
          unlocked: false,
          reward: '获得创作灵感包'
        },
        {
          id: 'quality_creator',
          title: '品质创作者',
          description: '获得100个点赞',
          icon: '⭐',
          progress: 45,
          maxProgress: 100,
          unlocked: false,
          reward: '获得金牌创作者认证'
        }
      ]

      setAchievements(mockAchievements)
      
      // 计算用户等级
      const monthlyVideos = 25 // 模拟数据
      const tier = growthEngine.calculateUserTier(monthlyVideos)
      setUserTier(tier)
    } catch (error) {
      console.error('获取成就数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h2>
          <p className="text-gray-600 mb-6">登录后即可查看您的成就和等级</p>
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

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 用户等级展示 */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl mb-4`}
               style={{ backgroundColor: userTier.color + '20' }}>
            {userTier.icon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {userTier.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            您已解锁专属特权，继续创作获得更多奖励！
          </p>
          
          {/* 等级进度条 */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>当前等级</span>
              <span>下一等级</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: '75%',
                  backgroundColor: userTier.color 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              距离下一等级还需 5 个视频
            </p>
          </div>
        </div>

        {/* 特权展示 */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">当前特权</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userTier.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Icon name="check" className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 已解锁成就 */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              已解锁成就 ({unlockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="p-6 border-green-200 bg-green-50">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">
                          {achievement.reward}
                        </span>
                        <span className="text-xs text-gray-500">
                          {achievement.unlockedAt?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 待解锁成就 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            待解锁成就 ({lockedAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl opacity-50">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {achievement.description}
                    </p>
                    
                    {/* 进度条 */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>进度</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {achievement.reward}
                      </span>
                      <span className="text-xs text-gray-400">
                        还需 {achievement.maxProgress - achievement.progress} 步
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 行动召唤 */}
        <div className="mt-12 text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              继续创作，解锁更多成就！
            </h3>
            <p className="text-gray-600 mb-6">
              每个成就都有独特的奖励，让您的创作之旅更加精彩
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/generate'}>
                立即创作
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/referral'}>
                邀请好友
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
