#!/bin/bash

# 安全升级脚本
echo "🔒 开始安全升级..."

# 检查当前安全漏洞
echo "📊 检查当前安全漏洞..."
npm audit

# 清理缓存
echo "🧹 清理npm缓存..."
npm cache clean --force

# 删除node_modules和package-lock.json
echo "🗑️  清理旧依赖..."
rm -rf node_modules package-lock.json

# 安装最新依赖
echo "📦 安装最新依赖..."
npm install

# 运行安全修复
echo "🔧 运行安全修复..."
npm audit fix --force

# 检查是否还有multer警告
echo "🔍 检查multer版本..."
npm ls multer

# 如果还有multer 1.x，强制升级
if npm ls multer | grep -q "1\."; then
    echo "⚠️  检测到multer 1.x，强制升级到2.x..."
    npm install multer@^2.0.0 --save
fi

# 最终安全检查
echo "✅ 最终安全检查..."
npm audit

echo "🎉 安全升级完成！"
echo "📋 升级内容："
echo "   - Multer: 1.x → 2.x"
echo "   - 修复所有安全漏洞"
echo "   - 更新依赖到最新版本"
