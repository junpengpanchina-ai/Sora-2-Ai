#!/bin/bash

# 🚀 Sora-2-Ai 启动脚本
# 使用方法: ./start.sh [dev|build|start]

set -e

# 默认模式
MODE=${1:-dev}

echo "🚀 启动 Sora-2-Ai ($MODE 模式)..."

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local 文件不存在"
    echo "💡 请先运行: cp env.local.template .env.local"
    echo "💡 然后编辑 .env.local 文件，配置必要的环境变量"
    exit 1
fi

# 检查数据库
if [ ! -f "prisma/dev.db" ]; then
    echo "⚠️  数据库文件不存在，正在初始化..."
    ./init-database.sh
fi

# 根据模式启动
case $MODE in
    "dev")
        echo "🔧 启动开发服务器..."
        npm run dev
        ;;
    "build")
        echo "🏗️  构建生产版本..."
        npm run build
        echo "✅ 构建完成！"
        ;;
    "start")
        echo "🚀 启动生产服务器..."
        npm start
        ;;
    "db")
        echo "🗄️  打开数据库管理界面..."
        npx prisma studio
        ;;
    "reset")
        echo "🔄 重置数据库..."
        rm -f prisma/dev.db
        ./init-database.sh
        ;;
    *)
        echo "❌ 未知模式: $MODE"
        echo "💡 可用模式: dev, build, start, db, reset"
        echo "   dev   - 开发模式 (默认)"
        echo "   build - 构建生产版本"
        echo "   start - 启动生产服务器"
        echo "   db    - 打开数据库管理界面"
        echo "   reset - 重置数据库"
        exit 1
        ;;
esac