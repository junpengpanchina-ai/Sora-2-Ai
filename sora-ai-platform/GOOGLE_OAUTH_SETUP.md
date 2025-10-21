# Google 快速登录设置指南

## 🚀 快速设置步骤

### 1. 创建 Google OAuth 应用

#### 步骤 1：访问 Google Cloud Console
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 登录你的 Google 账户

#### 步骤 2：创建或选择项目
1. 点击项目选择器（顶部左侧）
2. 如果没有项目，点击"新建项目"
3. 输入项目名称：`Sora AI Platform`
4. 点击"创建"

#### 步骤 3：启用必要的 API
1. 在左侧菜单中，选择"API 和服务" > "库"
2. 搜索并启用以下 API：
   - **Google+ API** 或 **Google Identity API**
   - **People API**（可选，用于获取用户信息）

#### 步骤 4：创建 OAuth 2.0 凭据
1. 转到"API 和服务" > "凭据"
2. 点击"+ 创建凭据" > "OAuth 2.0 客户端 ID"
3. 如果提示配置 OAuth 同意屏幕，选择"外部"用户类型
4. 填写应用信息：
   - **应用名称**：`Sora AI Platform`
   - **用户支持电子邮件**：你的邮箱
   - **开发者联系信息**：你的邮箱
5. 在"范围"部分，添加以下范围：
   - `openid`
   - `email`
   - `profile`
6. 在"测试用户"部分，添加你的邮箱（用于测试）

#### 步骤 5：配置 OAuth 客户端
1. 选择"Web 应用程序"作为应用类型
2. 输入应用名称：`Sora AI Platform`
3. 在"已获授权的重定向 URI"中添加：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. 如果部署到生产环境，还要添加：
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
5. 点击"创建"

#### 步骤 6：获取凭据
创建完成后，你会看到：
- **客户端 ID**：类似 `123456789-abcdefg.apps.googleusercontent.com`
- **客户端密钥**：类似 `GOCSPX-abcdefghijklmnopqrstuvwxyz`

### 2. 配置环境变量

更新你的 `.env.local` 文件：

```bash
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth 配置
GOOGLE_CLIENT_ID="你的实际客户端ID"
GOOGLE_CLIENT_SECRET="你的实际客户端密钥"

# 其他配置...
```

### 3. 测试 Google 登录

1. **重启开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问登录页面**：
   - 打开 `http://localhost:3000/en/auth/signin`
   - 你应该能看到 Google 登录按钮

3. **测试 Google 登录**：
   - 点击 Google 登录按钮
   - 会跳转到 Google 授权页面
   - 授权后会自动跳转回你的应用

### 4. 常见问题解决

#### 问题 1：400 错误
- **原因**：客户端 ID 或密钥不正确
- **解决**：检查 `.env.local` 中的配置是否正确

#### 问题 2：重定向 URI 不匹配
- **原因**：重定向 URI 配置不正确
- **解决**：确保 Google Console 中的重定向 URI 与你的应用 URL 匹配

#### 问题 3：OAuth 同意屏幕问题
- **原因**：应用未通过 Google 验证
- **解决**：在测试阶段，确保将你的邮箱添加到"测试用户"列表中

### 5. 生产环境部署

部署到生产环境时，需要：

1. **更新重定向 URI**：
   - 在 Google Console 中添加生产环境的回调 URL
   - 例如：`https://yourdomain.com/api/auth/callback/google`

2. **更新环境变量**：
   ```bash
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="你的生产环境客户端ID"
   GOOGLE_CLIENT_SECRET="你的生产环境客户端密钥"
   ```

3. **域名验证**：
   - 确保你的域名已通过 Google 验证
   - 如果使用自定义域名，需要在 Google Console 中配置

### 6. 安全注意事项

1. **保护客户端密钥**：
   - 永远不要将客户端密钥提交到代码仓库
   - 使用环境变量存储敏感信息

2. **限制重定向 URI**：
   - 只添加必要的重定向 URI
   - 避免使用通配符

3. **定期轮换密钥**：
   - 定期更新客户端密钥
   - 监控异常登录活动

## 🎉 完成！

设置完成后，用户就可以使用 Google 账户快速登录你的应用了！

### 功能特点：
- ✅ 一键 Google 登录
- ✅ 自动获取用户信息（姓名、邮箱、头像）
- ✅ 安全的 OAuth 2.0 流程
- ✅ 支持多语言界面
- ✅ 与现有邮箱密码登录并存