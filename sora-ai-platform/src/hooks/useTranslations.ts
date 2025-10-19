'use client'

import { useTranslations as useNextIntlTranslations } from 'next-intl'

export function useTranslations() {
  const t = useNextIntlTranslations()
  
  return {
    // 通用翻译
    common: (key: string) => t(`common.${key}`),
    
    // 导航翻译
    nav: (key: string) => t(`navigation.${key}`),
    
    // 认证翻译
    auth: (key: string) => t(`auth.${key}`),
    
    // 首页翻译
    home: (key: string) => t(`home.${key}`),
    
    // 定价翻译
    pricing: (key: string) => t(`pricing.${key}`),
    
    // 成就翻译
    achievements: (key: string) => t(`achievements.${key}`),
    
    // 邀请翻译
    referral: (key: string) => t(`referral.${key}`),
    
    // MVP翻译
    mvp: (key: string) => t(`mvp.${key}`),
    
    // 性能翻译
    performance: (key: string) => t(`performance.${key}`),
    
    // 错误翻译
    errors: (key: string) => t(`errors.${key}`),
    
    // 通知翻译
    notifications: (key: string) => t(`notifications.${key}`),
    
    // 原始翻译函数
    t
  }
}
