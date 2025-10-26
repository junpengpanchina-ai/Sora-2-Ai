// 简单的会话检查API
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey') as any
    
    return NextResponse.json({ 
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
