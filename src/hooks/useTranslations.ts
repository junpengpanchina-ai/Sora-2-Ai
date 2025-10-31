'use client'

// 简化的翻译Hook - 只支持英文
import { useTranslations as useNextIntlTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export function useTranslations() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 调用 next-intl 的 useTranslations
  // 注意：必须在组件顶层调用，不能在 try-catch 中
  // 使用默认命名空间确保安全
  const nextIntlT = useNextIntlTranslations()
  
  // 包装 t 函数以确保它始终是一个可调用的函数
  const t = typeof nextIntlT === 'function' ? nextIntlT : ((key: string) => key)

  // 通用翻译
  const common = (key: string) => {
    if (!isClient) {
      // 服务器端渲染时返回默认值
      const defaults: Record<string, string> = {
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        'cancel': 'Cancel',
        'confirm': 'Confirm',
        'save': 'Save',
        'edit': 'Edit',
        'delete': 'Delete',
        'create': 'Create',
        'update': 'Update',
        'search': 'Search',
        'filter': 'Filter',
        'sort': 'Sort',
        'refresh': 'Refresh',
        'back': 'Back',
        'next': 'Next',
        'previous': 'Previous',
        'close': 'Close',
        'open': 'Open',
        'view': 'View',
        'download': 'Download',
        'upload': 'Upload',
        'share': 'Share',
        'copy': 'Copy',
        'paste': 'Paste',
        'cut': 'Cut',
        'undo': 'Undo',
        'redo': 'Redo',
        'select': 'Select',
        'all': 'All',
        'none': 'None',
        'yes': 'Yes',
        'no': 'No',
        'ok': 'OK',
        'apply': 'Apply',
        'reset': 'Reset',
        'clear': 'Clear',
        'submit': 'Submit',
        'login': 'Login',
        'logout': 'Logout',
        'welcome': 'Welcome,',
        'free': 'Free',
        'register': 'Register',
        'signup': 'Sign Up',
        'signin': 'Sign In',
        'profile': 'Profile',
        'settings': 'Settings',
        'help': 'Help',
        'about': 'About',
        'contact': 'Contact',
        'privacy': 'Privacy',
        'terms': 'Terms',
        'language': 'Language',
        'theme': 'Theme',
        'notifications': 'Notifications',
        'account': 'Account',
        'security': 'Security',
        'preferences': 'Preferences'
      }
      return defaults[key] || key
    }
    
    try {
      const result = t('common.' + key)
      return result && result !== 'common.' + key ? result : key
    } catch {
      return key
    }
  }

  // 导航翻译
  const nav = (key: string) => {
    try {
      const result = t('nav.' + key)
      return result && result !== 'nav.' + key ? result : key
    } catch {
      return key
    }
  }

  // 认证翻译
  const auth = (key: string) => {
    try {
      const result = t('auth.' + key)
      return result && result !== 'auth.' + key ? result : key
    } catch {
      return key
    }
  }

  // 首页翻译
  const home = (key: string) => {
    if (!isClient) {
      // 服务器端渲染时返回默认值
      const defaults: Record<string, string> = {
        'title': 'Create Unlimited Possibilities with AI',
        'subtitle': 'Transform your ideas into professional video content with cutting-edge AI technology. From concept to creation in minutes.',
        'getStarted': 'Start Creating',
        'learnMore': 'Learn More',
        'watchDemo': 'Watch Demo',
        'features.title': 'Why Choose Our AI Video Platform?',
        'features.subtitle': 'Advanced AI video generation technology that makes creativity limitless',
        'features.aiGeneration.title': 'Next-Gen AI Technology',
        'features.aiGeneration.description': 'State-of-the-art artificial intelligence that transforms your text into cinematic-quality videos.',
        'features.easyToUse.title': 'Intuitive Interface',
        'features.easyToUse.description': 'Professional results without the complexity. Simply describe your vision and watch AI bring it to life.',
        'features.fastProcessing.title': 'Lightning Fast',
        'features.fastProcessing.description': 'Get your videos in minutes, not hours. Our optimized AI engine delivers results at unprecedented speed.',
        'growthFeatures.title': 'Growth & Rewards Program',
        'growthFeatures.userLevel.title': 'Progressive Rewards',
        'growthFeatures.userLevel.description': 'Unlock exclusive features and premium content as you create more videos and grow your skills.',
        'growthFeatures.invitationReward.title': 'Referral Program',
        'growthFeatures.invitationReward.description': 'Invite friends and earn credits, premium features, and exclusive access to new tools.',
        'growthFeatures.socialSharing.title': 'Built-in Social Tools',
        'growthFeatures.socialSharing.description': 'Share your creations seamlessly and build your audience with integrated social media features.'
      }
      return defaults[key] || key
    }
    
    try {
      const result = t('home.' + key)
      if (result === 'home.' + key) {
        // 如果翻译键没有找到，返回默认值
        const defaults: Record<string, string> = {
          'title': 'Create Unlimited Possibilities with AI',
          'subtitle': 'Transform your ideas into professional video content with cutting-edge AI technology. From concept to creation in minutes.',
          'getStarted': 'Start Creating',
          'learnMore': 'Learn More',
          'watchDemo': 'Watch Demo',
          'features.title': 'Why Choose Our AI Video Platform?',
          'features.subtitle': 'Advanced AI video generation technology that makes creativity limitless',
          'features.aiGeneration.title': 'Next-Gen AI Technology',
          'features.aiGeneration.description': 'State-of-the-art artificial intelligence that transforms your text into cinematic-quality videos.',
          'features.easyToUse.title': 'Intuitive Interface',
          'features.easyToUse.description': 'Professional results without the complexity. Simply describe your vision and watch AI bring it to life.',
          'features.fastProcessing.title': 'Lightning Fast',
          'features.fastProcessing.description': 'Get your videos in minutes, not hours. Our optimized AI engine delivers results at unprecedented speed.',
          'growthFeatures.title': 'Growth & Rewards Program',
          'growthFeatures.userLevel.title': 'Progressive Rewards',
          'growthFeatures.userLevel.description': 'Unlock exclusive features and premium content as you create more videos and grow your skills.',
          'growthFeatures.invitationReward.title': 'Referral Program',
          'growthFeatures.invitationReward.description': 'Invite friends and earn credits, premium features, and exclusive access to new tools.',
          'growthFeatures.socialSharing.title': 'Built-in Social Tools',
          'growthFeatures.socialSharing.description': 'Share your creations seamlessly and build your audience with integrated social media features.'
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
  const pricing = (key: string, params?: Record<string, any>) => {
    if (!isClient) {
      // 服务器端渲染时返回默认值
      const defaults: Record<string, string> = {
        'title': 'Simple, Transparent Pricing',
        'subtitle': 'Choose the perfect plan for your creative needs. All plans include our core AI video generation technology.',
        'free': 'Starter',
        'pro': 'Professional',
        'enterprise': 'Enterprise',
        'monthly': 'Monthly',
        'yearly': 'Annual',
        'save': 'Save 20%',
        'getStarted': 'Start Free Trial',
        'contactSales': 'Contact Sales',
        'pro.popular': 'Most Popular',
        'freeTrial': params?.days ? `${params.days}天免费试用` : '免费试用',
        'startFreeTrial': '开始免费试用',
        'recommended': '推荐'
      }
      let result = defaults[key] || key
      // 简单的参数替换
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(`{${paramKey}}`, String(paramValue))
        })
      }
      return result
    }
    
    try {
      let translation = t('pricing.' + key)
      if (!translation || translation === 'pricing.' + key) {
        translation = key
      }
      // 简单的参数替换
      if (params && translation) {
        let result = String(translation)
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(`{${paramKey}}`, String(paramValue))
          result = result.replace(`{{${paramKey}}}`, String(paramValue))
        })
        return result
      }
      return translation || key
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
