#!/bin/bash

echo "🚀 开始本地部署 Sora AI 平台..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 设置环境变量
echo "🔧 设置环境变量..."
if [ ! -f .env.local ]; then
    echo "⚠️  请先创建 .env.local 文件并配置以下变量："
    echo "DATABASE_URL=\"file:./dev.db\""
    echo "NEXTAUTH_URL=\"http://localhost:3000\""
    echo "NEXTAUTH_SECRET=\"your-secret-key-here\""
    echo "STRIPE_SECRET_KEY=\"sk_test_...\""
    echo "STRIPE_PUBLISHABLE_KEY=\"pk_test_...\""
    echo "STRIPE_WEBHOOK_SECRET=\"whsec_...\""
    echo ""
    echo "请配置完成后重新运行此脚本"
    exit 1
fi

# 生成Prisma客户端
echo "🗄️  生成Prisma客户端..."
npx prisma generate

# 推送数据库模式
echo "📊 推送数据库模式..."
npx prisma db push

# 创建Stripe产品（可选）
echo "💳 是否创建Stripe产品？(y/n)"
read -r create_products
if [ "$create_products" = "y" ]; then
    echo "创建Stripe产品..."
    node scripts/create-stripe-products.js
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "访问 http://localhost:3000 查看应用"
echo "按 Ctrl+C 停止服务器"

npm run dev
