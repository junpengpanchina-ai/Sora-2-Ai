/**
 * 现代化国际化核心系统
 * 基于《JavaScript Internationalization》和《React i18n Best Practices》设计
 */

// 支持的语言配置
export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
  currency: string
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: { style: 'decimal' },
    currency: 'USD'
  },
  {
    code: 'zh',
    name: '中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
    dateFormat: 'yyyy-MM-dd',
    numberFormat: { style: 'decimal' },
    currency: 'CNY'
  }
]

// 翻译命名空间
export type TranslationNamespace = 
  | 'common' 
  | 'auth' 
  | 'nav' 
  | 'home' 
  | 'generate' 
  | 'dashboard' 
  | 'mvp'
  | 'errors'
  | 'validation'

// 翻译缓存接口
export interface TranslationCache {
  [locale: string]: {
    [namespace: string]: Record<string, any>
  }
}

// 翻译状态接口
export interface TranslationState {
  locale: string
  isLoading: boolean
  isChanging: boolean
  error: string | null
  cache: TranslationCache
}

// 翻译动作接口
export interface TranslationActions {
  changeLanguage: (locale: string) => Promise<void>
  preloadTranslations: (locale: string, namespaces: TranslationNamespace[]) => Promise<void>
  getTranslation: (namespace: TranslationNamespace, key: string, params?: Record<string, any>) => string
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (amount: number, currency?: string) => string
}

// 翻译上下文类型
export interface TranslationContextType {
  state: TranslationState
  actions: TranslationActions
}