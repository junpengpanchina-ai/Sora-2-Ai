const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // 检查是否已存在测试用户
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('✅ 测试用户已存在:', existingUser.email)
      return
    }

    // 创建测试用户
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: new Date(),
        referralCode: 'TEST123'
      }
    })

    console.log('✅ 测试用户创建成功:')
    console.log('📧 邮箱: test@example.com')
    console.log('🔑 密码: 123456')
    console.log('🎫 推荐码: TEST123')
    
  } catch (error) {
    console.error('❌ 创建用户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
