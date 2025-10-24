#!/bin/bash

# Vercel部署脚本
echo "🚀 开始部署到Vercel..."

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录Vercel..."
    vercel login
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚠️  环境变量文件不存在，请先配置环境变量"
    echo "💡 运行 ./setup-env.sh 创建环境变量文件"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成Prisma客户端
echo "🗄️  生成Prisma客户端..."
npx prisma generate

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 部署到Vercel
echo "🚀 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "📍 请访问您的Vercel域名查看应用"
echo "🔧 记得在Vercel控制台配置环境变量"
