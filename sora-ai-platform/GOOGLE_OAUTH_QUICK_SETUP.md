# 🚀 Google OAuth 快速配置指南

## ❌ 当前问题
Google OAuth 返回 400 错误，这是因为缺少有效的 Google 客户端凭据。

## 🔧 立即解决方案

### 方案 1：快速配置 Google OAuth（推荐）

#### 步骤 1：创建 Google Cloud 项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击 "创建项目" 或选择现有项目
3. 项目名称：`Sora AI Platform`

#### 步骤 2：启用 Google+ API
1. 在左侧菜单选择 "API 和服务" > "库"
2. 搜索 "Google+ API" 并启用
3. 或者搜索 "Google Identity" 并启用

#### 步骤 3：创建 OAuth 2.0 凭据
1. 转到 "API 和服务" > "凭据"
2. 点击 "创建凭据" > "OAuth 2.0 客户端 ID"
3. 应用类型：**Web 应用**
4. 名称：`Sora AI Platform Web Client`

#### 步骤 4：配置重定向 URI
在 "授权重定向 URI" 中添加：
```
http://localhost:3000/api/auth/callback/google
```

#### 步骤 5：获取凭据
1. 创建完成后，复制 **客户端 ID** 和 **客户端密钥**
2. 更新 `.env.local` 文件：

```bash
# 更新这些值
GOOGLE_CLIENT_ID="你的实际客户端ID"
GOOGLE_CLIENT_SECRET="你的实际客户端密钥"
```

### 方案 2：临时禁用 Google 登录

如果暂时不想配置 Google OAuth，可以临时禁用：

#### 修改认证配置
编辑 `src/lib/auth.ts`，注释掉 Google Provider：

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // ... 现有配置
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  // ... 其他配置
}
```

#### 修改登录页面
在登录和注册页面中隐藏 Google 按钮：

```typescript
// 在 src/app/[locale]/auth/signin/page.tsx 中
{/* 临时隐藏 Google 登录 */}
{false && (
  <div className="mt-6">
    <Button variant="outline" onClick={handleGoogleSignIn}>
      <Icon name="google" className="w-5 h-5 mr-2" />
      {t.auth('signInWithGoogle')}
    </Button>
  </div>
)}
```

## 🎯 推荐配置步骤

### 1. 获取 Google OAuth 凭据
- 访问 [Google Cloud Console](https://console.cloud.google.com/)
- 创建项目并启用 Google+ API
- 创建 OAuth 2.0 客户端 ID
- 设置重定向 URI：`http://localhost:3000/api/auth/callback/google`

### 2. 更新环境变量
```bash
# 在 .env.local 中更新
GOOGLE_CLIENT_ID="你的实际客户端ID"
GOOGLE_CLIENT_SECRET="你的实际客户端密钥"
```

### 3. 重启服务器
```bash
npm run dev
```

### 4. 测试 Google 登录
- 访问 http://localhost:3000/en/auth/signin
- 点击 "使用 Google 登录" 按钮
- 完成 Google 授权流程

## 🔍 故障排除

### 常见错误
1. **400 错误** - 客户端 ID 或密钥无效
2. **重定向 URI 不匹配** - 检查 Google Console 中的 URI 配置
3. **API 未启用** - 确保 Google+ API 已启用

### 调试步骤
1. 检查 `.env.local` 文件中的凭据
2. 确认 Google Cloud Console 中的配置
3. 查看浏览器控制台错误信息
4. 检查 Next.js 服务器日志

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Google Cloud Console 的错误日志
2. 检查 Next.js 服务器控制台输出
3. 确认网络连接和防火墙设置

---

**注意**：Google OAuth 需要有效的客户端凭据才能工作。请按照上述步骤获取正确的凭据。


