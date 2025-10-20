# Google OAuth 快速注册配置指南

## 🎉 Google 快速注册功能已实现！

应用已经支持 Google OAuth 快速注册和登录功能。用户可以通过 Google 账户快速注册和登录，无需手动填写表单。

## 📱 功能特性

### ✅ 已实现的功能
- **Google 登录按钮** - 在登录和注册页面都有 Google 登录按钮
- **自动用户创建** - 首次使用 Google 登录会自动创建用户账户
- **数据库集成** - 使用 Prisma 适配器自动保存用户信息
- **多语言支持** - 支持中英文界面
- **智能跳转** - 登录后自动跳转到仪表板

### 🎯 用户体验
- **一键注册** - 点击 Google 按钮即可完成注册
- **快速登录** - 已注册用户可直接登录
- **无缝体验** - 无需记住密码，使用 Google 账户即可

## 🔧 配置步骤

### 1. 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID

### 2. 配置 OAuth 凭据

在 Google Cloud Console 中：
- **应用类型**: Web 应用
- **授权重定向 URI**: `http://localhost:3000/api/auth/callback/google`
- **生产环境 URI**: `https://yourdomain.com/api/auth/callback/google`

### 3. 设置环境变量

创建 `.env.local` 文件：

```bash
# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="file:./dev.db"
```

### 4. 获取 Google OAuth 凭据

1. 在 Google Cloud Console 中，转到 "凭据" 页面
2. 点击 "创建凭据" > "OAuth 2.0 客户端 ID"
3. 选择 "Web 应用"
4. 添加授权重定向 URI
5. 复制客户端 ID 和客户端密钥

## 🚀 使用方法

### 用户端操作
1. 访问 http://localhost:3000/en/auth/signup
2. 点击 "使用 Google 注册" 按钮
3. 选择 Google 账户
4. 授权应用访问基本信息
5. 自动完成注册并登录

### 开发者测试
1. 确保环境变量已正确设置
2. 重启开发服务器：`npm run dev`
3. 访问登录页面测试 Google 登录功能

## 📋 技术实现

### 认证配置
```typescript
// src/lib/auth.ts
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

### 数据库适配器
```typescript
// 使用 Prisma 适配器自动处理用户创建
adapter: PrismaAdapter(prisma)
```

### 用户界面
- 登录页面：`/en/auth/signin`
- 注册页面：`/en/auth/signup`
- 两个页面都有 Google 登录按钮

## 🔒 安全特性

- **OAuth 2.0 标准** - 使用行业标准的认证协议
- **HTTPS 重定向** - 生产环境使用安全连接
- **最小权限原则** - 只请求必要的用户信息
- **会话管理** - 使用 JWT 进行会话管理

## 🌐 多语言支持

- **英文**: "Sign in with Google" / "Sign up with Google"
- **中文**: "使用 Google 登录" / "使用 Google 注册"

## 📞 故障排除

### 常见问题

1. **"OAuth 错误"**
   - 检查 Google 客户端 ID 和密钥是否正确
   - 确认重定向 URI 配置正确

2. **"重定向 URI 不匹配"**
   - 在 Google Cloud Console 中添加正确的重定向 URI
   - 确保协议（http/https）和端口号正确

3. **"用户创建失败"**
   - 检查数据库连接
   - 确认 Prisma 适配器配置正确

### 调试步骤

1. 检查环境变量是否正确设置
2. 查看浏览器控制台错误信息
3. 检查 Next.js 服务器日志
4. 验证 Google Cloud Console 配置

## 🎯 下一步

- [ ] 配置生产环境 OAuth 凭据
- [ ] 添加更多 OAuth 提供商（GitHub、Facebook 等）
- [ ] 实现用户头像显示
- [ ] 添加账户关联功能

---

**注意**: 请确保在生产环境中使用 HTTPS 和正确的域名配置 OAuth 重定向 URI。
