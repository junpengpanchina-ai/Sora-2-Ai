#!/bin/bash

echo "🔍 Google OAuth 配置检查工具"
echo "=============================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查步骤函数
check_step() {
    local step_name=$1
    local status=$2
    
    if [ "$status" == "ok" ]; then
        echo -e "${GREEN}✅${NC} $step_name"
    elif [ "$status" == "warning" ]; then
        echo -e "${YELLOW}⚠️${NC} $step_name"
    else
        echo -e "${RED}❌${NC} $step_name"
    fi
}

echo "📋 检查清单："
echo ""

# 1. 检查数据库
if [ -f "prisma/dev.db" ]; then
    check_step "数据库文件存在" "ok"
else
    check_step "数据库文件不存在，需要运行: npx prisma db push" "error"
fi

# 2. 检查环境变量文件
if [ -f ".env.local" ]; then
    check_step ".env.local 文件存在" "ok"
    
    # 检查环境变量内容
    if grep -q "GOOGLE_CLIENT_ID" .env.local; then
        GOOGLE_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d ' ')
        if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" == "your-google-client-id-here" ]; then
            check_step "GOOGLE_CLIENT_ID 未配置" "error"
        else
            check_step "GOOGLE_CLIENT_ID 已配置: ${GOOGLE_CLIENT_ID:0:20}..." "ok"
        fi
    else
        check_step "GOOGLE_CLIENT_ID 未找到" "error"
    fi
    
    if grep -q "GOOGLE_CLIENT_SECRET" .env.local; then
        GOOGLE_CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d ' ')
        if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" == "your-google-client-secret-here" ]; then
            check_step "GOOGLE_CLIENT_SECRET 未配置" "error"
        else
            check_step "GOOGLE_CLIENT_SECRET 已配置: ${GOOGLE_CLIENT_SECRET:0:10}..." "ok"
        fi
    else
        check_step "GOOGLE_CLIENT_SECRET 未找到" "error"
    fi
    
    if grep -q "NEXTAUTH_SECRET" .env.local; then
        NEXTAUTH_SECRET=$(grep "NEXTAUTH_SECRET" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d ' ')
        if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" == "your-nextauth-secret-here" ]; then
            check_step "NEXTAUTH_SECRET 未配置" "warning"
        else
            check_step "NEXTAUTH_SECRET 已配置" "ok"
        fi
    else
        check_step "NEXTAUTH_SECRET 未找到" "warning"
    fi
else
    check_step ".env.local 文件不存在，需要创建" "error"
fi

echo ""
echo "🌐 Google Cloud Console 配置检查："
echo ""
echo "请检查以下项目是否已完成："
echo ""

echo "1. 📌 OAuth 同意屏幕配置"
echo "   访问: https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8"
echo "   ⚠️  必须完成所有步骤（应用信息、作用域、测试用户等）"
echo ""

echo "2. 🔑 OAuth 2.0 客户端ID创建"
echo "   访问: https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8"
echo "   ⚠️  必须创建Web应用程序类型的客户端ID"
echo ""

echo "3. 🔗 重定向URI配置"
echo "   必须包含: http://localhost:3000/api/auth/callback/google"
echo "   ⚠️  注意：不能有多余的斜杠或空格"
echo ""

echo "4. 🔌 API启用检查"
echo "   - Google+ API: https://console.cloud.google.com/apis/library/plus.googleapis.com?project=skilled-acolyte-476516-g8"
echo "   - Google Identity Services API: https://console.cloud.google.com/apis/library/people.googleapis.com?project=skilled-acolyte-476516-g8"
echo ""

# 检查是否有400错误的历史
echo "📊 错误诊断："
echo ""
if grep -q "callback/google 400" .next 2>/dev/null || [ -f "logs.txt" ] && grep -q "400" logs.txt 2>/dev/null; then
    echo -e "${YELLOW}⚠️${NC} 检测到 400 错误（redirect_uri_mismatch 或 invalid_client）"
    echo ""
    echo "可能的原因："
    echo "1. 重定向URI不匹配"
    echo "   - 检查Google Cloud Console中的重定向URI是否完全匹配："
    echo "     http://localhost:3000/api/auth/callback/google"
    echo ""
    echo "2. 客户端ID或密钥错误"
    echo "   - 检查.env.local中的GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET是否正确"
    echo ""
    echo "3. OAuth同意屏幕未完成"
    echo "   - 确保已保存所有配置步骤"
    echo ""
else
    echo -e "${GREEN}✅${NC} 未检测到明显的配置错误"
fi

echo ""
echo "📚 参考文档："
echo "   - 快速设置指南: GOOGLE_OAUTH_SETUP_STEPS.md"
echo "   - 详细配置文档: GOOGLE_OAUTH_QUICK_SETUP.md"
echo ""
echo "🚀 下一步操作："
echo "   1. 检查上面的每一项配置"
echo "   2. 确保.env.local中的凭据正确"
echo "   3. 重启开发服务器: npm run dev"
echo "   4. 测试登录: http://localhost:3000/auth/signin"
echo ""

