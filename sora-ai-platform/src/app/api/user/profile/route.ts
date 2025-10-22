import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取用户资料
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        freeVideosLeft: true,
        subscriptionPlan: true,
        referralCode: true,
        referralCount: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('获取用户资料错误:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}

// 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: '未授权访问' },
        { status: 401 }
      )
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { message: '姓名和邮箱不能为空' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已被其他用户使用
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: '该邮箱已被其他用户使用' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email
      },
      select: {
        id: true,
        name: true,
        email: true,
        freeVideosLeft: true,
        subscriptionPlan: true,
        referralCode: true,
        referralCount: true,
        createdAt: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('更新用户资料错误:', error)
    return NextResponse.json(
      { message: '服务器错误' },
      { status: 500 }
    )
  }
}
