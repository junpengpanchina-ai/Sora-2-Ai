'use client'

// 临时兼容性Hook - 保持现有代码工作
// 基于现代化翻译系统

import { useTranslations as useNextIntlTranslations } from 'next-intl'

export function useTranslations() {
  const t = useNextIntlTranslations()

  // 通用翻译
  const common = (key: string) => {
    try {
      return t('common.' + key) || key
    } catch {
      return key
    }
  }

  // 导航翻译
  const nav = (key: string) => {
    try {
      return t('nav.' + key) || key
    } catch {
      return key
    }
  }

  // 认证翻译
  const auth = (key: string) => {
    try {
      return t('auth.' + key) || key
    } catch {
      return key
    }
  }

  // 首页翻译
  const home = (key: string) => {
    try {
      return t('home.' + key) || key
    } catch {
      return key
    }
  }

  // 生成翻译
  const generate = (key: string) => {
    try {
      return t('generate.' + key) || key
    } catch {
      return key
    }
  }

  // 仪表板翻译
  const dashboard = (key: string) => {
    try {
      return t('dashboard.' + key) || key
    } catch {
      return key
    }
  }

  // MVP翻译
  const mvp = (key: string) => {
    try {
      return t('mvp.' + key) || key
    } catch {
      return key
    }
  }

  return {
    common,
    nav,
    auth,
    home,
    generate,
    dashboard,
    mvp
  }
}
