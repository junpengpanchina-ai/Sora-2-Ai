# 🚀 Vercel部署指南 - Speed Insights集成

## 📋 部署前检查

### ✅ 已完成的功能
- ✅ Speed Insights已集成
- ✅ 构建成功通过
- ✅ 所有依赖已安装
- ✅ 代码已提交到Git

### 🔧 环境变量配置

在Vercel Dashboard中配置以下环境变量：

```bash
# 数据库配置
DATABASE_URL="your-production-database-url"

# NextAuth配置
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"

# Stripe配置（生产环境）
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 可选：Stripe Tax
STRIPE_TAX_ENABLED="true"
```

## 🚀 部署步骤

### 方法1: Vercel CLI部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 生产部署
vercel --prod
```

### 方法2: GitHub集成部署

1. **连接GitHub仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择您的GitHub仓库

2. **配置项目设置**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **环境变量设置**
   - 在项目设置中添加所有必需的环境变量
   - 确保Stripe密钥使用生产环境密钥

## 📊 Speed Insights测试

### 部署后测试步骤

1. **访问部署的网站**
   ```bash
   # 获取部署URL
   vercel ls
   ```

2. **导航测试**
   - 访问主页
   - 浏览定价页面
   - 测试用户注册/登录
   - 访问仪表板

3. **等待数据收集**
   - 等待30秒让Speed Insights收集数据
   - 检查浏览器控制台是否有错误
   - 确保没有内容拦截器阻止数据收集

### 🔍 验证Speed Insights

**检查数据收集**
1. 访问Vercel Dashboard
2. 选择您的项目
3. 点击 "Speed Insights" 标签
4. 查看性能数据

**预期指标**
- **LCP**: < 2.5秒
- **FID**: < 100毫秒
- **CLS**: < 0.1

## 🐛 故障排除

### 常见问题

**1. 没有数据收集**
- 检查是否有广告拦截器
- 确认环境变量配置正确
- 等待30秒后刷新页面

**2. 构建失败**
- 检查环境变量是否完整
- 确认数据库连接正常
- 查看构建日志

**3. 性能数据异常**
- 检查网络连接
- 确认页面完全加载
- 测试不同设备

### 🔧 调试命令

```bash
# 检查构建
npm run build

# 本地测试
npm run dev

# 检查环境变量
vercel env ls

# 查看部署日志
vercel logs
```

## 📈 性能优化建议

### 基于Speed Insights数据

**如果LCP > 2.5秒**
- 优化图片加载
- 减少JavaScript包大小
- 使用CDN加速

**如果FID > 100毫秒**
- 减少主线程阻塞
- 优化第三方脚本
- 使用代码分割

**如果CLS > 0.1**
- 为图片设置尺寸
- 避免动态内容插入
- 使用骨架屏

## 🎯 监控和维护

### 持续监控
- 定期检查Speed Insights数据
- 设置性能警报
- 监控Core Web Vitals趋势

### 优化策略
- 根据数据优化慢页面
- 实施性能预算
- 定期更新依赖

---

🎉 **部署完成后，您将拥有完整的性能监控能力！**
