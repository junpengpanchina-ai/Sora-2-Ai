#!/bin/bash

# 本地部署检查脚本

echo "🔍 开始检查本地部署..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_pass() {
    echo -e "${GREEN}✅${NC} $1"
}

check_fail() {
    echo -e "${RED}❌${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. 环境变量检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 .env.local 文件
if [ ! -f ".env.local" ]; then
    check_fail ".env.local 文件不存在"
    echo "   请复制 env.local.template 并配置环境变量"
else
    check_pass ".env.local 文件存在"
fi

# 检查关键环境变量
if [ -f ".env.local" ]; then
    required_vars=("NEXTAUTH_SECRET" "DATABASE_URL" "NEXTAUTH_URL")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local && ! grep -q "^${var}=.*your-.*" .env.local; then
            check_pass "${var} 已配置"
        else
            check_fail "${var} 未配置或使用默认值"
        fi
    done
    
    # 检查 Google OAuth（可选）
    if grep -q "^GOOGLE_CLIENT_ID=" .env.local && ! grep -q "^GOOGLE_CLIENT_ID=.*your-google-client-id" .env.local; then
        check_pass "GOOGLE_CLIENT_ID 已配置"
    else
        check_warn "GOOGLE_CLIENT_ID 未配置（Google 登录将不可用）"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  2. 数据库检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 Prisma 配置
if [ -f "prisma/schema.prisma" ]; then
    check_pass "Prisma schema 文件存在"
    
    # 检查数据库文件
    if [ -f "prisma/dev.db" ]; then
        check_pass "数据库文件存在 (dev.db)"
    else
        check_warn "数据库文件不存在，可能需要运行迁移"
    fi
else
    check_fail "Prisma schema 文件不存在"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  3. 依赖检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 node_modules
if [ -d "node_modules" ]; then
    check_pass "node_modules 目录存在"
    
    # 检查关键依赖
    if [ -d "node_modules/next" ]; then
        check_pass "Next.js 已安装"
    else
        check_fail "Next.js 未安装，请运行: npm install"
    fi
    
    if [ -d "node_modules/@prisma/client" ]; then
        check_pass "Prisma Client 已安装"
    else
        check_fail "Prisma Client 未安装，请运行: npm install"
    fi
    
    if [ -d "node_modules/next-auth" ]; then
        check_pass "NextAuth.js 已安装"
    else
        check_fail "NextAuth.js 未安装，请运行: npm install"
    fi
else
    check_fail "node_modules 目录不存在"
    echo "   请运行: npm install"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  4. 构建文件检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 .next 目录
if [ -d ".next" ]; then
    check_pass ".next 构建目录存在"
    
    # 检查是否有缓存问题
    if [ -d ".next/cache" ]; then
        cache_size=$(du -sh .next/cache 2>/dev/null | cut -f1)
        check_warn "构建缓存大小: $cache_size"
        echo "   如果遇到 webpack 错误，尝试删除 .next 目录并重新构建"
    fi
else
    check_warn ".next 目录不存在（首次运行是正常的）"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  5. 端口检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查端口占用
PORT_3000=$(lsof -ti:3000 2>/dev/null | wc -l)
PORT_3001=$(lsof -ti:3001 2>/dev/null | wc -l)

if [ "$PORT_3000" -gt 0 ]; then
    check_pass "端口 3000 正在使用（服务器可能正在运行）"
    PROCESS=$(lsof -ti:3000 2>/dev/null | xargs ps -p 2>/dev/null | tail -1)
    echo "   进程信息: $PROCESS"
elif [ "$PORT_3001" -gt 0 ]; then
    check_warn "端口 3000 被占用，服务器可能在端口 3001 运行"
    PROCESS=$(lsof -ti:3001 2>/dev/null | xargs ps -p 2>/dev/null | tail -1)
    echo "   进程信息: $PROCESS"
else
    check_warn "端口 3000 和 3001 都未被占用，服务器可能未运行"
    echo "   请运行: npm run dev"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  6. 代码完整性检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查关键文件
key_files=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/lib/auth.ts"
    "src/lib/prisma.ts"
    "src/lib/stripe.ts"
    "package.json"
    "next.config.js"
    "tsconfig.json"
)

for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file 存在"
    else
        check_fail "$file 不存在"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  7. 已知问题检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 pricing 页面是否有旧代码
if [ -f "src/app/pricing/page.tsx" ]; then
    if grep -q "Starter.*Bronze.*Silver.*Gold.*Diamond" "src/app/pricing/page.tsx" 2>/dev/null; then
        check_fail "pricing 页面包含旧的套餐代码（应只有 Solo 和 Teams）"
    else
        check_pass "pricing 页面代码看起来正确"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  建议修复步骤"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "如果遇到 webpack 错误或构建问题："
echo "  1. 删除 .next 目录: rm -rf .next"
echo "  2. 清理缓存: rm -rf .next/cache"
echo "  3. 重新安装依赖: npm install"
echo "  4. 重新生成 Prisma Client: npx prisma generate"
echo "  5. 重新运行: npm run dev"
echo ""
echo "如果端口被占用："
echo "  1. 查找进程: lsof -ti:3000,3001"
echo "  2. 终止进程: kill -9 \$(lsof -ti:3000,3001)"
echo "  3. 重新运行: npm run dev"
echo ""
echo "如果数据库有问题："
echo "  1. 运行迁移: npx prisma migrate dev"
echo "  2. 生成 Client: npx prisma generate"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
