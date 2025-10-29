# 🔐 Google OAuth 一键登录设置指南

## 📋 概述
本指南将帮助您配置Google OAuth一键登录功能，让用户可以通过Google账户快速登录Sora AI平台。

## 🚀 快速开始

### 1. 创建Google Cloud项目

1. **访问Google Cloud Console**
   - 打开 [Google Cloud Console](https://console.cloud.google.com/)
   - 使用您的Google账户登录

2. **创建新项目**
   - 点击项目选择器
   - 点击"新建项目"
   - 输入项目名称：`Sora AI Platform`
   - 点击"创建"

### 2. 启用Google+ API

1. **导航到API库**
   - 在左侧菜单中点击"API和服务" > "库"
   - 搜索"Google+ API"
   - 点击并启用该API

2. **配置OAuth同意屏幕**
   - 点击"API和服务" > "OAuth同意屏幕"
   - 选择"外部"用户类型
   - 填写应用信息：
     - 应用名称：`Sora AI Platform`
     - 用户支持电子邮件：您的邮箱
     - 开发者联系信息：您的邮箱
   - 点击"保存并继续"

### 3. 创建OAuth 2.0客户端

1. **创建凭据**
   - 点击"API和服务" > "凭据"
   - 点击"+ 创建凭据" > "OAuth 2.0客户端ID"
   - 选择"Web应用程序"

2. **配置客户端**
   - 名称：`Sora AI Web Client`
   - 授权重定向URI：
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - 点击"创建"

3. **获取凭据**
   - 复制"客户端ID"和"客户端密钥"
   - 保存这些信息，稍后需要用到

### 4. 配置环境变量

1. **创建.env.local文件**
   ```bash
   cp env.local.template .env.local
   ```

2. **编辑.env.local文件**
   ```env
   # Google OAuth 配置
   GOOGLE_CLIENT_ID="your-google-client-id-here"
   GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
   
   # NextAuth 配置
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   ```

3. **替换占位符**
   - 将`your-google-client-id-here`替换为实际的客户端ID
   - 将`your-google-client-secret-here`替换为实际的客户端密钥
   - 生成一个随机的NEXTAUTH_SECRET

### 5. 测试Google登录

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问登录页面**
   - 打开 http://localhost:3000/auth/signin
   - 点击"使用Google登录"按钮

3. **验证登录流程**
   - 应该跳转到Google授权页面
   - 授权后应该返回应用并成功登录

## 🔧 故障排除

### 常见问题

1. **"redirect_uri_mismatch"错误**
   - 确保重定向URI完全匹配：`http://localhost:3000/api/auth/callback/google`
   - 检查是否有额外的斜杠或协议不匹配

2. **"invalid_client"错误**
   - 检查GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET是否正确
   - 确保没有多余的空格或引号

3. **"access_denied"错误**
   - 检查OAuth同意屏幕配置
   - 确保应用状态为"已发布"或"测试中"

4. **Google登录按钮不显示**
   - 检查环境变量是否正确设置
   - 重启开发服务器
   - 查看控制台是否有错误信息

### 调试技巧

1. **启用调试模式**
   ```env
   DEBUG=true
   ```

2. **查看日志**
   - 打开浏览器开发者工具
   - 查看Console和Network标签
   - 检查服务器控制台输出

3. **测试环境变量**
   ```bash
   node -e "console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)"
   ```

## 🚀 生产环境部署

### 1. 更新重定向URI
- 在Google Cloud Console中添加生产环境的重定向URI：
  ```
  https://yourdomain.com/api/auth/callback/google
  ```

### 2. 更新环境变量
```env
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

### 3. 发布应用
- 在OAuth同意屏幕中将应用状态改为"已发布"
- 确保所有必要的API都已启用

## 📚 相关资源

- [Google OAuth 2.0文档](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)

## ✅ 完成检查清单

- [ ] Google Cloud项目已创建
- [ ] Google+ API已启用
- [ ] OAuth同意屏幕已配置
- [ ] OAuth 2.0客户端已创建
- [ ] 重定向URI已正确设置
- [ ] 环境变量已配置
- [ ] 开发环境测试通过
- [ ] 生产环境配置完成

---

**注意**: 请妥善保管您的客户端密钥，不要将其提交到版本控制系统中。
