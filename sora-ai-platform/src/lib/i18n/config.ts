/**
 * 现代化i18n配置
 * 基于《Next.js Internationalization Guide》最佳实践
 */

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'zh'] as const
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
  // 验证语言参数
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // 简化翻译加载 - 使用静态导入
  let messages = {}
  
  try {
    // 尝试加载模块化翻译
    console.log(`Loading translations for locale: ${locale}`)
    
    const common = await import(`../../messages/${locale}/common.json`)
    const auth = await import(`../../messages/${locale}/auth.json`)
    const nav = await import(`../../messages/${locale}/nav.json`)
    const errors = await import(`../../messages/${locale}/errors.json`)
    const validation = await import(`../../messages/${locale}/validation.json`)
    
    messages = {
      common: common.default,
      auth: auth.default,
      nav: nav.default,
      errors: errors.default,
      validation: validation.default
    }
    
    console.log(`Successfully loaded translations for ${locale}:`, Object.keys(messages))
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}:`, error)
    
    // 回退到传统翻译
    try {
      const legacy = await import(`../../messages/${locale}.json`)
      messages = legacy.default
    } catch (legacyError) {
      console.error(`Failed to load legacy translations:`, legacyError)
      messages = {}
    }
  }
  
  return {
    messages,
    timeZone: 'UTC',
    now: new Date()
  }
})
