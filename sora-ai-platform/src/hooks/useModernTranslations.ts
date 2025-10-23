'use client'

import { useTranslations as useNextIntlTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

/**
 * 简化的翻译Hook
 * 直接使用next-intl
 */

// 通用翻译Hook
export function useCommonTranslations() {
  const t = useNextIntlTranslations('common')
  return { t }
}

// 认证翻译Hook
export function useAuthTranslations() {
  const t = useNextIntlTranslations('auth')
  return { t }
}

// 导航翻译Hook
export function useNavTranslations() {
  const t = useNextIntlTranslations('nav')
  return { t }
}

// 首页翻译Hook
export function useHomeTranslations() {
  const t = useNextIntlTranslations('home')
  return { t }
}

// 生成页面翻译Hook
export function useGenerateTranslations() {
  const t = useNextIntlTranslations('generate')
  return { t }
}

// 仪表板翻译Hook
export function useDashboardTranslations() {
  const t = useNextIntlTranslations('dashboard')
  return { t }
}

// MVP翻译Hook
export function useMVPTranslations() {
  const t = useNextIntlTranslations('mvp')
  return { t }
}

// 错误翻译Hook
export function useErrorTranslations() {
  const t = useNextIntlTranslations('errors')
  return { t }
}

// 验证翻译Hook
export function useValidationTranslations() {
  const t = useNextIntlTranslations('validation')
  return { t }
}

// 语言切换Hook
export function useLanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isChanging, setIsChanging] = useState(false)
  
  // 从路径中提取当前语言
  const currentLocale = pathname.split('/')[1] || 'en'
  
  const changeLanguage = useCallback(async (locale: string) => {
    if (locale === currentLocale || isChanging) return
    
    setIsChanging(true)
    
    try {
      // 构建新的路径
      const segments = pathname.split('/')
      segments[1] = locale
      const newPath = segments.join('/')
      
      // 使用 router.push 进行导航
      await router.push(newPath)
    } catch (error) {
      console.error('Language change failed:', error)
    } finally {
      setIsChanging(false)
    }
  }, [router, pathname, currentLocale, isChanging])
  
  return {
    currentLocale,
    isChanging,
    changeLanguage
  }
}
