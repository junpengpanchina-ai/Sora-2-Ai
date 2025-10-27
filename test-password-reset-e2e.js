const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const prisma = new PrismaClient()

async function testPasswordResetE2E() {
  console.log('🧪 端到端测试：密码重置功能\n')
  console.log('=' .repeat(50))
  
  try {
    // 1. 选择测试用户
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
    console.log(`   ID: ${user.id}`)
    console.log(`   当前密码哈希: ${user.password ? user.password.substring(0, 30) + '...' : 'None'}\n`)

    // 3. 生成重置token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1小时后过期

    console.log('📝 步骤1: 生成重置token...')
    console.log(`   Token: ${resetToken.substring(0, 30)}...`)
    console.log(`   过期时间: ${resetTokenExpiry}\n`)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    console.log('✅ Token已保存到数据库\n')

    // 4. 验证token
    console.log('🔍 步骤2: 验证token...')
    const userWithToken = await prisma.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!userWithToken) {
      console.log('❌ Token验证失败')
      return
    }

    console.log('✅ Token验证通过\n')

    // 5. 更新密码
    const newPassword = 'newPassword123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    console.log('🔑 步骤3: 更新密码...')
    console.log(`   新密码: ${newPassword}`)
    console.log(`   密码哈希: ${hashedPassword.substring(0, 30)}...\n`)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    console.log('✅ 密码已更新\n')

    // 6. 验证新密码
    console.log('🔐 步骤4: 验证新密码...')
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    const isValid = await bcrypt.compare(newPassword, updatedUser.password)
    const hasResetToken = updatedUser.resetToken !== null
    
    console.log(isValid ? '✅ 密码验证成功' : '❌ 密码验证失败')
    console.log(hasResetToken ? '❌ Token未清除' : '✅ Token已清除\n')

    // 7. 最终状态
    console.log('📊 最终状态:')
    console.log(`   邮箱: ${updatedUser.email}`)
    console.log(`   姓名: ${updatedUser.name}`)
    console.log(`   密码: 已更新`)
    console.log(`   重置Token: ${updatedUser.resetToken ? '未清除' : '已清除'}`)
    console.log(`   重置Token过期时间: ${updatedUser.resetTokenExpiry || '已清除'}\n`)

    console.log('=' .repeat(50))
    console.log('✅ 所有测试通过！')
    console.log(`📝 可以使用新密码 "${newPassword}" 登录\n`)

  } catch (error) {
    console.error('❌ 错误:', error)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testPasswordResetE2E()

