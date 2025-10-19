#!/bin/bash

# Docker 启动脚本 - 避免本地 node_modules
echo "🐳 使用 Docker 启动 Sora AI 平台..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi

# 构建并启动服务
echo "🔨 构建 Docker 镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

echo "✅ 服务已启动！"
echo "🌐 访问地址: http://localhost:3000"
echo "📊 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
