#!/bin/bash

# Google OAuth 重定向 URI 快速修复脚本

echo "🔍 检查 Google OAuth 配置..."
echo ""

# 检查当前服务器端口
PORT_3000=$(lsof -ti:3000 2>/dev/null | wc -l)
PORT_3001=$(lsof -ti:3001 2>/dev/null | wc -l)

CURRENT_PORT=""
if [ "$PORT_3000" -gt 0 ]; then
    CURRENT_PORT="3000"
elif [ "$PORT_3001" -gt 0 ]; then
    CURRENT_PORT="3001"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  当前配置检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$CURRENT_PORT" ]; then
    echo "✅ 服务器运行在端口: $CURRENT_PORT"
else
    echo "⚠️  未检测到运行中的服务器"
fi

# 检查 NEXTAUTH_URL
if [ -f ".env.local" ]; then
    NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$NEXTAUTH_URL" ]; then
        echo "📝 NEXTAUTH_URL: $NEXTAUTH_URL"
        
        # 提取端口
        if [[ "$NEXTAUTH_URL" =~ localhost:([0-9]+) ]]; then
            CONFIG_PORT="${BASH_REMATCH[1]}"
            echo "📝 配置的端口: $CONFIG_PORT"
            
            if [ -n "$CURRENT_PORT" ] && [ "$CURRENT_PORT" != "$CONFIG_PORT" ]; then
                echo "⚠️  警告：服务器运行在 $CURRENT_PORT，但配置是 $CONFIG_PORT"
            fi
        fi
    else
        echo "⚠️  NEXTAUTH_URL 未设置"
    fi
else
    echo "❌ .env.local 文件不存在"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Google Cloud Console 配置要求"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  重要：必须在 Google Cloud Console 中配置以下两个重定向 URI："
echo ""
echo "  1. http://localhost:3000/api/auth/callback/google"
echo "  2. http://localhost:3001/api/auth/callback/google"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  操作步骤"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 访问 Google Cloud Console："
echo "   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8"
echo ""
echo "2. 找到您的 OAuth 2.0 客户端（客户端ID包含：222103705593）"
echo ""
echo "3. 点击客户端名称进入详情页面"
echo ""
echo "4. 滚动到"已获授权的重定向URI"部分"
echo ""
echo "5. 确保以下两个 URI 都存在："
echo "   • http://localhost:3000/api/auth/callback/google"
echo "   • http://localhost:3001/api/auth/callback/google"
echo ""
echo "6. 如果缺少某个，点击"+ 添加URI"添加"
echo ""
echo "7. 保存更改"
echo ""
echo "8. 等待 1-2 分钟让配置生效"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  快速修复建议"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$CURRENT_PORT" ]; then
    echo "当前服务器运行在端口 $CURRENT_PORT"
    echo ""
    echo "如果 Google Cloud Console 中只配置了一个端口："
    echo "  立即添加另一个端口的重定向 URI（见上面的步骤）"
    echo ""
else
    echo "服务器未运行。建议："
    echo "  1. 先启动服务器：npm run dev"
    echo "  2. 然后根据服务器实际运行的端口配置 Google Cloud Console"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

