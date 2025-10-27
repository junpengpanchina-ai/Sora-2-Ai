const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🔍 正在查询数据库...\n')
  
  try {
    // 1. 查看所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        resetToken: true,
        resetTokenExpiry: true,
        createdAt: true
      }
    })

    console.log(`📊 找到 ${users.length} 个用户：\n`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. 邮箱: ${user.email}`)
      console.log(`   姓名: ${user.name || 'N/A'}`)
      console.log(`   注册时间: ${user.createdAt}`)
      console.log(`   重置Token: ${user.resetToken ? '✅ 有' : '❌ 无'}`)
      if (user.resetTokenExpiry) {
        console.log(`   过期时间: ${user.resetTokenExpiry}`)
      }
      console.log('')
    })

    // 2. 选择一个用户进行测试
    if (users.length > 0) {
      const testUser = users[0]
      console.log(`\n✅ 可以用以下邮箱测试密码重置：\n${testUser.email}\n`)
      console.log('📝 测试步骤：')
      console.log('1. 访问 http://localhost:3000/auth/forgot-password')
      console.log(`2. 输入邮箱: ${testUser.email}`)
      console.log('3. 查看控制台输出的重置链接')
      console.log('4. 复制链接并在浏览器中打开')
      console.log('5. 设置新密码（至少8个字符）')
      console.log('6. 使用新密码登录')
    }

  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()

