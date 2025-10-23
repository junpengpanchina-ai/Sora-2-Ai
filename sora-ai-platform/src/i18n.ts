import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // 验证语言参数
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // 提供默认的空翻译对象，避免路径问题
  const messages = {
    common: {
      loading: locale === 'zh' ? '加载中...' : 'Loading...',
      error: locale === 'zh' ? '错误' : 'Error',
      success: locale === 'zh' ? '成功' : 'Success',
      signup: locale === 'zh' ? '注册' : 'Sign Up',
      signin: locale === 'zh' ? '登录' : 'Sign In'
    },
    auth: {
      signUpTitle: locale === 'zh' ? '创建您的账户' : 'Create your account',
      hasAccount: locale === 'zh' ? '已有账户？' : 'Already have an account?',
      signIn: locale === 'zh' ? '登录' : 'Sign in',
      name: locale === 'zh' ? '姓名' : 'Full Name',
      email: locale === 'zh' ? '邮箱地址' : 'Email Address',
      password: locale === 'zh' ? '密码' : 'Password',
      confirmPassword: locale === 'zh' ? '确认密码' : 'Confirm Password',
      referralCode: locale === 'zh' ? '推荐码' : 'Referral Code',
      optional: locale === 'zh' ? '可选' : 'Optional',
      signUpWithGoogle: locale === 'zh' ? '使用Google注册' : 'Sign up with Google',
      passwordMismatch: locale === 'zh' ? '密码不匹配' : 'Passwords do not match',
      signUpFailed: locale === 'zh' ? '注册失败，请重试' : 'Sign up failed. Please try again.'
    },
    nav: {},
    errors: {},
    validation: {}
  }
  
  return {
    messages,
    timeZone: 'UTC',
    now: new Date()
  }
})