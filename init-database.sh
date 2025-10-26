#!/bin/bash

# 🗄️ 数据库初始化脚本
# 使用方法: ./init-database.sh

set -e

echo "🗄️ 开始初始化数据库..."

# 检查 Prisma 是否安装
if ! command -v npx &> /dev/null; then
    echo "❌ npx 未安装，请先安装 Node.js"
    exit 1
fi

# 生成 Prisma 客户端
echo "📦 生成 Prisma 客户端..."
npx prisma generate

# 推送数据库架构
echo "📊 推送数据库架构..."
npx prisma db push

# 检查数据库文件
if [ -f "prisma/dev.db" ]; then
    echo "✅ 数据库文件已创建: prisma/dev.db"
    echo "📏 数据库文件大小: $(ls -lh prisma/dev.db | awk '{print $5}')"
else
    echo "⚠️  数据库文件未找到，请检查配置"
fi

# 打开 Prisma Studio (可选)
echo "🎯 数据库初始化完成！"
echo "💡 提示: 运行 'npx prisma studio' 可以打开数据库管理界面"
echo "💡 提示: 运行 'npx prisma db seed' 可以填充示例数据"

# 询问是否打开 Prisma Studio
read -p "是否打开 Prisma Studio? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在打开 Prisma Studio..."
    npx prisma studio
fi
