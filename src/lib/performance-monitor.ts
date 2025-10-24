/**
 * 性能监控 - 监控应用性能指标
 */

import React from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  totalBlockingTime: number
  apiResponseTime: number
  memoryUsage: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    totalBlockingTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0
  }

  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
    this.measurePageLoad()
  }

  // 初始化性能观察器
  private initializeObservers() {
    // 观察导航时间
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.loadEventStart
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)

      // 观察绘制时间
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)

      // 观察布局偏移
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  // 测量页面加载时间
  private measurePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.metrics.pageLoadTime = performance.now()
        this.measureMemoryUsage()
      })
    }
  }

  // 测量内存使用
  private measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
    }
  }

  // 测量API响应时间
  measureAPIResponse<T>(apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    
    return apiCall().then((result) => {
      const endTime = performance.now()
      this.metrics.apiResponseTime = endTime - startTime
      return result
    }).catch((error) => {
      const endTime = performance.now()
      this.metrics.apiResponseTime = endTime - startTime
      throw error
    })
  }

  // 获取性能指标
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // 获取性能评分
  getPerformanceScore(): number {
    const { pageLoadTime, firstContentfulPaint, cumulativeLayoutShift } = this.metrics
    
    let score = 100
    
    // 页面加载时间评分 (目标: < 3秒)
    if (pageLoadTime > 3000) score -= 20
    else if (pageLoadTime > 2000) score -= 10
    
    // 首次内容绘制评分 (目标: < 1.5秒)
    if (firstContentfulPaint > 1500) score -= 20
    else if (firstContentfulPaint > 1000) score -= 10
    
    // 累积布局偏移评分 (目标: < 0.1)
    if (cumulativeLayoutShift > 0.25) score -= 20
    else if (cumulativeLayoutShift > 0.1) score -= 10
    
    return Math.max(0, score)
  }

  // 获取性能建议
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = []
    const { pageLoadTime, firstContentfulPaint, cumulativeLayoutShift, memoryUsage } = this.metrics
    
    if (pageLoadTime > 3000) {
      recommendations.push('页面加载时间过长，建议优化资源加载')
    }
    
    if (firstContentfulPaint > 1500) {
      recommendations.push('首次内容绘制时间过长，建议优化关键渲染路径')
    }
    
    if (cumulativeLayoutShift > 0.25) {
      recommendations.push('布局偏移严重，建议为图片和广告预留空间')
    }
    
    if (memoryUsage > 50) {
      recommendations.push('内存使用过高，建议检查内存泄漏')
    }
    
    if (this.metrics.apiResponseTime > 1000) {
      recommendations.push('API响应时间过长，建议优化后端性能')
    }
    
    return recommendations
  }

  // 清理观察器
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 单例模式
export const performanceMonitor = new PerformanceMonitor()

// React Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)
  const [score, setScore] = React.useState<number>(0)
  const [recommendations, setRecommendations] = React.useState<string[]>([])

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics())
      setScore(performanceMonitor.getPerformanceScore())
      setRecommendations(performanceMonitor.getPerformanceRecommendations())
    }

    // 初始更新
    updateMetrics()

    // 定期更新
    const interval = setInterval(updateMetrics, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return { metrics, score, recommendations }
}
