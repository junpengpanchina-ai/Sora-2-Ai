import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 })
    
    // 获取当前 session（如果有）
    const session = await getServerSession(authOptions)
    
    if (session) {
      console.log('🔐 服务器端退出 - 清除 session:', session.user?.email)
    }
    
    // 清除所有 NextAuth cookies（尝试多种方式确保清除）
    const cookieNames = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      'next-auth.state',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
    ]
    
    cookieNames.forEach(name => {
      // 方式1：清除标准 cookie
      response.cookies.set(name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // 立即过期
        path: '/',
        expires: new Date(0), // 1970年1月1日
      })
      
      // 方式2：清除时尝试不同的 path
      response.cookies.set(name, '', {
        httpOnly: true,
        secure: false, // 也尝试不安全的
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
        expires: new Date(0),
      })
      
      // 方式3：尝试删除（某些浏览器支持）
      response.cookies.delete(name)
    })
    
    // 也清除 simple-auth token
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    })
    response.cookies.delete('auth_token')
    
    console.log('✅ 已清除所有认证 cookies')
    
    return response
  } catch (error) {
    console.error('❌ 强制退出失败:', error)
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 })
  }
}

