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

// 语言切换Hook - 已禁用，只支持英文
export function useLanguageSwitcher() {
  return {
    currentLocale: 'en',
    isChanging: false,
    changeLanguage: async () => {
      console.log('Language switching is disabled - English only')
    }
  }
}
