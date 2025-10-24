#!/bin/bash

# Sora AI 平台开发环境启动脚本
echo "🚀 启动 Sora AI 平台开发环境..."

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "⚠️  环境配置文件不存在，正在创建..."
    ./setup-env.sh
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 生成Prisma客户端
echo "🗄️  生成Prisma客户端..."
npx prisma generate

# 推送数据库模式
echo "🗄️  初始化数据库..."
npx prisma db push

# 启动开发服务器（跳过构建检查）
echo "🌐 启动开发服务器..."
echo "📍 访问地址: http://localhost:3000"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 使用开发模式启动，跳过构建检查
NEXT_TELEMETRY_DISABLED=1 npm run dev
