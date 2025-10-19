import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 查找邀请人
    let referrerId = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode }
      })
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        referredBy: referrerId,
        freeVideosLeft: 1, // 注册送1个免费视频
        subscriptionPlan: 'free'
      }
    })

    // 如果通过邀请注册，给邀请人奖励
    if (referrerId) {
      await prisma.$transaction([
        // 更新邀请人统计
        prisma.user.update({
          where: { id: referrerId },
          data: {
            referralCount: { increment: 1 }
          }
        }),
        // 创建邀请奖励记录
        prisma.referralReward.create({
          data: {
            referrerId,
            refereeId: user.id,
            rewardType: 'video_15s',
            rewardCount: 1
          }
        })
      ])
    }

    return NextResponse.json(
      { 
        message: '注册成功', 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          freeVideosLeft: user.freeVideosLeft
        } 
      },
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
