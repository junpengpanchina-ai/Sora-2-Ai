#!/bin/bash

# Sora AI 平台快速启动脚本
echo "🚀 启动 Sora AI 平台..."

# 检查环境
echo "🔍 检查环境..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  环境配置文件不存在，正在创建..."
    if [ -f "setup-env.sh" ]; then
        chmod +x setup-env.sh
        ./setup-env.sh
    else
        echo "❌ 找不到 setup-env.sh 文件"
        exit 1
    fi
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 检查数据库
echo "🗄️  初始化数据库..."
if [ -f "prisma/schema.prisma" ]; then
    echo "生成Prisma客户端..."
    npx prisma generate
    
    echo "推送数据库模式..."
    npx prisma db push
    
    if [ $? -eq 0 ]; then
        echo "✅ 数据库初始化成功"
    else
        echo "⚠️  数据库初始化失败，但继续启动..."
    fi
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "📍 访问地址: http://localhost:3000"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

npm run dev
