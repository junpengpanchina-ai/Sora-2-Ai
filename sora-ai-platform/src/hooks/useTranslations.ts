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
        'signinSuccess': 'Sign in successful',
        'signupSuccess': 'Sign up successful',
        'signinFailed': 'Sign in failed',
        'signupFailed': 'Sign up failed'
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
