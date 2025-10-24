#!/bin/bash

# Sora AI 平台部署检查脚本
echo "🔍 检查 Sora AI 平台部署状态..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# 检查Node.js版本
echo "📦 检查Node.js版本..."
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js版本: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js未安装或版本过低${NC}"
    exit 1
fi

# 检查npm版本
echo "📦 检查npm版本..."
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ npm版本: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm未安装${NC}"
    exit 1
fi

# 检查依赖安装
echo "📦 检查项目依赖..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ 依赖已安装${NC}"
else
    echo -e "${YELLOW}⚠️  依赖未安装，正在安装...${NC}"
    npm install
    check_status $? "依赖安装"
fi

# 检查环境变量文件
echo "🔧 检查环境配置..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local 文件存在${NC}"
    
    # 检查关键环境变量
    if grep -q "SORA_API_KEY" .env.local && ! grep -q "your-sora-api-key-here" .env.local; then
        echo -e "${GREEN}✅ SORA_API_KEY 已配置${NC}"
    else
        echo -e "${YELLOW}⚠️  SORA_API_KEY 需要配置${NC}"
    fi
    
    if grep -q "NEXTAUTH_SECRET" .env.local && ! grep -q "your-super-secret" .env.local; then
        echo -e "${GREEN}✅ NEXTAUTH_SECRET 已配置${NC}"
    else
        echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET 需要配置${NC}"
    fi
else
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
    echo "💡 运行 ./setup-env.sh 创建环境配置文件"
    exit 1
fi

# 检查数据库
echo "🗄️  检查数据库配置..."
if grep -q "DATABASE_URL" .env.local; then
    DB_URL=$(grep "DATABASE_URL" .env.local | cut -d'=' -f2 | tr -d '"')
    if [[ $DB_URL == file:* ]]; then
        echo -e "${GREEN}✅ 使用SQLite数据库${NC}"
    elif [[ $DB_URL == postgresql:* ]]; then
        echo -e "${GREEN}✅ 使用PostgreSQL数据库${NC}"
    else
        echo -e "${YELLOW}⚠️  数据库配置需要检查${NC}"
    fi
else
    echo -e "${RED}❌ 数据库配置缺失${NC}"
fi

# 检查Docker（可选）
echo "🐳 检查Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker已安装${NC}"
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose已安装${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker Compose未安装${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker未安装（可选）${NC}"
fi

# 检查端口占用
echo "🌐 检查端口占用..."
if lsof -i :3000 &> /dev/null; then
    echo -e "${YELLOW}⚠️  端口3000已被占用${NC}"
    echo "💡 可以修改端口或停止占用进程"
else
    echo -e "${GREEN}✅ 端口3000可用${NC}"
fi

# 检查构建
echo "🔨 检查项目构建..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✅ 项目已构建${NC}"
else
    echo -e "${YELLOW}⚠️  项目未构建，正在构建...${NC}"
    npm run build
    check_status $? "项目构建"
fi

echo ""
echo "🎯 部署检查完成！"
echo ""
echo "📋 下一步操作："
echo "   1. 配置 .env.local 中的API密钥"
echo "   2. 运行: npm run dev"
echo "   3. 访问: http://localhost:3000"
echo ""
echo "🐳 或使用Docker部署："
echo "   1. docker-compose up -d"
echo "   2. 访问: http://localhost:3000"
