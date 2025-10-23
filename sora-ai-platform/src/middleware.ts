import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale: 'en',
  
  // 语言检测策略
  localeDetection: true,
  
  // 路径前缀策略
  pathnames: {
    '/': '/',
    '/auth/signin': {
      en: '/auth/signin',
      zh: '/auth/signin'
    },
    '/auth/signup': {
      en: '/auth/signup', 
      zh: '/auth/signup'
    }
  }
})

export const config = {
  // 匹配所有路径，除了API路由、静态文件和_next
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}