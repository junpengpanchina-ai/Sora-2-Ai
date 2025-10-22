// 测试带会话的 API 调用
const { PrismaClient } = require('@prisma/client');

async function testAPIWithSession() {
  console.log('🔍 测试带会话的 API 调用...');
  
  try {
    const prisma = new PrismaClient();
    
    // 获取一个用户
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ 没有找到用户');
      return;
    }
    
    console.log('👤 找到用户:', user.email);
    
    // 模拟会话数据
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    
    console.log('🔑 会话数据:', sessionData);
    
    // 测试 SoraAPI 初始化
    const { SoraAPI } = require('./src/lib/sora-api.ts');
    const soraAPI = new SoraAPI();
    console.log('✅ SoraAPI 初始化成功');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ 测试错误:', error.message);
    console.error('详细错误:', error);
  }
}

testAPIWithSession();
