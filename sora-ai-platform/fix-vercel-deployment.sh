#!/bin/bash

# Vercel部署修复脚本
echo "🔧 修复Vercel部署配置..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录Vercel..."
    vercel login
fi

# 安装根目录依赖
echo "📦 安装根目录依赖..."
npm install

# 进入子目录安装依赖
echo "📦 安装子目录依赖..."
cd sora-ai-platform
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

# 返回根目录
cd ..

# 部署到Vercel
echo "🚀 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "📍 请访问您的Vercel域名查看应用"
echo "🔧 记得在Vercel控制台配置环境变量"
