import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 简单的中间件，直接传递请求
  return NextResponse.next()
}

export const config = {
  // 匹配所有路径，除了API路由、静态文件和_next
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}