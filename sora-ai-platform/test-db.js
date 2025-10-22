// 测试数据库连接
const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🔍 测试数据库连接...');
  
  try {
    const prisma = new PrismaClient();
    
    // 测试连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    // 测试查询
    const userCount = await prisma.user.count();
    console.log('📊 用户数量:', userCount);
    
    await prisma.$disconnect();
    console.log('✅ 数据库断开连接成功');
    
  } catch (error) {
    console.error('❌ 数据库错误:', error.message);
    console.error('详细错误:', error);
  }
}

testDatabase();
