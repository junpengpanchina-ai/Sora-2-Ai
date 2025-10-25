'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'

interface UserProfile {
  id: string
  name: string
  email: string
  freeVideosLeft: number
  subscriptionPlan: string
  referralCode: string
  referralCount: number
  createdAt: string
}

export default function ProfilePage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProfile()
    }
  }, [status])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          name: data.user.name,
          email: data.user.email
        })
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setSuccess('资料更新成功！')
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        setError(errorData.message || '更新失败')
      }
    } catch (error) {
      setError('更新失败，请重试')
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">个人资料</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                返回仪表板
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 用户信息卡片 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      编辑资料
                    </Button>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                    {success}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">
                        姓名
                      </label>
                      <Input
                        id="profile-name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="请输入姓名"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱
                      </label>
                      <Input
                        id="profile-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="请输入邮箱"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button type="submit">
                        保存更改
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        取消
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">姓名</label>
                      <p className="mt-1 text-lg text-gray-900">{profile?.name || '未设置'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">邮箱</label>
                      <p className="mt-1 text-lg text-gray-900">{profile?.email || '未设置'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">注册时间</label>
                      <p className="mt-1 text-lg text-gray-900">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '未知'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* 侧边栏信息 */}
            <div className="space-y-6">
              {/* 账户状态 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">账户状态</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">订阅计划</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.subscriptionPlan === 'free' ? '免费版' : profile?.subscriptionPlan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">剩余免费视频</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.freeVideosLeft || 0} 个
                    </span>
                  </div>
                </div>
              </Card>

              {/* 推荐信息 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐信息</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      我的推荐码
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="profile-referralCode"
                        name="referralCode"
                        value={profile?.referralCode || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(profile?.referralCode || '')
                          setSuccess('推荐码已复制到剪贴板！')
                        }}
                      >
                        复制
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">推荐人数</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.referralCount || 0} 人
                    </span>
                  </div>
                </div>
              </Card>

              {/* 快速操作 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => router.push('/generate')}
                  >
                    生成视频
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/videos')}
                  >
                    查看我的视频
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/pricing')}
                  >
                    升级订阅
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
