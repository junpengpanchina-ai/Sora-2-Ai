# 🚀 快速配置指南

## ⚠️ 安全提醒
- 永远不要在聊天中分享敏感信息
- 包括：密码、密钥、URL等

## 🔧 配置步骤

### 1. 创建环境变量文件
在项目根目录创建 `.env.local`：

```env
# Supabase 数据库配置
DATABASE_URL="postgresql://postgres:[新密码]@db.[项目ID].supabase.co:5432/postgres"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="生成随机密钥"

# Google OAuth 配置
GOOGLE_CLIENT_ID="您的Google客户端ID"
GOOGLE_CLIENT_SECRET="您的Google客户端密钥"
```

### 2. 生成安全密钥
```bash
# 生成NextAuth密钥
openssl rand -base64 32
```

### 3. 测试配置
```bash
# 测试数据库连接
npx prisma db status

# 推送数据库模式
npx prisma db push
```

### 4. 启用数据库认证
修改 `src/lib/auth.ts`：
```typescript
adapter: PrismaAdapter(prisma), // 取消注释
```

### 5. 重启服务器
```bash
npm run dev
```

## 🛡️ 安全最佳实践
1. 使用强密码
2. 定期轮换密钥
3. 监控访问日志
4. 不要分享敏感信息
