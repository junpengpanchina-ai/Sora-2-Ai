# 🎉 Stripe配置完成指南

## ✅ 您已获得的所有密钥：

### 生产环境密钥
- **Publishable Key**: `pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG`
- **Secret Key**: `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`

## 📝 立即创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

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
STRIPE_SECRET_KEY="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"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Sora API 配置
SORA_API_KEY="your-sora-api-key-here"
```

## 🛍️ 创建Stripe产品

### 方法1：使用自动化脚本（推荐）
```bash
# 安装Stripe依赖
npm install stripe

# 运行产品创建脚本
node scripts/create-stripe-products.js
```

### 方法2：手动在Dashboard创建
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 **Products** → **Add product**
3. 创建三个产品：

#### 基础版产品
- **名称**: Sora AI 基础版
- **价格**: ¥29/月
- **价格ID**: `price_basic_monthly`

#### 专业版产品
- **名称**: Sora AI 专业版
- **价格**: ¥99/月
- **价格ID**: `price_pro_monthly`

#### 企业版产品
- **名称**: Sora AI 企业版
- **价格**: ¥299/月
- **价格ID**: `price_enterprise_monthly`

## 🔗 配置Webhook端点

### 1. 创建Webhook端点
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 **Developers** → **Webhooks**
3. 点击 **Add endpoint**

### 2. 配置端点
- **端点URL**: `https://yourdomain.com/api/stripe/webhook`
- **描述**: Sora AI Platform Webhook

### 3. 选择事件
选择以下事件：
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 4. 获取Webhook Secret
- 创建后，复制 **"Signing secret"**（以`whsec_`开头）
- 更新 `.env.local` 文件中的 `STRIPE_WEBHOOK_SECRET`

## 🚀 启动项目

```bash
# 1. 安装依赖
npm install

# 2. 创建数据库
npx prisma db push

# 3. 启动开发服务器
npm run dev
```

## 🧪 测试支付流程

1. 访问：http://localhost:3000/pricing
2. 选择订阅方案
3. 使用测试卡号：`4242 4242 4242 4242`
4. 验证支付流程

## ⚠️ 重要安全提醒

1. **生产环境密钥**：您的密钥是生产环境密钥，会处理真实付款
2. **安全存储**：永远不要将密钥提交到代码仓库
3. **监控设置**：建议设置支付异常监控
4. **测试建议**：建议先在测试环境验证功能

## 🎯 下一步行动清单

- [x] 获取Stripe API密钥
- [x] 创建环境变量文件
- [ ] 创建Stripe产品
- [ ] 配置Webhook端点
- [ ] 测试支付流程
- [ ] 部署到生产环境

## 📞 需要帮助？

如果遇到问题：
- 检查控制台错误信息
- 验证环境变量配置
- 确认Stripe Dashboard中的产品设置



