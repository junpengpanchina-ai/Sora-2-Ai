#!/bin/bash

# Google OAuth 配置检查脚本

echo "🔍 检查 Google OAuth 配置..."
echo ""

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "❌ 未找到 .env.local 文件"
    exit 1
fi

echo "📄 读取环境变量配置..."

# 检查 GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
GOOGLE_CLIENT_SECRET=$(grep "^GOOGLE_CLIENT_SECRET=" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Google OAuth 环境变量检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "your-google-client-id" ]; then
    echo "❌ GOOGLE_CLIENT_ID: 未配置或使用默认值"
    echo "   需要从 Google Cloud Console 获取真实值"
else
    echo "✅ GOOGLE_CLIENT_ID: 已配置"
    echo "   值: ${GOOGLE_CLIENT_ID:0:30}..."
    if [[ "$GOOGLE_CLIENT_ID" == *.apps.googleusercontent.com ]]; then
        echo "   ✅ 格式正确（包含 .apps.googleusercontent.com）"
    else
        echo "   ⚠️  格式可能不正确"
    fi
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" = "your-google-client-secret" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET: 未配置或使用默认值"
    echo "   需要从 Google Cloud Console 获取真实值"
else
    echo "✅ GOOGLE_CLIENT_SECRET: 已配置"
    echo "   值: ${GOOGLE_CLIENT_SECRET:0:20}..."
    if [[ "$GOOGLE_CLIENT_SECRET" == GOCSPX-* ]]; then
        echo "   ✅ 格式正确（以 GOCSPX- 开头）"
    else
        echo "   ⚠️  格式可能不正确"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NextAuth 提供者检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查服务器是否运行
PORT=$(lsof -ti:3000,3001 | head -1)
if [ -z "$PORT" ]; then
    echo "⚠️  开发服务器未运行"
    echo "   请运行: npm run dev"
    echo ""
    echo "📝 手动检查步骤："
else
    echo "✅ 开发服务器正在运行"
    PORT_NUM=$(lsof -ti:3000 2>/dev/null | head -1)
    if [ -z "$PORT_NUM" ]; then
        PORT_URL="http://localhost:3001"
    else
        PORT_URL="http://localhost:3000"
    fi
    
    echo "   服务器地址: $PORT_URL"
    echo ""
    echo "🔍 检查 NextAuth 提供者..."
    
    PROVIDERS=$(curl -s "$PORT_URL/api/auth/providers" 2>/dev/null)
    if echo "$PROVIDERS" | grep -q "google"; then
        echo "   ✅ Google Provider 已注册"
    else
        echo "   ❌ Google Provider 未注册"
        echo "   可能原因：环境变量未正确配置"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Google Cloud Console 检查清单"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 请在 Google Cloud Console 确认以下配置："
echo ""
echo "1. 应用类型"
echo "   ✅ 必须是: Web 应用程序"
echo "   ❌ 不能是: 桌面应用程序、iOS、Android 等"
echo ""
echo "2. 已获授权的 JavaScript 来源"
echo "   ✅ http://localhost:3000"
echo "   ✅ http://localhost:3001"
echo "   ⚠️  不能包含路径！"
echo ""
echo "3. 已获授权的重定向URI"
echo "   ✅ http://localhost:3000/api/auth/callback/google"
echo "   ✅ http://localhost:3001/api/auth/callback/google"
echo "   ⚠️  必须包含完整路径！"
echo ""
echo "4. OAuth 同意屏幕配置（重要！）"
echo "   ✅ 用户类型：外部"
echo "   ✅ 应用名称：已填写"
echo "   ✅ 用户支持电子邮件：已填写"
echo "   ✅ 作用域：包含 email 和 profile"
echo "   ✅ 测试用户：至少添加一个用户邮箱"
echo "   ✅ 所有配置已保存"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Google Cloud Console 直接链接"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 OAuth 客户端凭据："
echo "   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8"
echo ""
echo "📋 OAuth 同意屏幕设置："
echo "   https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示：如果 Google 登录失败，请检查："
echo "   1. OAuth 客户端类型是否为 'Web 应用程序'"
echo "   2. 重定向 URI 是否正确配置"
echo "   3. OAuth 同意屏幕是否已完成所有必填项"
echo "   4. 测试用户是否已添加（如果应用处于测试状态）"
echo ""