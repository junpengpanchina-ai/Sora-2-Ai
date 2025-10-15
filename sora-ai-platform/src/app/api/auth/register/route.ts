import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 简化的注册逻辑，实际应用中应该连接数据库
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 模拟注册成功
    return NextResponse.json(
      { message: '注册成功', user: { id: '1', email, name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { message: '注册失败' },
      { status: 500 }
    )
  }
}
