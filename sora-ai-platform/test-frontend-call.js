// 模拟前端调用
const { PrismaClient } = require('@prisma/client');

async function testFrontendCall() {
  console.log('🔍 模拟前端调用...');
  
  try {
    const prisma = new PrismaClient();
    
    // 获取一个用户
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ 没有找到用户');
      return;
    }
    
    console.log('👤 用户:', user.email);
    
    // 测试创建视频记录
    const video = await prisma.video.create({
      data: {
        title: 'Test Video',
        prompt: 'A beautiful sunset',
        status: 'pending',
        progress: 0,
        duration: 5,
        aspectRatio: '16:9',
        size: 'small',
        style: 'realistic',
        motion: 'medium',
        userId: user.id
      }
    });
    
    console.log('✅ 视频记录创建成功:', video.id);
    
    // 清理测试数据
    await prisma.video.delete({
      where: { id: video.id }
    });
    
    console.log('✅ 测试数据清理完成');
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ 测试错误:', error.message);
    console.error('详细错误:', error);
  }
}

testFrontendCall();
