'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SUPPORTED_LANGUAGES, TranslationNamespace, TranslationState, TranslationActions, TranslationContextType } from './core'

// 翻译上下文
const TranslationContext = createContext<TranslationContextType | null>(null)

// 翻译提供者组件
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TranslationState>({
    locale: 'en',
    isLoading: false,
    isChanging: false,
    error: null,
    cache: {}
  })

  // 加载翻译文件
  const loadTranslations = useCallback(async (locale: string, namespace: TranslationNamespace) => {
    try {
      const translations = await import(`../../messages/${locale}/${namespace}.json`)
      return translations.default
    } catch (error) {
      console.warn(`Failed to load ${locale}/${namespace}:`, error)
      // 回退到英文
      if (locale !== 'en') {
        try {
          const fallbackTranslations = await import(`../../messages/en/${namespace}.json`)
          return fallbackTranslations.default
        } catch (fallbackError) {
          console.error(`Failed to load fallback translation for ${namespace}:`, fallbackError)
          return {}
        }
      }
      return {}
    }
  }, [])

  // 获取翻译
  const getTranslation = useCallback((
    namespace: TranslationNamespace, 
    key: string, 
    params?: Record<string, any>
  ): string => {
    const translations = state.cache[state.locale]?.[namespace]
    if (!translations) {
      return key
    }

    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    if (typeof value !== 'string') {
      return key
    }

    // 参数替换
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match
      })
    }
    
    return value
  }, [state.cache, state.locale])

  // 格式化日期
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === state.locale)
    return new Intl.DateTimeFormat(state.locale, {
      ...options,
      ...(language?.dateFormat && { dateStyle: 'short' })
    }).format(date)
  }, [state.locale])

  // 格式化数字
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === state.locale)
    return new Intl.NumberFormat(state.locale, {
      ...language?.numberFormat,
      ...options
    }).format(number)
  }, [state.locale])

  // 格式化货币
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === state.locale)
    return new Intl.NumberFormat(state.locale, {
      style: 'currency',
      currency: currency || language?.currency || 'USD'
    }).format(amount)
  }, [state.locale])

  // 预加载翻译
  const preloadTranslations = useCallback(async (locale: string, namespaces: TranslationNamespace[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const promises = namespaces.map(async (namespace) => {
        const translations = await loadTranslations(locale, namespace)
        return { namespace, translations }
      })
      
      const results = await Promise.all(promises)
      
      setState(prev => ({
        ...prev,
        cache: {
          ...prev.cache,
          [locale]: {
            ...prev.cache[locale],
            ...results.reduce((acc, { namespace, translations }) => {
              acc[namespace] = translations
              return acc
            }, {} as Record<string, any>)
          }
        },
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load translations'
      }))
    }
  }, [loadTranslations])

  // 切换语言
  const changeLanguage = useCallback(async (locale: string) => {
    if (locale === state.locale) return

    setState(prev => ({ ...prev, isChanging: true, error: null }))

    try {
      // 预加载新语言的翻译
      await preloadTranslations(locale, ['common', 'nav', 'auth'])
      
      // 更新语言
      setState(prev => ({ ...prev, locale, isChanging: false }))
      
      // 设置Cookie
      document.cookie = `LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
      
      // 触发语言变化事件
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { locale, previousLocale: state.locale }
      }))
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isChanging: false,
        error: error instanceof Error ? error.message : 'Failed to change language'
      }))
    }
  }, [state.locale, preloadTranslations])

  // 初始化
  useEffect(() => {
    const initializeTranslations = async () => {
      const savedLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('LOCALE='))
        ?.split('=')[1] || 'en'
      
      await preloadTranslations(savedLocale, ['common', 'nav', 'auth'])
      setState(prev => ({ ...prev, locale: savedLocale }))
    }
    
    initializeTranslations()
  }, [preloadTranslations])

  const actions: TranslationActions = {
    changeLanguage,
    preloadTranslations,
    getTranslation,
    formatDate,
    formatNumber,
    formatCurrency
  }

  return (
    <TranslationContext.Provider value={{ state, actions }}>
      {children}
    </TranslationContext.Provider>
  )
}

// 使用翻译的Hook
export function useTranslations() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationProvider')
  }
  
  return context
}

// 命名空间翻译Hook
export function useNamespaceTranslations(namespace: TranslationNamespace) {
  const { state, actions } = useTranslations()
  
  const t = useCallback((key: string, params?: Record<string, any>) => {
    return actions.getTranslation(namespace, key, params)
  }, [actions, namespace])
  
  return { t, ...state }
}
