# 🚀 Vercel 部署指南

## 📋 部署前准备

### 1. 环境变量配置
在Vercel控制台中配置以下环境变量：

#### 必需变量
```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-jwt-key
DATABASE_URL=your-database-url
SORA_API_KEY=your-sora-api-key
NEXT_PUBLIC_SORA_API_KEY=your-sora-api-key
```

#### 可选变量
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe支付
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Redis缓存
REDIS_URL=your-redis-url
```

### 2. 数据库配置
推荐使用以下数据库服务：

#### 选项1：Vercel Postgres（推荐）
```bash
# 在Vercel控制台创建Postgres数据库
# 自动生成DATABASE_URL
```

#### 选项2：Supabase
```bash
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

#### 选项3：PlanetScale
```bash
DATABASE_URL=mysql://username:password@host:3306/database
```

## 🚀 部署步骤

### 方法一：Vercel CLI部署
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
cd sora-ai-platform
vercel

# 4. 配置环境变量
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add SORA_API_KEY
# ... 添加其他环境变量

# 5. 重新部署
vercel --prod
```

### 方法二：GitHub集成部署
1. 将代码推送到GitHub
2. 在Vercel控制台连接GitHub仓库
3. 设置根目录为 `sora-ai-platform`
4. 配置环境变量
5. 部署

### 方法三：手动上传
1. 构建项目：`npm run build`
2. 在Vercel控制台上传 `.next` 文件夹
3. 配置环境变量

## ⚙️ Vercel配置

### vercel.json配置
```json
{
  "version": 2,
  "rootDirectory": "sora-ai-platform",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 项目设置
- **Framework Preset**: Next.js
- **Root Directory**: `sora-ai-platform`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🔧 环境变量配置

### 在Vercel控制台添加环境变量：

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `your-secret-key` | Production, Preview, Development |
| `DATABASE_URL` | `your-database-url` | Production, Preview, Development |
| `SORA_API_KEY` | `your-sora-api-key` | Production, Preview, Development |
| `NEXT_PUBLIC_SORA_API_KEY` | `your-sora-api-key` | Production, Preview, Development |

## 🗄️ 数据库初始化

### 部署后初始化数据库：
```bash
# 使用Vercel CLI
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### 或使用Vercel Functions：
创建 `api/init-db/route.ts`：
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY)`
    return NextResponse.json({ message: 'Database initialized' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
}
```

## 🚨 常见问题解决

### 1. Next.js版本检测失败
**问题**: `No Next.js version detected`
**解决**: 确保 `vercel.json` 中设置了正确的 `rootDirectory`

### 2. 构建失败
**问题**: 构建过程中出现错误
**解决**: 
- 检查环境变量是否正确配置
- 确保所有依赖都已安装
- 检查TypeScript类型错误

### 3. 数据库连接失败
**问题**: 无法连接到数据库
**解决**:
- 检查 `DATABASE_URL` 格式
- 确保数据库服务可访问
- 检查网络连接

### 4. API路由404
**问题**: API路由返回404
**解决**:
- 检查路由文件位置
- 确保使用了正确的HTTP方法
- 检查中间件配置

## 📊 监控和日志

### 查看部署日志
```bash
# 使用Vercel CLI
vercel logs

# 或访问Vercel控制台
# 进入项目 → Functions → 查看日志
```

### 性能监控
- 访问 `/admin/performance` 查看性能指标
- 使用Vercel Analytics监控用户行为
- 配置错误监控（如Sentry）

## 🔄 持续部署

### 自动部署设置
1. 连接GitHub仓库
2. 设置自动部署分支（通常是 `main`）
3. 配置预览部署（Pull Request）
4. 设置生产部署（主分支）

### 部署钩子
```bash
# 手动触发部署
curl -X POST https://api.vercel.com/v1/integrations/deploy/your-hook-url
```

## 🎯 部署后检查

### 功能测试清单
- [ ] 主页加载正常
- [ ] 用户注册/登录功能
- [ ] 视频生成功能
- [ ] 支付功能（如果配置）
- [ ] API接口正常
- [ ] 数据库连接正常
- [ ] 文件上传功能
- [ ] 多语言切换

### 性能检查
- [ ] 页面加载速度
- [ ] API响应时间
- [ ] 数据库查询性能
- [ ] 静态资源加载

---

🎉 **部署完成！** 您的Sora AI平台已成功部署到Vercel！
