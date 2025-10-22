'use client'

// 临时禁用国际化，使用硬编码的英文文本
export function useTranslations() {
  return {
    // 通用翻译
    common: (key: string) => {
      const translations: Record<string, string> = {
        'loading': 'Loading...',
        'submit': 'Submit',
        'cancel': 'Cancel',
        'save': 'Save',
        'delete': 'Delete',
        'edit': 'Edit',
        'close': 'Close',
        'ok': 'OK',
        'yes': 'Yes',
        'no': 'No',
        'retry': 'Try Again',
        'refresh': 'Refresh Page',
        'error': 'Error',
        'success': 'Success',
        'warning': 'Warning',
        'info': 'Info'
      }
      return translations[key] || key
    },
    
    // 导航翻译
    nav: (key: string) => {
      const translations: Record<string, string> = {
        'home': 'Home',
        'pricing': 'Pricing',
        'dashboard': 'Dashboard',
        'generate': 'Generate',
        'videos': 'Videos',
        'referral': 'Referral',
        'achievements': 'Achievements',
        'payments': 'Payments',
        'signin': 'Sign In',
        'signup': 'Sign Up',
        'signout': 'Sign Out'
      }
      return translations[key] || key
    },
    
    // 认证翻译
    auth: (key: string) => {
      const translations: Record<string, string> = {
        'signin': 'Sign In',
        'signup': 'Sign Up',
        'signInTitle': 'Sign In to Your Account',
        'signUpTitle': 'Create Your Account',
        'email': 'Email',
        'password': 'Password',
        'name': 'Name',
        'confirmPassword': 'Confirm Password',
        'forgotPassword': 'Forgot Password?',
        'rememberMe': 'Remember me',
        'signinWithGoogle': 'Sign in with Google',
        'signupWithGoogle': 'Sign up with Google',
        'alreadyHaveAccount': 'Already have an account?',
        'dontHaveAccount': "Don't have an account?",
        'noAccount': "Don't have an account?",
        'hasAccount': 'Already have an account?',
        'signinSuccess': 'Sign in successful',
        'signupSuccess': 'Sign up successful',
        'signinFailed': 'Sign in failed',
        'signupFailed': 'Sign up failed',
        'signingIn': 'Signing In...',
        'signingUp': 'Signing Up...',
        'invalidCredentials': 'Invalid email or password',
        'signInError': 'Sign in failed, please try again'
      }
      return translations[key] || key
    },
    
    // 首页翻译
    home: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Sora AI - Create Unlimited Possibilities with AI',
        'subtitle': 'Generate professional-grade video content with just one sentence. From idea to finished product in minutes.',
        'getStarted': 'Get Started',
        'learnMore': 'Learn More',
        'features': 'Features',
        'pricing': 'Pricing',
        'testimonials': 'Testimonials',
        'faq': 'FAQ'
      }
      return translations[key] || key
    },
    
    // 定价翻译
    pricing: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Choose Your Plan',
        'subtitle': 'Select the perfect plan for your video creation needs',
        'monthly': 'Monthly',
        'yearly': 'Yearly',
        'free': 'Free',
        'pro': 'Pro',
        'enterprise': 'Enterprise',
        'getStarted': 'Get Started',
        'contactSales': 'Contact Sales',
        'mostPopular': 'Most Popular',
        'features': 'Features',
        'videosPerMonth': 'videos per month',
        'resolution': 'Resolution',
        'duration': 'Duration',
        'support': 'Support',
        'apiAccess': 'API Access',
        'customBranding': 'Custom Branding',
        'prioritySupport': 'Priority Support',
        'dedicatedAccountManager': 'Dedicated Account Manager'
      }
      return translations[key] || key
    },
    
    // 视频生成翻译
    generate: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Generate AI Video',
        'subtitle': 'Describe the video you want, and AI will create it for you.',
        'promptLabel': 'Video Description',
        'promptPlaceholder': 'Describe in detail the content you want to generate...',
        'promptRequired': 'Please enter a video description',
        'durationLabel': 'Duration',
        'aspectRatioLabel': 'Aspect Ratio',
        'advancedSettings': 'Advanced Settings',
        'videoQuality': 'Video Quality',
        'stylePreset': 'Style Preset',
        'btnGenerate': 'Generate Video',
        'btnGenerating': 'Generating...',
        'generatingTitle': 'Generating Video',
        'generatingTip': 'Generating, please wait...',
        'progressLabel': 'completed',
        'errorTitle': 'Generation Failed',
        'successTitle': 'Generation Complete',
        'successTip': 'Your video is ready.',
        'downloadVideo': 'Download Video',
        'shareVideo': 'Share Video',
        'failedTitle': 'Generation Failed',
        'regenerate': 'Regenerate',
        'generateFailed': 'Generation failed',
        'pollTimeout': 'Polling timeout',
        'fetchResultFailed': 'Failed to fetch result',
        'pollFailed': 'Polling failed'
      }
      return translations[key] || key
    },
    
    // 其他翻译方法
    achievements: (key: string) => key,
    referral: (key: string) => key,
    mvp: (key: string) => key,
    performance: (key: string) => key,
    errors: (key: string) => key,
    notifications: (key: string) => key,
    
    // 原始翻译函数
    t: (key: string) => key
  }
}
