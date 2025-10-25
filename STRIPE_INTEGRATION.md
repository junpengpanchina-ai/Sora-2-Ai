# Stripe支付集成最佳实践

本文档说明如何将Stripe的checkout-single-subscription示例项目集成到我们的支付系统中。

## 🚀 已实现的功能

### 1. 增强的Checkout Session
- ✅ 客户管理：自动创建或获取Stripe客户
- ✅ 本地化支持：支持中文和英文界面
- ✅ 地址收集：自动收集账单地址
- ✅ 税务支持：集成Stripe Tax自动计算

### 2. 客户门户
- ✅ 订阅管理：用户可以查看、修改、取消订阅
- ✅ 支付方式管理：更新信用卡信息
- ✅ 发票历史：查看历史账单

### 3. 完善的Webhook处理
- ✅ `checkout.session.completed` - 支付完成
- ✅ `customer.subscription.updated` - 订阅更新
- ✅ `customer.subscription.deleted` - 订阅取消
- ✅ `invoice.payment_succeeded` - 支付成功
- ✅ `invoice.payment_failed` - 支付失败

### 4. 用户体验优化
- ✅ 支付成功页面：引导用户下一步操作
- ✅ 支付取消页面：提供替代方案
- ✅ 错误处理：友好的错误提示

## 🔧 配置说明

### 环境变量
```bash
# 必需配置
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 可选配置
STRIPE_TAX_ENABLED=true  # 启用Stripe Tax
```

### 数据库迁移
运行以下命令更新数据库模式：
```bash
npx prisma db push
```

## 📋 API端点

### 创建Checkout Session
```
POST /api/stripe/create-checkout-session
```
参数：
- `priceId`: Stripe价格ID
- `plan`: 订阅计划
- `locale`: 语言设置（zh/en）

### 创建客户门户
```
POST /api/stripe/create-portal-session
```
参数：
- `returnUrl`: 返回URL

## 🎯 使用示例

### 前端调用
```javascript
// 创建订阅
const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_xxx',
    plan: 'pro',
    locale: 'zh'
  })
})

// 管理订阅
const portalResponse = await fetch('/api/stripe/create-portal-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    returnUrl: window.location.href
  })
})
```

## 🔒 安全最佳实践

1. **Webhook验证**：所有webhook都经过签名验证
2. **客户隔离**：每个用户都有独立的Stripe客户
3. **数据同步**：支付状态实时同步到数据库
4. **错误处理**：完善的错误日志和用户提示

## 📊 监控和日志

- 所有支付事件都有详细日志
- 支持Stripe Dashboard监控
- 数据库记录完整的支付历史

## 🌍 国际化支持

- 支持中文和英文界面
- 自动税务计算（如果启用Stripe Tax）
- 本地化的支付页面

## 🚀 部署注意事项

1. 确保设置正确的webhook端点
2. 配置生产环境的Stripe密钥
3. 启用Stripe Tax（如需要）
4. 测试所有支付流程

## 📚 参考资源

- [Stripe Checkout文档](https://stripe.com/docs/checkout)
- [Stripe Billing Portal文档](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Tax文档](https://stripe.com/docs/tax)
- [Webhook事件参考](https://stripe.com/docs/api/events/types)
