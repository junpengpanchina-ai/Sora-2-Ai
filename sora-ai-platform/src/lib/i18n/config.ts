/**
 * 现代化i18n配置
 * 基于《Next.js Internationalization Guide》最佳实践
 */

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en'] as const
export type Locale = (typeof locales)[number]

// 翻译命名空间
export const TRANSLATION_NAMESPACES = [
  'common',
  'auth', 
  'nav',
  'home',
  'generate',
  'dashboard',
  'mvp',
  'errors',
  'validation'
] as const

export type TranslationNamespace = typeof TRANSLATION_NAMESPACES[number]

// 现代化翻译加载器
async function loadModernTranslations(locale: string) {
  const messages: Record<string, any> = {}
  
  // 并行加载所有命名空间
  const loadPromises = TRANSLATION_NAMESPACES.map(async (namespace) => {
    try {
      const module = await import(`../../messages/${locale}/${namespace}.json`)
      return { namespace, translations: module.default }
    } catch (error) {
      console.warn(`Failed to load ${locale}/${namespace}:`, error)
      
      // 回退到英文
      if (locale !== 'en') {
        try {
          const fallbackModule = await import(`../../messages/en/${namespace}.json`)
          return { namespace, translations: fallbackModule.default }
        } catch (fallbackError) {
          console.error(`Failed to load fallback for ${namespace}:`, fallbackError)
          return { namespace, translations: {} }
        }
      }
      
      return { namespace, translations: {} }
    }
  })
  
  const results = await Promise.all(loadPromises)
  
  // 构建消息对象
  results.forEach(({ namespace, translations }) => {
    messages[namespace] = translations
  })
  
  return messages
}

// 传统翻译加载器（兼容性）
async function loadLegacyTranslations(locale: string) {
  try {
    const module = await import(`../../messages/${locale}.json`)
    return module.default
  } catch (error) {
    console.warn(`Failed to load legacy translations for ${locale}:`, error)
    return {}
  }
}

// 智能翻译加载器
async function loadTranslations(locale: string) {
  // 首先尝试现代化模块化翻译
  try {
    const modernTranslations = await loadModernTranslations(locale)
    if (Object.keys(modernTranslations).length > 0) {
      return modernTranslations
    }
  } catch (error) {
    console.warn(`Modern translations failed for ${locale}:`, error)
  }
  
  // 回退到传统翻译
  try {
    const legacyTranslations = await loadLegacyTranslations(locale)
    return legacyTranslations
  } catch (error) {
    console.error(`All translation loading failed for ${locale}:`, error)
    return {}
  }
}

export default getRequestConfig(async ({ locale }) => {
  // 只支持英文，忽略语言参数
  const defaultLocale = 'en'
  
  let messages = {}
  
  try {
    console.log(`Loading English translations`)
    
    const common = await import(`../../messages/en/common.json`)
    const auth = await import(`../../messages/en/auth.json`)
    const nav = await import(`../../messages/en/nav.json`)
    const errors = await import(`../../messages/en/errors.json`)
    const validation = await import(`../../messages/en/validation.json`)
    const home = await import(`../../messages/en/home.json`)
    const generate = await import(`../../messages/en/generate.json`)
    const mvp = await import(`../../messages/en/mvp.json`)
    const pricing = await import(`../../messages/en/pricing.json`)
    const referral = await import(`../../messages/en/referral.json`)
    
    messages = {
      common: common.default,
      auth: auth.default,
      nav: nav.default,
      errors: errors.default,
      validation: validation.default,
      home: home.default,
      generate: generate.default,
      mvp: mvp.default,
      pricing: pricing.default,
      referral: referral.default
    }
    
    console.log(`Successfully loaded English translations:`, Object.keys(messages))
  } catch (error) {
    console.warn(`Failed to load English translations:`, error)
    messages = {}
  }
  
  return {
    messages,
    timeZone: 'UTC',
    now: new Date()
  }
})
