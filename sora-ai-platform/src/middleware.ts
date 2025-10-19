import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  
  // 默认语言
  defaultLocale: 'en',
  
  // 语言检测策略
  localeDetection: true
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