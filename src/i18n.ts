import { getRequestConfig } from 'next-intl/server'

export const locales = ['en'] as const
export type Locale = (typeof locales)[number]

// 缓存翻译消息
let cachedMessages: any = null

export default getRequestConfig(async () => {
  // 如果已经有缓存，直接返回
  if (cachedMessages) {
    return {
      messages: cachedMessages,
    }
  }
  
  // 只支持英文，加载英文翻译文件
  let messages = {}
  
  try {
    console.log(`Loading English translations`)
    
    const common = await import(`../messages/en/common.json`)
    const auth = await import(`../messages/en/auth.json`)
    const nav = await import(`../messages/en/nav.json`)
    const errors = await import(`../messages/en/errors.json`)
    const validation = await import(`../messages/en/validation.json`)
    const home = await import(`../messages/en/home.json`)
    const generate = await import(`../messages/en/generate.json`)
    const mvp = await import(`../messages/en/mvp.json`)
    const pricing = await import(`../messages/en/pricing.json`)
    const referral = await import(`../messages/en/referral.json`)
    const achievements = await import(`../messages/en/achievements.json`)
    
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
      referral: referral.default,
      achievements: achievements.default
    }
    
    console.log(`Successfully loaded English translations:`, Object.keys(messages))
    
    // 缓存翻译消息
    cachedMessages = messages
  } catch (error) {
    console.warn(`Failed to load English translations:`, error)
    // 提供默认的英文翻译
    messages = {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        signup: 'Sign Up',
        signin: 'Sign In'
      },
      auth: {
        signUpTitle: 'Create your account',
        hasAccount: 'Already have an account?',
        signIn: 'Sign in',
        name: 'Full Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        referralCode: 'Referral Code',
        optional: 'Optional',
        signUpWithGoogle: 'Sign up with Google',
        passwordMismatch: 'Passwords do not match',
        signUpFailed: 'Sign up failed. Please try again.'
      },
      nav: {},
      errors: {},
      validation: {}
    }
  }
  
  return {
    locale: 'en',
    messages,
    timeZone: 'UTC',
    now: new Date()
  }
})