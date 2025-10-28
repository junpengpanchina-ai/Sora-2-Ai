'use client'

import React, { useState, useEffect } from 'react'

interface UsageStatsProps {
  userId?: string
  plan?: 'solo' | 'teams'
}

export default function UsageStats({ userId, plan }: UsageStatsProps) {
  const [stats, setStats] = useState({
    videosGenerated: 0,
    videosRemaining: 0,
    totalDuration: 0,
    averageQuality: 0,
    monthlyUsage: 0,
    efficiencyScore: 0
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟数据加载
    const loadStats = async () => {
      setIsLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        videosGenerated: Math.floor(Math.random() * 50) + 10,
        videosRemaining: plan === 'teams' ? 200 - Math.floor(Math.random() * 50) : 50 - Math.floor(Math.random() * 20),
        totalDuration: Math.floor(Math.random() * 1000) + 500,
        averageQuality: 4.2 + Math.random() * 0.6,
        monthlyUsage: Math.floor(Math.random() * 80) + 20,
        efficiencyScore: Math.floor(Math.random() * 30) + 70
      })
      
      setIsLoading(false)
    }

    loadStats()
  }, [plan])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">使用统计</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 视频生成数量 */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已生成视频</p>
              <p className="text-2xl font-bold text-blue-600">{stats.videosGenerated}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 剩余额度 */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">剩余额度</p>
              <p className="text-2xl font-bold text-green-600">{stats.videosRemaining}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 总时长 */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总时长</p>
              <p className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalDuration / 60)}分钟</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 效率评分 */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">效率评分</p>
              <p className="text-2xl font-bold text-orange-600">{stats.efficiencyScore}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 月度使用趋势 */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">月度使用趋势</h4>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">本月使用率</span>
            <span className="text-sm font-semibold text-gray-900">{stats.monthlyUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${stats.monthlyUsage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 质量评分 */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">平均质量评分</span>
          <span className="text-sm font-semibold text-gray-900">{stats.averageQuality.toFixed(1)}/5.0</span>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(stats.averageQuality) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
