# 🔒 安全配置指南

## ⚠️ 重要安全提醒

**永远不要在聊天中分享以下信息：**
- 数据库密码
- API密钥
- 私钥
- 任何敏感信息

## 🛡️ 安全配置步骤

### 1. 在本地创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```env
# Supabase 数据库配置
DATABASE_URL="postgresql://postgres:[您的密码]@db.[您的项目ID].supabase.co:5432/postgres"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="生成一个随机密钥"

# Google OAuth 配置
GOOGLE_CLIENT_ID="您的Google客户端ID"
GOOGLE_CLIENT_SECRET="您的Google客户端密钥"

# Stripe 配置
STRIPE_SECRET_KEY="您的Stripe密钥"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="您的Stripe公钥"
STRIPE_PRO_PRICE_ID="您的Stripe价格ID"
```

### 2. 获取Supabase连接信息

在Supabase Dashboard中：

1. **进入项目设置**：
   - 登录 Supabase Dashboard
   - 选择您的项目
   - 进入 Settings → Database

2. **复制连接字符串**：
   - 找到 "Connection string" 部分
   - 选择 "URI" 格式
   - 复制完整的连接字符串

3. **替换密码**：
   - 将 `[YOUR-PASSWORD]` 替换为您的数据库密码
   - 将 `[YOUR-PROJECT-REF]` 替换为您的项目引用ID

### 3. 生成安全的密钥

```bash
# 生成NextAuth密钥
openssl rand -base64 32
```

### 4. 验证配置

```bash
# 测试数据库连接
npx prisma db status

# 推送数据库模式
npx prisma db push
```

## 🔐 安全最佳实践

1. **环境变量文件**：
   - 永远不要提交 `.env.local` 到Git
   - 使用 `.gitignore` 忽略敏感文件

2. **密钥管理**：
   - 定期轮换密钥
   - 使用不同的密钥用于不同环境

3. **访问控制**：
   - 限制数据库访问权限
   - 使用最小权限原则

## 🚨 如果密钥泄露

1. **立即轮换**：
   - 在Supabase中重置数据库密码
   - 重新生成所有API密钥

2. **检查访问日志**：
   - 查看是否有异常访问
   - 监控数据库使用情况

3. **更新配置**：
   - 更新所有环境变量
   - 重新部署应用
