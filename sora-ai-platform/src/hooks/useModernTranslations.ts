'use client'

import { useTranslations, useNamespaceTranslations } from '@/lib/i18n/TranslationProvider'
import { TranslationNamespace } from '@/lib/i18n/core'

/**
 * 现代化翻译Hook
 * 基于《React i18n Best Practices》设计
 */

// 通用翻译Hook
export function useCommonTranslations() {
  return useNamespaceTranslations('common')
}

// 认证翻译Hook
export function useAuthTranslations() {
  return useNamespaceTranslations('auth')
}

// 导航翻译Hook
export function useNavTranslations() {
  return useNamespaceTranslations('nav')
}

// 首页翻译Hook
export function useHomeTranslations() {
  return useNamespaceTranslations('home')
}

// 生成页面翻译Hook
export function useGenerateTranslations() {
  return useNamespaceTranslations('generate')
}

// 仪表板翻译Hook
export function useDashboardTranslations() {
  return useNamespaceTranslations('dashboard')
}

// MVP翻译Hook
export function useMVPTranslations() {
  return useNamespaceTranslations('mvp')
}

// 错误翻译Hook
export function useErrorTranslations() {
  return useNamespaceTranslations('errors')
}

// 验证翻译Hook
export function useValidationTranslations() {
  return useNamespaceTranslations('validation')
}

// 高级翻译Hook - 支持多个命名空间
export function useMultiNamespaceTranslations(namespaces: TranslationNamespace[]) {
  const { state, actions } = useTranslations()
  
  const getTranslations = (namespace: TranslationNamespace) => {
    return (key: string, params?: Record<string, any>) => {
      return actions.getTranslation(namespace, key, params)
    }
  }
  
  const translations = namespaces.reduce((acc, namespace) => {
    acc[namespace] = getTranslations(namespace)
    return acc
  }, {} as Record<TranslationNamespace, (key: string, params?: Record<string, any>) => string>)
  
  return {
    ...translations,
    ...state,
    actions
  }
}

// 格式化Hook
export function useFormatters() {
  const { actions } = useTranslations()
  
  return {
    formatDate: actions.formatDate,
    formatNumber: actions.formatNumber,
    formatCurrency: actions.formatCurrency
  }
}

// 语言切换Hook
export function useLanguageSwitcher() {
  const { state, actions } = useTranslations()
  
  return {
    currentLocale: state.locale,
    isChanging: state.isChanging,
    isLoading: state.isLoading,
    error: state.error,
    changeLanguage: actions.changeLanguage,
    preloadTranslations: actions.preloadTranslations
  }
}
