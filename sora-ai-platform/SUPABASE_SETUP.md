# Supabase 数据库配置指南

## 🎯 配置步骤

### 1. 获取Supabase连接信息

在您的Supabase Dashboard中：

1. **数据库URL**：
   - 进入 Settings → Database
   - 复制 "Connection string" 中的 PostgreSQL URL
   - 格式：`postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

2. **API信息**：
   - 进入 Settings → API
   - 复制 "Project URL" 和 "anon public" key

### 2. 创建环境变量文件

创建 `.env.local` 文件（在项目根目录）：

```env
# Supabase 数据库配置
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

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

### 3. 安装Supabase客户端（可选）

```bash
npm install @supabase/supabase-js
```

### 4. 配置Prisma连接

Prisma已经配置为PostgreSQL，无需修改。

### 5. 运行数据库迁移

```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库模式到Supabase
npx prisma db push

# 查看数据库状态
npx prisma studio
```

### 6. 启用数据库认证

修改 `src/lib/auth.ts`：

```typescript
// 取消注释这行
adapter: PrismaAdapter(prisma),
```

## 🔧 配置完成后

1. **重启开发服务器**：
   ```bash
   npm run dev
   ```

2. **测试数据库连接**：
   - 访问 `/auth/signup` 注册新用户
   - 检查Supabase Dashboard中的用户数据

3. **验证功能**：
   - 用户注册/登录
   - 视频生成记录
   - 订阅状态管理

## 🎯 Supabase优势

- ✅ **免费额度**：每月500MB数据库存储
- ✅ **实时功能**：支持实时数据同步
- ✅ **内置认证**：可替代NextAuth.js
- ✅ **自动备份**：数据安全有保障
- ✅ **简单部署**：与Vercel集成良好

## 🚨 注意事项

1. **密码安全**：确保数据库密码安全
2. **环境变量**：不要将 `.env.local` 提交到Git
3. **API限制**：注意Supabase的API调用限制
4. **备份数据**：定期备份重要数据
