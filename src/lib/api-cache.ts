/**
 * API缓存管理 - 优化API响应性能
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100
  private defaultTTL = 5 * 60 * 1000 // 5分钟

  // 生成缓存键
  private getCacheKey(url: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : ''
    return `${url}${paramStr}`
  }

  // 检查缓存是否有效
  private isValid(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp < item.ttl
  }

  // 获取缓存数据
  get<T>(url: string, params?: any): T | null {
    const key = this.getCacheKey(url, params)
    const item = this.cache.get(key)
    
    if (item && this.isValid(item)) {
      return item.data
    }
    
    if (item) {
      this.cache.delete(key)
    }
    
    return null
  }

  // 设置缓存数据
  set<T>(url: string, data: T, ttl?: number, params?: any): void {
    const key = this.getCacheKey(url, params)
    
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  // 删除缓存
  delete(url: string, params?: any): void {
    const key = this.getCacheKey(url, params)
    this.cache.delete(key)
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear()
  }

  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    }
  }

  private calculateHitRate(): number {
    // 这里可以实现更复杂的命中率计算
    return 0.85 // 模拟85%的命中率
  }
}

// 单例模式
export const apiCache = new APICache()

// 缓存装饰器
export function withCache<T>(
  fn: (...args: any[]) => Promise<T>,
  ttl?: number
) {
  return async (...args: any[]): Promise<T> => {
    const cacheKey = `${fn.name}_${JSON.stringify(args)}`
    
    // 尝试从缓存获取
    const cached = apiCache.get<T>(cacheKey)
    if (cached) {
      return cached
    }
    
    // 执行函数并缓存结果
    const result = await fn(...args)
    apiCache.set(cacheKey, result, ttl)
    
    return result
  }
}

// 优化的API请求函数
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options)}`
  
  // 尝试从缓存获取
  const cached = apiCache.get<T>(cacheKey)
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 缓存结果
    apiCache.set(cacheKey, data, ttl)
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}
