import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from '@/i18n'

// 语言前缀中间件：
// - 若路径未带语言前缀，则根据 Accept-Language/Cookie 注入前缀
// - 默认兜底为 en
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 静态资源与 API 忽略
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next()
  }

  // 已包含支持的语言前缀，直接放行
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  if (locales.includes(firstSegment as any)) {
    return NextResponse.next()
  }

  // 从 cookie 或请求头判断语言，默认 en
  const cookieLocale = request.cookies.get('LOCALE')?.value
  const headerLang = request.headers.get('accept-language') || ''
  const preferred = (cookieLocale || headerLang.split(',')[0]?.split('-')[0] || 'en') as typeof locales[number]
  const locale = locales.includes(preferred) ? preferred : 'en'

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\.[\w-]+$).*)']
}