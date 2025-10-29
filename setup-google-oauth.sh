#!/bin/bash

# Google OAuth 配置辅助脚本
# 项目ID: skilled-acolyte-476516-g8

echo "🔐 Google OAuth 配置辅助工具"
echo "=================================="
echo "项目ID: skilled-acolyte-476516-g8"
echo "项目编号: 222103705593"
echo ""

# 检查是否已有.env.local文件
if [ ! -f ".env.local" ]; then
    echo "📝 未找到.env.local文件，正在创建..."
    cp env.local.template .env.local 2>/dev/null || {
        echo "⚠️  未找到env.local.template，创建基本.env.local文件..."
        cat > .env.local << 'EOF'
# Google OAuth 配置
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
EOF
    }
    echo "✅ .env.local文件已创建"
else
    echo "✅ 找到.env.local文件"
fi

echo ""
echo "📋 下一步操作:"
echo ""
echo "1. 访问Google Cloud Console并创建OAuth客户端ID:"
echo "   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8"
echo ""
echo "2. 配置OAuth同意屏幕:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8"
echo ""
echo "3. 重要配置项:"
echo "   - 重定向URI: http://localhost:3000/api/auth/callback/google"
echo "   - 授权来源: http://localhost:3000"
echo ""
echo "4. 复制客户端ID和密钥，然后编辑.env.local文件:"
echo "   nano .env.local"
echo "   或"
echo "   code .env.local"
echo ""
echo "5. 生成NEXTAUTH_SECRET:"
echo "   openssl rand -base64 32"
echo ""
echo "6. 重启开发服务器:"
echo "   npm run dev"
echo ""
echo "📖 详细指南: GOOGLE_OAUTH_QUICK_SETUP.md"
echo ""

# 检查是否已配置
if grep -q "your-google-client-id-here" .env.local 2>/dev/null; then
    echo "⚠️  警告: Google OAuth凭据还未配置！"
    echo "   请按照上述步骤配置GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET"
else
    echo "✅ Google OAuth凭据似乎已配置"
fi

echo ""
echo "🔗 快速链接:"
echo "   - 项目仪表板: https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8"
echo "   - 凭据管理: https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8"
echo "   - OAuth同意屏幕: https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8"
echo ""