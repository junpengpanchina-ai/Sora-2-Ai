import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from '@/lib/i18n/config'

// 智能语言检测中间件
// - 支持多种语言检测策略
// - 智能缓存和性能优化
// - 支持SEO友好的语言切换
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 静态资源与 API 忽略
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/_vercel')
  ) {
    return NextResponse.next()
  }

  // 已包含支持的语言前缀，直接放行
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  if (locales.includes(firstSegment as any)) {
    // 设置语言Cookie用于下次访问
    const response = NextResponse.next()
    response.cookies.set('LOCALE', firstSegment, {
      maxAge: 60 * 60 * 24 * 365, // 1年
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    return response
  }

  // 智能语言检测策略
  const detectedLocale = detectUserLanguage(request)
  
  const url = request.nextUrl.clone()
  url.pathname = `/${detectedLocale}${pathname}`
  
  const response = NextResponse.redirect(url)
  
  // 设置语言Cookie
  response.cookies.set('LOCALE', detectedLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1年
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  
  return response
}

// 智能语言检测函数
function detectUserLanguage(request: NextRequest): string {
  // 1. 优先检查Cookie中的语言设置
  const cookieLocale = request.cookies.get('LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // 2. 检查URL参数中的语言设置
  const urlLocale = request.nextUrl.searchParams.get('lang')
  if (urlLocale && locales.includes(urlLocale as any)) {
    return urlLocale
  }

  // 3. 解析Accept-Language头部
  const acceptLanguage = request.headers.get('accept-language') || ''
  const browserLanguages = parseAcceptLanguage(acceptLanguage)
  
  // 4. 检查地理位置（如果可用）
  const country = request.geo?.country
  const geoLocale = getLocaleFromCountry(country)
  
  // 5. 智能语言匹配
  const detectedLocale = findBestMatch(browserLanguages, geoLocale)
  
  return detectedLocale || 'en'
}

// 解析Accept-Language头部
function parseAcceptLanguage(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, qValue] = lang.trim().split(';q=')
      return {
        locale: locale.split('-')[0], // 只取语言代码
        quality: qValue ? parseFloat(qValue) : 1.0
      }
    })
    .sort((a, b) => b.quality - a.quality)
    .map(item => item.locale)
}

// 根据国家代码获取语言
function getLocaleFromCountry(country?: string): string | null {
  const countryToLocale: Record<string, string> = {
    'US': 'en',
    'GB': 'en',
    'CA': 'en',
    'AU': 'en',
    'CN': 'zh',
    'TW': 'zh',
    'HK': 'zh',
    'SG': 'en',
    'JP': 'ja',
    'KR': 'ko',
    'DE': 'de',
    'FR': 'fr',
    'ES': 'es',
    'IT': 'it',
    'RU': 'ru',
    'BR': 'pt',
    'MX': 'es',
    'IN': 'en'
  }
  
  return country ? countryToLocale[country] || null : null
}

// 智能语言匹配
function findBestMatch(browserLanguages: string[], geoLocale?: string | null): string {
  // 1. 检查浏览器语言是否在支持列表中
  for (const lang of browserLanguages) {
    if (locales.includes(lang as any)) {
      return lang
    }
  }
  
  // 2. 检查地理位置语言
  if (geoLocale && locales.includes(geoLocale as any)) {
    return geoLocale
  }
  
  // 3. 检查语言变体（如zh-CN -> zh）
  for (const lang of browserLanguages) {
    const baseLang = lang.split('-')[0]
    if (locales.includes(baseLang as any)) {
      return baseLang
    }
  }
  
  // 4. 默认返回英文
  return 'en'
}

export const config = {
  matcher: ['/((?!_next|api|.*\.[\w-]+$).*)']
}