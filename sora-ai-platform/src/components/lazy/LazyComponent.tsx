'use client'

import React, { Suspense, lazy } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// 懒加载组件
export const LazyAchievements = lazy(() => import('@/app/[locale]/achievements/page'))
export const LazyReferral = lazy(() => import('@/app/[locale]/referral/page'))
export const LazyGrowthDashboard = lazy(() => import('@/app/[locale]/dashboard/growth/page'))

// 懒加载包装器
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner size="lg" text="加载中..." />}>
      {children}
    </Suspense>
  )
}
