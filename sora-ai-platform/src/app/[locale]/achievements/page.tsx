'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { achievementSystem, USER_TIERS } from '@/lib/achievement-system'
import { viralEngine } from '@/lib/viral-engine'
import { useTranslations } from '@/hooks/useTranslations'

interface UserStats {
  totalVideos: number
  monthlyVideos: number
  referralCount: number
  socialShares: number
  totalLikes: number
  streakDays: number
  freeVideosLeft: number
}

export default function AchievementsPage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const [userStats, setUserStats] = useState<UserStats>({
    totalVideos: 0,
    monthlyVideos: 0,
    referralCount: 0,
    socialShares: 0,
    totalLikes: 0,
    streakDays: 0,
    freeVideosLeft: 0
  })
  const [achievements, setAchievements] = useState({
    unlocked: [],
    locked: [],
    totalPoints: 0
  })
  const [userTier, setUserTier] = useState(USER_TIERS[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserAchievements()
    }
  }, [session])

  const fetchUserAchievements = async () => {
    try {
      // 模拟用户数据
      const mockUserStats: UserStats = {
        totalVideos: 15,
        monthlyVideos: 8,
        referralCount: 3,
        socialShares: 12,
        totalLikes: 156,
        streakDays: 5,
        freeVideosLeft: 2
      }

      setUserStats(mockUserStats)
      
      // 使用成就系统计算成就
      const achievementData = achievementSystem.getUserAchievements(mockUserStats)
      setAchievements(achievementData)
      setUserTier(achievementData.userTier)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.errors('unauthorized')}</h2>
          <p className="text-gray-600 mb-6">{t.achievements('subtitle')}</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            {t.common('signin')}
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
          <p className="text-gray-600">{t.common('loading')}</p>
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
            {t.achievements('subtitle')}
          </p>
          
          {/* 等级进度条 */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t.achievements('userLevel')}</span>
              <span>{t.achievements('levels.silver.name')}</span>
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
              {t.achievements('achievementProgress')}
            </p>
          </div>
        </div>

        {/* 特权展示 */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.achievements('quickActions.title')}</h3>
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
        {achievements.unlocked.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.achievements('unlockedAchievements')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.unlocked.map((achievement: any) => (
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
                          {achievement.rewards.freeVideos ? t.achievements('rewards.freeVideos', { count: achievement.rewards.freeVideos }) : achievement.rewards.badges?.[0] || t.notifications('success')}
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
            {t.achievements('lockedAchievements')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.locked.map((achievement: any) => (
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
                        <span>{t.achievements('achievementProgress')}</span>
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
                        {achievement.rewards.freeVideos ? t.achievements('rewards.freeVideos', { count: achievement.rewards.freeVideos }) : achievement.rewards.badges?.[0] || t.notifications('success')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {achievement.maxProgress - achievement.progress}
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
              {t.mvp('quickActions.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.mvp('personalizedRecommendations')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/generate'}>
                {t.home('getStarted')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/referral'}>
                {t.referral('title')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
