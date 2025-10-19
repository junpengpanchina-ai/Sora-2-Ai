#!/bin/bash

# Sora AI 启动脚本
echo "🚀 启动 Sora AI 平台..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev
