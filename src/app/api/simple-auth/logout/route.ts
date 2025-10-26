import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })
    
    // 清除认证cookie - 设置过期时间为过去的时间
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 立即过期
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Simple logout API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
