import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'en',
  
  // 语言检测策略
  localeDetection: true,
  
  // 路径前缀策略
  pathnames: {
    '/': '/',
    '/dashboard': {
      en: '/dashboard',
      zh: '/仪表板'
    },
    '/generate': {
      en: '/generate',
      zh: '/生成视频'
    },
    '/pricing': {
      en: '/pricing',
      zh: '/定价'
    },
    '/achievements': {
      en: '/achievements',
      zh: '/成就'
    },
    '/referral': {
      en: '/referral',
      zh: '/邀请'
    },
    '/mvp': {
      en: '/mvp',
      zh: '/mvp'
    },
    '/admin/performance': {
      en: '/admin/performance',
      zh: '/admin/性能'
    }
  }
})

export const config = {
  // 匹配所有路径，除了API路由、静态文件和Next.js内部文件
  matcher: [
    // 匹配所有路径
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // 但是匹配根路径
    '/'
  ]
}