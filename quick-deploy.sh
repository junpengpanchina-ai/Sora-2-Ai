#!/bin/bash

# 🚀 Sora-2-Ai 快速部署脚本
# 使用方法: ./quick-deploy.sh

set -e

echo "🚀 开始部署 Sora-2-Ai..."

# 检查 Node.js 版本
echo "📋 检查系统要求..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 npm 版本
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查环境变量文件
echo "🔧 检查环境配置..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local 文件不存在，正在创建..."
    cp env.local.example .env.local
    echo "📝 请编辑 .env.local 文件，配置必要的环境变量"
    echo "   特别是 Stripe 密钥和数据库配置"
    read -p "按 Enter 键继续..."
fi

# 生成 Prisma 客户端
echo "🗄️  初始化数据库..."
npm run db:generate

# 推送数据库架构
echo "📊 创建数据库表..."
npm run db:push

# 检查 Stripe 配置
echo "💳 检查 Stripe 配置..."
if grep -q "sk_test_" .env.local; then
    echo "✅ Stripe 配置已设置"
else
    echo "⚠️  请确保在 .env.local 中配置了 Stripe 密钥"
fi

# 启动开发服务器
echo "🎉 部署完成！正在启动开发服务器..."
echo "🌐 应用将在 http://localhost:3000 运行"
echo "📱 按 Ctrl+C 停止服务器"

npm run dev
