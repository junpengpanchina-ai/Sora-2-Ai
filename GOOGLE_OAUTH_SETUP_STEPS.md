# ✅ Google OAuth 配置总结

## 📋 您的项目信息
- **项目编号**: 222103705593  
- **项目ID**: skilled-acolyte-476516-g8
- **项目链接**: [点击访问](https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8)

## 🚀 立即执行的步骤

### 步骤 1: 在Google Cloud Console中配置

#### 1.1 启用必要的API
访问以下链接并启用：
- **Google+ API**: https://console.cloud.google.com/apis/library/plus.googleapis.com?project=skilled-acolyte-476516-g8
- **Google Identity Services API**: https://console.cloud.google.com/apis/library/people.googleapis.com?project=skilled-acolyte-476516-g8

#### 1.2 配置OAuth同意屏幕
访问：https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8

**必须填写的信息**：
- 应用名称: `Sora AI Platform`
- 用户支持电子邮件: 选择您的邮箱
- 应用主页链接: `http://localhost:3000`
- 已获授权的网域: `localhost`

#### 1.3 创建OAuth 2.0客户端ID
访问：https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8

**配置要求**：
- 应用类型: **Web应用程序**
- 名称: `Sora AI Web Client`
- 已获授权的JavaScript来源: `http://localhost:3000`
- **已获授权的重定向URI**: `http://localhost:3000/api/auth/callback/google` ⚠️ **这个必须完全匹配！**

**获取凭据**：
创建后，复制显示的：
- 客户端ID (Client ID)
- 客户端密钥 (Client Secret)

### 步骤 2: 更新.env.local文件

编辑`.env.local`文件，填入以下信息：

```env
# Google OAuth 配置
GOOGLE_CLIENT_ID="粘贴您的客户端ID"
GOOGLE_CLIENT_SECRET="粘贴您的客户端密钥"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="0GMv2X8WLOUVyNnW+RkWYdrEki2079sVmF7/JK0a+cI="
```

### 步骤 3: 重启服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤 4: 测试登录

1. 访问：http://localhost:3000/auth/signin
2. 点击"使用Google登录"按钮
3. 应该跳转到Google授权页面
4. 授权后返回应用并登录

## 🔍 常见问题解决

### 如果遇到 400 错误 (redirect_uri_mismatch)
**原因**: 重定向URI配置不正确  
**解决**:
1. 检查Google Cloud Console中的重定向URI是否为：`http://localhost:3000/api/auth/callback/google`
2. 确保没有多余的斜杠或空格
3. 确保协议是`http://`而不是`https://`

### 如果遇到 invalid_client 错误
**原因**: 客户端ID或密钥错误  
**解决**:
1. 检查`.env.local`文件中的值是否正确
2. 确保没有多余的空格或引号
3. 重启开发服务器

### 如果登录按钮点击后没有反应
**原因**: Google OAuth未正确配置  
**解决**:
1. 检查浏览器控制台的错误信息
2. 检查服务器日志
3. 确认环境变量已正确加载

## 📚 参考文档

- **快速设置指南**: `GOOGLE_OAUTH_QUICK_SETUP.md`
- **运行配置脚本**: `./setup-google-oauth.sh`

## 🔗 快速访问链接

- **项目仪表板**: https://console.cloud.google.com/home/dashboard?project=skilled-acolyte-476516-g8
- **凭据管理**: https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
- **OAuth同意屏幕**: https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
- **API库**: https://console.cloud.google.com/apis/library?project=skilled-acolyte-476516-g8

---

**重要提示**: 
- ⚠️ 重定向URI必须精确匹配：`http://localhost:3000/api/auth/callback/google`
- ⚠️ 不要将`.env.local`文件提交到Git
- ⚠️ 客户端密钥是敏感信息，请妥善保管
