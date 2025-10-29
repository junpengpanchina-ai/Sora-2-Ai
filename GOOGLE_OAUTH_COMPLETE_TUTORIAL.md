# 🔐 Google OAuth 一键登录完整教程

## ⚠️ 当前问题诊断

您遇到 `GET /api/auth/callback/google 400` 错误，主要原因是：
1. ❌ `.env.local` 中的 Google 凭据还是占位符（`your-google-client-id-here`）
2. ⚠️ 需要创建真实的 Google OAuth 客户端ID和密钥

---

## 🚀 完整配置步骤（按顺序执行）

### 步骤 1: 在 Google Cloud Console 中创建 OAuth 客户端

#### 1.1 访问您的项目
直接访问：**https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8**

#### 1.2 配置 OAuth 同意屏幕（必须先完成！）

1. **访问同意屏幕配置**
   - 链接：https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
   - 或：左侧菜单 > "API和服务" > "OAuth同意屏幕"

2. **选择用户类型**
   - ✅ 选择 **"外部"**（用于开发测试）
   - 点击"创建"

3. **填写应用信息**（必填项）
   ```
   应用名称: Sora AI Platform
   用户支持电子邮件: [选择您的邮箱]
   应用主页链接: http://localhost:3000
   应用隐私政策链接: [可选]
   应用服务条款链接: [可选]
   开发者联系信息: [您的邮箱]
   ```

4. **配置作用域（Scopes）**
   - 点击"添加或移除作用域"
   - 确保已添加：
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
     - ✅ `openid`
   - 点击"更新"，然后"保存并继续"

5. **添加测试用户**（如果选择"外部"）
   - 添加您的 Google 邮箱作为测试用户
   - 点击"保存并继续"

6. **完成配置**
   - 检查所有信息
   - 点击"返回仪表板"

#### 1.3 启用必要的 API

**启用 Google+ API**：
- 链接：https://console.cloud.google.com/apis/library/plus.googleapis.com?project=skilled-acolyte-476516-g8
- 点击"启用"

**启用 Google Identity Services API**：
- 链接：https://console.cloud.google.com/apis/library/people.googleapis.com?project=skilled-acolyte-476516-g8
- 点击"启用"

#### 1.4 创建 OAuth 2.0 客户端ID

1. **回到凭据页面**
   - 链接：https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8

2. **创建凭据**
   - 点击 **"+ 创建凭据"**
   - 选择 **"OAuth 2.0 客户端ID"**

3. **选择应用类型**
   - ✅ 选择 **"Web 应用程序"**

4. **配置客户端**（⚠️ 重要！）
   ```
   名称: Sora AI Web Client
   
   已获授权的 JavaScript 来源:
   http://localhost:3000
   
   已获授权的重定向 URI:
   http://localhost:3000/api/auth/callback/google
   ```
   
   ⚠️ **重要提示**：
   - URI 必须完全匹配，不能有空格
   - 不能有多余的斜杠
   - 协议必须是 `http://` 而不是 `https://`

5. **创建并保存凭据**
   - 点击"创建"
   - **立即复制显示的凭据**：
     - ✅ **客户端ID**（类似：`123456789-abcdefgh.apps.googleusercontent.com`）
     - ✅ **客户端密钥**（类似：`GOCSPX-abcdefghijklmnopqrstuvwxyz`）
   - ⚠️ **注意**：客户端密钥只显示一次！请妥善保存

---

### 步骤 2: 更新环境变量文件

#### 2.1 编辑 `.env.local` 文件

```bash
# 使用您喜欢的编辑器
nano .env.local
# 或
code .env.local
# 或
vim .env.local
```

#### 2.2 更新 Google OAuth 配置

找到并替换以下行：

```env
# 将这部分：
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# 替换为您从 Google Cloud Console 复制的真实凭据：
GOOGLE_CLIENT_ID="您复制的客户端ID"
GOOGLE_CLIENT_SECRET="您复制的客户端密钥"
```

**示例**：
```env
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz123456"
```

#### 2.3 确保 NEXTAUTH 配置正确

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="0GMv2X8WLOUVyNnW+RkWYdrEki2079sVmF7/JK0a+cI="
```

---

### 步骤 3: 重启开发服务器

```bash
# 停止当前服务器 (按 Ctrl+C)
# 然后重新启动
npm run dev
```

---

### 步骤 4: 测试 Google 登录

1. **访问登录页面**
   - 打开：http://localhost:3000不应该在localhost:3001/auth/signin

2. **点击 Google 登录按钮**
   - 应该跳转到 Google 授权页面
   - 选择您的 Google 账户
   - 点击"允许"

3. **检查是否成功**
   - 应该自动返回到应用
   - 应该显示已登录状态

---

## 🔍 故障排除

### 错误：`redirect_uri_mismatch`

**原因**：重定向 URI 不匹配

**解决方法**：
1. 检查 Google Cloud Console 中的重定向 URI 是否完全匹配：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
2. 确保没有多余的空格或斜杠
3. 如果服务器运行在 3001 端口，也需要添加：
   ```
   http://localhost:3001/api/auth/callback/google
   ```

### 错误：`invalid_client`

**原因**：客户端 ID 或密钥错误

**解决方法**：
1. 检查 `.env.local` 中的 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
2. 确保没有多余的空格或引号
3. 确保使用的是真实的凭据，而不是占位符
4. 重启开发服务器

### 错误：`access_denied`

**原因**：OAuth 同意屏幕未完成或应用未发布

**解决方法**：
1. 完成 OAuth 同意屏幕的所有步骤
2. 如果使用"外部"用户类型，确保已添加测试用户
3. 确保所有必需的作用域已添加

### Google 登录按钮没有反应

**原因**：环境变量未正确加载

**解决方法**：
1. 检查 `.env.local` 文件是否存在
2. 确保环境变量名称正确（大写）
3. 重启开发服务器
4. 检查浏览器控制台的错误信息

---

## ✅ 完成检查清单

在继续之前，请确认：

- [ ] ✅ OAuth 同意屏幕已配置完成
- [ ] ✅ Google+ API 已启用
- [ ] ✅ Google Identity Services API 已启用
- [ ] ✅ OAuth 2.0 客户端ID已创建
- [ ] ✅ 重定向 URI 已正确配置：`http://localhost:3000/api/auth/callback/google`
- [ ] ✅ 已复制客户端ID和密钥
- [ ] ✅ `.env.local` 中的 `GOOGLE_CLIENT_ID` 已更新为真实值
- [ ] ✅ `.env.local` 中的 `GOOGLE_CLIENT_SECRET` 已更新为真实值
- [ ] ✅ `NEXTAUTH_URL` 已配置为 `http://localhost:3000`
- [ ] ✅ `NEXTAUTH_SECRET` 已配置
- [ ] ✅ 开发服务器已重启
- [ ] ✅ 测试登录成功

---

## 🔗 快速访问链接

**您的项目链接**：
- **项目仪表板**: https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8
- **凭据管理**: https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
- **OAuth同意屏幕**: https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
- **API库**: https://console.cloud.google.com/apis/library?project=skilled-acolyte-476516-g8

---

## 📝 总结

**您当前缺少的步骤**：

1. ❌ **最重要**：在 Google Cloud Console 创建真实的 OAuth 客户端ID和密钥
2. ❌ **关键**：将 `.env.local` 中的占位符替换为真实的凭据
3. ⚠️ **必须**：确保重定向 URI 完全匹配

**立即执行**：
1. 按照步骤 1 在 Google Cloud Console 创建 OAuth 客户端
2. 复制凭据到 `.env.local` 文件
3. 重启服务器并测试

完成这些步骤后，Google 一键登录应该可以正常工作了！🎉
