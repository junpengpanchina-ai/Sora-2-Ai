const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function testPasswordReset() {
  console.log('🧪 测试密码重置功能\n')
  
  try {
    // 1. 选择一个用户
    const testEmail = 'test123@qq.com'
    console.log(`📧 测试用户: ${testEmail}\n`)

    // 2. 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (!user) {
      console.log('❌ 用户不存在')
      return
    }

    console.log('✅ 用户存在')
    console.log(`   当前密码哈希: ${user.password ? user.password.substring(0, 20) + '...' : 'None'}`)

    // 3. 生成重置token（模拟忘记密码）
    const crypto = require('crypto')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1小时后过期

    console.log('\n📝 生成重置token...')
    console.log(`   Token: ${resetToken.substring(0, 20)}...`)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    console.log('✅ Token已保存到数据库')

    // 4. 验证token（模拟重置密码）
    console.log('\n🔍 验证token...')
    const userWithToken = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!userWithToken) {
      console.log('❌ Token验证失败')
      return
    }

    console.log('✅ Token验证通过')

    // 5. 更新密码
    const newPassword = 'newPassword123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    console.log('\n🔑 更新密码...')
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    console.log('✅ 密码已更新')
    console.log(`   新密码: ${newPassword}`)

    // 6. 验证新密码
    console.log('\n🔐 验证新密码...')
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    const isValid = await bcrypt.compare(newPassword, updatedUser.password)
    console.log(isValid ? '✅ 密码验证成功' : '❌ 密码验证失败')

    // 7. 清理：恢复原密码（如果需要）
    console.log('\n🧹 清理测试数据...')
    console.log('ℹ️  测试完成！密码已重置，可以使用新密码登录。')

  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPasswordReset()

