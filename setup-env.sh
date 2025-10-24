#!/bin/bash

# Sora AI 平台环境配置脚本
echo "🚀 开始配置 Sora AI 平台环境变量..."

# 检查是否已存在 .env.local 文件
if [ -f ".env.local" ]; then
    echo "⚠️  发现已存在的 .env.local 文件"
    read -p "是否要备份现有配置？(y/n): " backup_choice
    if [ "$backup_choice" = "y" ]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ 已备份现有配置"
    fi
fi

# 创建 .env.local 文件
cat > .env.local << 'EOF'
# ===========================================
# Sora AI 平台环境变量配置
# ===========================================

# ===========================================
# 基础配置
# ===========================================
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production

# ===========================================
# 数据库配置
# ===========================================
# 开发环境使用SQLite（默认）
DATABASE_URL="file:./dev.db"

# 生产环境使用PostgreSQL（取消注释并配置）
# DATABASE_URL="postgresql://postgres:password@localhost:5432/sora_ai"

# ===========================================
# 认证配置
# ===========================================
# Google OAuth（可选）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ===========================================
# Sora API 配置
# ===========================================
# Sora API密钥（必需）
SORA_API_KEY=your-sora-api-key-here
NEXT_PUBLIC_SORA_API_KEY=your-sora-api-key-here

# ===========================================
# Stripe 支付配置（可选）
# ===========================================
# Stripe密钥
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ===========================================
# Redis 配置（可选）
# ===========================================
REDIS_URL=redis://localhost:6379

# ===========================================
# 邮件配置（可选）
# ===========================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# ===========================================
# 文件上传配置
# ===========================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# ===========================================
# 安全配置
# ===========================================
# 加密密钥（用于敏感数据加密）
ENCRYPTION_KEY=your-32-character-encryption-key

# ===========================================
# 监控和日志
# ===========================================
# 日志级别
LOG_LEVEL=info

# 性能监控（可选）
# SENTRY_DSN=your-sentry-dsn
# ANALYTICS_ID=your-analytics-id

# ===========================================
# 开发工具配置
# ===========================================
# 调试模式
DEBUG=false

# 热重载
FAST_REFRESH=true
EOF

echo "✅ 已创建 .env.local 文件"

# 生成随机密钥
echo "🔐 生成安全密钥..."
SECRET_KEY=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 16)

# 更新密钥
sed -i.bak "s/your-super-secret-jwt-key-change-this-in-production/$SECRET_KEY/g" .env.local
sed -i.bak "s/your-32-character-encryption-key/$ENCRYPTION_KEY/g" .env.local
rm .env.local.bak

echo "✅ 已生成安全密钥"

echo ""
echo "🎉 环境配置完成！"
echo ""
echo "📝 接下来需要配置的变量："
echo "   1. SORA_API_KEY - Sora API密钥（必需）"
echo "   2. GOOGLE_CLIENT_ID/SECRET - Google OAuth（可选）"
echo "   3. STRIPE_* - Stripe支付配置（可选）"
echo ""
echo "💡 请编辑 .env.local 文件并填入实际值"
echo "🚀 然后运行: npm run dev"
