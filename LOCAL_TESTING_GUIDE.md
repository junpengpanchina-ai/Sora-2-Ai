# 🚀 本地测试指南

## ✅ 部署状态

您的Sora AI平台已成功本地部署！

### 🌐 访问地址
- **主页**: http://localhost:3000
- **定价页面**: http://localhost:3000/pricing
- **生成页面**: http://localhost:3000/generate
- **仪表板**: http://localhost:3000/dashboard

## 🔧 已完成的配置

### 1. 数据库设置
- ✅ SQLite数据库已创建
- ✅ Prisma模式已同步
- ✅ 用户表已更新（添加stripeCustomerId字段）

### 2. Stripe集成
- ✅ 支付流程已集成
- ✅ 客户门户功能已添加
- ✅ Webhook处理已完善
- ✅ 美元定价已配置

### 3. 功能测试

#### 定价页面测试
访问 http://localhost:3000/pricing 查看：
- ✅ 美元价格显示正确
- ✅ 三个订阅方案展示
- ✅ 管理订阅按钮（需要登录）

#### 支付流程测试
1. **创建Stripe产品**（需要Stripe密钥）：
   ```bash
   node scripts/create-stripe-products.js
   ```

2. **测试支付**：
   - 使用测试卡号：4242424242424242
   - 任意未来日期和CVC
   - 测试3D Secure：4000002500003155

## 🔑 环境变量配置

确保您的 `.env.local` 文件包含：

```bash
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe（测试环境）
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 可选：Stripe Tax
STRIPE_TAX_ENABLED="true"
```

## 🧪 测试步骤

### 1. 基础功能测试
- [ ] 访问主页
- [ ] 查看定价页面
- [ ] 测试用户注册/登录
- [ ] 访问仪表板

### 2. 支付功能测试
- [ ] 创建Stripe产品和价格
- [ ] 测试checkout session创建
- [ ] 测试支付流程
- [ ] 测试客户门户

### 3. Webhook测试
使用Stripe CLI测试webhook：
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🐛 常见问题

### 1. 数据库错误
```bash
npx prisma db push
npx prisma generate
```

### 2. 依赖问题
```bash
npm install
```

### 3. 端口占用
```bash
lsof -ti:3000 | xargs kill -9
```

## 📊 监控和日志

- 查看控制台日志了解API调用
- 检查数据库记录支付状态
- 使用Stripe Dashboard监控支付

## 🚀 下一步

1. **配置Stripe密钥**：获取测试环境的API密钥
2. **创建产品**：运行产品创建脚本
3. **测试支付**：使用测试卡号进行支付测试
4. **设置Webhook**：配置Stripe webhook端点

## 📞 支持

如有问题，请检查：
- 控制台错误日志
- 数据库连接状态
- Stripe API密钥配置
- 网络连接状态

---

🎉 **恭喜！您的Sora AI平台已成功本地部署并运行！**
