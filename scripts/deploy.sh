#!/bin/bash

# Sora AI 生产环境部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

echo "🚀 开始部署 Sora AI 到生产环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境变量
check_env() {
    echo "📋 检查环境变量..."
    
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}❌ 未找到 .env.production 文件${NC}"
        echo "请复制 env.production.example 为 .env.production 并填入实际值"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 环境变量文件存在${NC}"
}

# 安装依赖
install_dependencies() {
    echo "📦 安装生产依赖..."
    
    npm ci --only=production
    
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 构建应用
build_app() {
    echo "🔨 构建应用..."
    
    # 清理之前的构建
    rm -rf .next
    
    # 构建应用
    npm run build
    
    echo -e "${GREEN}✅ 应用构建完成${NC}"
}

# 数据库迁移
migrate_database() {
    echo "🗄️ 执行数据库迁移..."
    
    # 生成 Prisma 客户端
    npx prisma generate
    
    # 推送数据库模式
    npx prisma db push
    
    echo -e "${GREEN}✅ 数据库迁移完成${NC}"
}

# 创建必要目录
create_directories() {
    echo "📁 创建必要目录..."
    
    sudo mkdir -p /var/log/sora-ai
    sudo mkdir -p /var/uploads/sora-ai
    sudo chown -R $USER:$USER /var/log/sora-ai
    sudo chown -R $USER:$USER /var/uploads/sora-ai
    
    echo -e "${GREEN}✅ 目录创建完成${NC}"
}

# 创建 systemd 服务
create_systemd_service() {
    echo "⚙️ 创建 systemd 服务..."
    
    sudo tee /etc/systemd/system/sora-ai.service > /dev/null <<EOF
[Unit]
Description=Sora AI Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable sora-ai
    
    echo -e "${GREEN}✅ systemd 服务创建完成${NC}"
}

# 启动服务
start_service() {
    echo "🚀 启动服务..."
    
    sudo systemctl start sora-ai
    sudo systemctl status sora-ai --no-pager
    
    echo -e "${GREEN}✅ 服务启动完成${NC}"
}

# 配置 Nginx
configure_nginx() {
    echo "🌐 配置 Nginx..."
    
    sudo tee /etc/nginx/sites-available/sora-ai > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL 配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # 静态文件
    location /_next/static/ {
        alias $(pwd)/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 路由
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # 主应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/sora-ai /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    echo -e "${GREEN}✅ Nginx 配置完成${NC}"
}

# 健康检查
health_check() {
    echo "🏥 执行健康检查..."
    
    sleep 5
    
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用健康检查通过${NC}"
    else
        echo -e "${RED}❌ 应用健康检查失败${NC}"
        exit 1
    fi
}

# 主函数
main() {
    echo -e "${YELLOW}🚀 Sora AI 生产环境部署开始${NC}"
    echo "=================================="
    
    check_env
    install_dependencies
    build_app
    migrate_database
    create_directories
    create_systemd_service
    start_service
    configure_nginx
    health_check
    
    echo "=================================="
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo "应用运行在: http://localhost:3000"
    echo "Nginx 配置: /etc/nginx/sites-available/sora-ai"
    echo "服务管理: sudo systemctl start/stop/restart sora-ai"
    echo "日志查看: sudo journalctl -u sora-ai -f"
}

# 执行主函数
main "$@"
