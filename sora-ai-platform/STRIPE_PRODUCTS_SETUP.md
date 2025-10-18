# 🛍️ Stripe产品创建指南

## ✅ 您已获得的生产环境密钥：
- **Publishable Key**: `pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG`

⚠️ **重要提醒**：这是生产环境密钥，会处理真实付款！

## 🔑 还需要获取的密钥：

### 1. Secret Key
- 登录 [Stripe Dashboard](https://dashboard.stripe.com)
- 进入 **Developers** → **API keys**
- 复制 **Secret key**（以`sk_live_`开头）

### 2. Webhook Secret
- 创建Webhook后获取（以`whsec_`开头）

## 🛍️ 在Stripe中创建产品

### 步骤1：进入产品页面
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 点击左侧菜单 **"Products"**
3. 点击 **"Add product"**

### 步骤2：创建基础版产品
```
产品名称: Sora AI 基础版
描述: 适合个人用户的AI视频生成服务
价格: ¥29/月
计费周期: 每月
价格ID: price_basic_monthly
```

### 步骤3：创建专业版产品
```
产品名称: Sora AI 专业版
描述: 适合内容创作者的高级AI视频生成服务
价格: ¥99/月
计费周期: 每月
价格ID: price_pro_monthly
```

### 步骤4：创建企业版产品
```
产品名称: Sora AI 企业版
描述: 适合团队和企业的企业级AI视频生成服务
价格: ¥299/月
计费周期: 每月
价格ID: price_enterprise_monthly
```

## 🔗 配置Webhook

### 步骤1：创建Webhook端点
1. Dashboard → **"Developers"** → **"Webhooks"**
2. 点击 **"Add endpoint"**

### 步骤2：配置端点
```
端点URL: https://yourdomain.com/api/stripe/webhook
描述: Sora AI Platform Webhook
```

### 步骤3：选择事件
选择以下事件：
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 步骤4：获取Webhook Secret
创建后，复制 **"Signing secret"**（以`whsec_`开头）

## 📝 环境变量配置

创建 `.env.local` 文件：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Stripe 生产环境配置
STRIPE_SECRET_KEY="sk_live_your_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51SC17u7EnbQTQa8yZiXL4Ln16DuIrr9nrujziUjeBh9aOnGLiS0wSSmkPyi69GZEkKGv2B9XHfOSlVoDawGB439o00ez1oyfeG"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Sora API 配置
SORA_API_KEY="your-sora-api-key-here"
```

## ⚠️ 重要提醒

1. **生产环境密钥**：您提供的是生产环境密钥，会处理真实付款
2. **安全存储**：永远不要将密钥提交到代码仓库
3. **测试建议**：建议先在测试环境验证功能
4. **监控**：设置支付异常监控和告警

## 🎯 下一步行动

1. ✅ 已获得Publishable Key
2. ⏳ 获取Secret Key
3. ⏳ 创建三个订阅产品
4. ⏳ 配置Webhook端点
5. ⏳ 测试支付流程
