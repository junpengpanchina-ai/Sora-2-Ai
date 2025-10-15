# 数据库配置说明

## 当前状态
- ❌ **数据库未连接**：目前使用JWT认证，无数据库存储
- ✅ **功能正常**：登录、注册、支付等功能使用模拟数据

## 数据库连接选项

### 选项1：本地PostgreSQL（推荐开发）
```bash
# 安装PostgreSQL
brew install postgresql
brew services start postgresql

# 创建数据库
createdb sora_ai_platform
```

### 选项2：云端数据库服务
- **Vercel Postgres**：与Vercel部署集成
- **Supabase**：免费PostgreSQL服务
- **Railway**：PostgreSQL托管服务

### 选项3：SQLite（快速测试）
修改 `prisma/schema.prisma`：
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 环境变量配置

创建 `.env.local` 文件：
```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/sora_ai_platform"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth 配置
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe 配置
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
```

## 启用数据库连接

1. **取消注释PrismaAdapter**：
```typescript
// src/lib/auth.ts
adapter: PrismaAdapter(prisma), // 取消注释
```

2. **运行数据库迁移**：
```bash
npx prisma generate
npx prisma db push
```

3. **重启开发服务器**：
```bash
npm run dev
```

## 当前优势
- ✅ **快速开发**：无需数据库配置即可测试
- ✅ **功能完整**：所有功能都能正常工作
- ✅ **易于部署**：减少部署复杂度

## 生产环境建议
- 使用云端PostgreSQL服务
- 配置环境变量
- 启用数据库连接
- 实现数据持久化
