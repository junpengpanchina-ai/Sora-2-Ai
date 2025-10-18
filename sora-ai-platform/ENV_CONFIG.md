# 🔧 环境变量配置指南

## ✅ 您已获得的Stripe密钥：
- **Publishable Key**: `pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG`

## 📝 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件，内容如下：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth 配置 (可选)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe 生产环境配置
STRIPE_SECRET_KEY="sk_live_your_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Sora API 配置
SORA_API_KEY="your-sora-api-key-here"
```

## 🔑 还需要获取的密钥：

### 1. Stripe Secret Key
- 登录 [Stripe Dashboard](https://dashboard.stripe.com)
- 进入 **Developers** → **API keys**
- 复制 **Secret key**（以`sk_live_`开头）

### 2. Webhook Secret
- 创建Webhook后获取（以`whsec_`开头）

### 3. NextAuth Secret
生成一个随机密钥：
```bash
openssl rand -base64 32
```

## ⚠️ 重要安全提醒

1. **生产环境密钥**：您提供的是生产环境密钥，会处理真实付款
2. **安全存储**：永远不要将密钥提交到代码仓库
3. **环境隔离**：建议先在测试环境验证功能
4. **监控设置**：设置支付异常监控和告警

## 🚀 快速启动

1. 创建 `.env.local` 文件
2. 添加您的Stripe Secret Key
3. 运行产品创建脚本：
   ```bash
   node scripts/create-stripe-products.js
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```

