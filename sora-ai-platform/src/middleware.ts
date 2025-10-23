import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  // 只支持英文，默认语言为英文
  locales: ['en'],
  defaultLocale: 'en',
  // 不显示语言前缀
  localePrefix: 'never'
})

export const config = {
  // 匹配所有路径，除了API路由、静态文件和_next
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}