#!/usr/bin/env node

/**
 * Supabase 数据库配置脚本
 * 运行: node scripts/setup-supabase.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始配置 Supabase 数据库...\n');

// 检查环境变量文件
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ 未找到 .env.local 文件');
  console.log('📝 请先创建 .env.local 文件并配置 DATABASE_URL');
  console.log('💡 参考 SUPABASE_SETUP.md 文件获取详细说明');
  process.exit(1);
}

// 读取环境变量
require('dotenv').config({ path: envPath });

if (!process.env.DATABASE_URL) {
  console.log('❌ 未找到 DATABASE_URL 环境变量');
  console.log('📝 请在 .env.local 中配置 DATABASE_URL');
  process.exit(1);
}

console.log('✅ 环境变量配置正确');

try {
  // 生成 Prisma 客户端
  console.log('\n📦 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma 客户端生成成功');

  // 推送数据库模式
  console.log('\n🗄️  推送数据库模式到 Supabase...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ 数据库模式推送成功');

  // 显示数据库状态
  console.log('\n📊 数据库状态:');
  execSync('npx prisma db status', { stdio: 'inherit' });

  console.log('\n🎉 Supabase 数据库配置完成！');
  console.log('📝 下一步:');
  console.log('   1. 修改 src/lib/auth.ts 启用数据库认证');
  console.log('   2. 重启开发服务器: npm run dev');
  console.log('   3. 测试用户注册功能');

} catch (error) {
  console.error('❌ 配置过程中出现错误:', error.message);
  console.log('\n🔧 故障排除:');
  console.log('   1. 检查 DATABASE_URL 是否正确');
  console.log('   2. 确保 Supabase 项目正在运行');
  console.log('   3. 检查网络连接');
  process.exit(1);
}
