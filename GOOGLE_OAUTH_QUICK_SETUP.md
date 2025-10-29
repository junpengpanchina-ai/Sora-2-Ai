# 🔐 Google OAuth 快速配置指南

## 📋 项目信息
- **项目编号**: 222103705593
- **项目ID**: skilled-acolyte-476516-g8
- **项目链接**: https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8

## 🚀 配置步骤

### 步骤1: 访问您的项目
直接访问：https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8

### 步骤2: 启用必要的API

1. **启用Google+ API**
   - 访问：https://console.cloud.google.com/apis/library/plus.googleapis.com?project=skilled-acolyte-476516-g8
   - 点击"启用"按钮

2. **启用Google Identity Services API**
   - 访问：https://console.cloud.google.com/apis/library/people.googleapis.com?project=skilled-acolyte-476516-g8
   - 点击"启用"按钮

### 步骤3: 配置OAuth同意屏幕

1. **访问OAuth同意屏幕**
   - 直接访问：https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
   - 或：左侧菜单 > "API和服务" > "OAuth同意屏幕"

2. **选择用户类型**
   - 选择"外部"（推荐用于开发和测试）
   - 点击"创建"

3. **填写应用信息**
   - **应用名称**: `Sora AI Platform`
   - **用户支持电子邮件**: 选择您的邮箱
   - **应用徽标**: （可选）
   - **应用主页链接**: `http://localhost:3000`
   - **应用隐私政策链接**: （可选）
   - **应用服务条款链接**: （可选）
   - **已获授权的网域**: `localhost`（开发环境）

4. **作用域（Scopes）**
   - 点击"添加或移除作用域"
   - 确保以下作用域已添加：
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`

5. **测试用户（如果需要）**
   - 如果选择"外部"用户类型，可以添加测试用户
   - 添加您的Google邮箱作为测试用户

6. **保存**
   - 点击"保存并继续"
   - 完成所有步骤

### 步骤4: 创建OAuth 2.0客户端ID

1. **访问凭据页面**
   - 直接访问：https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
   - 或：左侧菜单 > "API和服务" > "凭据"

2. **创建OAuth客户端ID**
   - 点击"+ 创建凭据"
   - 选择"OAuth 2.0客户端ID"

3. **应用类型**
   - 选择"Web应用程序"

4. **配置客户端**
   - **名称**: `Sora AI Web Client (Localhost)`
   - **已获授权的 JavaScript 来源**:
     ```
     http://localhost:3000
     ```
   - **已获授权的重定向 URI**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```

5. **创建并保存凭据**
   - 点击"创建"
   - **重要**：复制显示的"客户端ID"和"客户端密钥"
   - 保存到安全的地方！

### 步骤5: 配置环境变量

1. **编辑.env.local文件**
   ```bash
   # 使用您喜欢的编辑器
   nano .env.local
   # 或
   code .env.local
   ```

2. **添加或更新以下变量**
   ```env
   # Google OAuth 配置
   GOOGLE_CLIENT_ID="您的客户端ID"
   GOOGLE_CLIENT_SECRET="您的客户端密钥"
   
   # NextAuth 配置
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="生成一个随机密钥"
   ```

3. **生成NEXTAUTH_SECRET**
   ```bash
   # 方法1: 使用openssl
   openssl rand -base64 32
   
   # 方法2: 使用Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

### 步骤6: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤7: 测试Google登录

1. 访问：http://localhost:3000/auth/signin
2. 点击"使用Google登录"按钮
3. 应该跳转到Google授权页面
4. 授权后应该返回应用并成功登录

## 🔍 故障排除

### 错误：redirect_uri_mismatch
**解决方案**:
- 确保重定向URI完全匹配：`http://localhost:3000/api/auth/callback/google`
- 检查是否有额外的斜杠或空格
- 确保在Google Cloud Console中正确配置

### 错误：invalid_client
**解决方案**:
- 检查GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET是否正确
- 确保.env.local文件已加载（重启服务器）
- 检查环境变量没有多余的空格或引号

### 错误：access_denied
**解决方案**:
- 确保OAuth同意屏幕已配置完成
- 如果使用"外部"用户类型，确保已添加测试用户
- 检查应用是否已发布或处于测试模式

### Google登录按钮不显示
**解决方案**:
- 检查环境变量是否正确设置
- 重启开发服务器
- 查看浏览器控制台和服务器日志

## 📝 快速检查清单

- [ ] Google+ API已启用
- [ ] Google Identity Services API已启用
- [ ] OAuth同意屏幕已配置
- [ ] OAuth 2.0客户端ID已创建
- [ ] 重定向URI已正确设置：`http://localhost:3000/api/auth/callback/google`
- [ ] 环境变量已配置（GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET）
- [ ] NEXTAUTH_SECRET已生成并配置
- [ ] 开发服务器已重启
- [ ] 测试登录成功

## 🔗 有用的链接

- **项目仪表板**: https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8
- **凭据管理**: https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
- **OAuth同意屏幕**: https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
- **API库**: https://console.cloud.google.com/apis/library?project=skilled-acolyte-476516-g8

## ⚠️ 重要提示

1. **不要将凭据提交到Git**
   - .env.local文件应该在.gitignore中
   - 不要在.contains文件中包含真实凭据

2. **生产环境配置**
   - 生产环境需要创建新的OAuth客户端ID
   - 使用生产域名：`https://yourdomain.com/api/auth/callback/google`

3. **密钥安全**
   - 定期轮换密钥
   - 不要分享客户端密钥
   - 使用环境变量管理，不要硬编码

---

完成后，您的Google OAuth一键登录应该可以正常工作了！🎉
