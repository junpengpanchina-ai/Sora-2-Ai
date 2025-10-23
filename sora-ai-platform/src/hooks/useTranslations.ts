'use client'

// 简化的翻译Hook - 只支持英文
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
      const result = t('home.' + key)
      if (result === 'home.' + key) {
        // 如果翻译键没有找到，返回默认值
        const defaults: Record<string, string> = {
          'title': 'Create Unlimited Possibilities with AI',
          'subtitle': 'Generate professional-grade video content with just one sentence. From idea to finished product in minutes.',
          'getStarted': 'Get Started',
          'learnMore': 'Learn More',
          'watchDemo': 'Watch Demo',
          'growthFeatures.socialSharing.description': 'Share your creations and grow your audience with built-in social features.'
        }
        return defaults[key] || key
      }
      return result
    } catch {
      return key
    }
  }

  // 生成翻译
  const generate = (key: string) => {
    try {
      const result = t('generate.' + key)
      if (result === 'generate.' + key) {
        // 如果翻译键没有找到，返回默认值
        const defaults: Record<string, string> = {
          'title': 'Generate Video',
          'subtitle': 'Create amazing videos with AI',
          'prompt': 'Video Description',
          'promptPlaceholder': 'Describe the video you want to create...',
          'aspectRatio': 'Aspect Ratio',
          'duration': 'Duration',
          'quality': 'Quality',
          'advancedSettings': 'Advanced Settings',
          'videoQuality': 'Video Quality',
          'stylePreset': 'Style Preset',
          'motionIntensity': 'Motion Intensity',
          'generateButton': 'Generate Video',
          'generating': 'Generating...'
        }
        return defaults[key] || key
      }
      return result
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

  // 定价翻译
  const pricing = (key: string) => {
    try {
      return t('pricing.' + key) || key
    } catch {
      return key
    }
  }

  // 支付翻译
  const payments = (key: string) => {
    try {
      return t('payments.' + key) || key
    } catch {
      return key
    }
  }

  // 推荐翻译
  const referral = (key: string) => {
    try {
      return t('referral.' + key) || key
    } catch {
      return key
    }
  }

  // 错误翻译
  const errors = (key: string) => {
    try {
      return t('errors.' + key) || key
    } catch {
      return key
    }
  }

  // 通知翻译
  const notifications = (key: string) => {
    try {
      return t('notifications.' + key) || key
    } catch {
      return key
    }
  }

  // 成就翻译
  const achievements = (key: string) => {
    try {
      return t('achievements.' + key) || key
    } catch {
      return key
    }
  }

  // 性能翻译
  const performance = (key: string) => {
    try {
      return t('performance.' + key) || key
    } catch {
      return key
    }
  }

  // 通用翻译函数
  const tFunction = (key: string) => {
    try {
      return t('t.' + key) || key
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
    mvp,
    pricing,
    payments,
    referral,
    errors,
    notifications,
    achievements,
    performance,
    t: tFunction
  }
}
