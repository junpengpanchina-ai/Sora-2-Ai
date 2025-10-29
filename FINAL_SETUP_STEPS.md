# ✅ Google OAuth 最终配置步骤

## 🎉 已完成
- ✅ Google OAuth 客户端ID和密钥已更新到 `.env.local`
- ✅ 凭据已安全保存（不会提交到Git）

## ⚠️ 重要：还需要完成这一步

### 在 Google Cloud Console 中添加 localhost 重定向 URI

您的当前配置显示：
- JavaScript 来源：`http://sora2aivideos.com` ✅
- **但缺少**：`http://localhost:3000` ⚠️

### 立即添加（必须！）

1. **访问凭据编辑页面**：
   https://console.cloud.google.com/apis/credentials/oauthclient/222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com?project=skilled-acolyte-476516-g8

2. **添加本地开发URI**：
   - 在"已获授权的 JavaScript 来源"中添加：
     ```
     http://localhost:3000
     ```
   - 在"已获授权的重定向 URI"中添加：
     ```
     http://localhost:3000/api/auth/callback/google
     ```

3. **完整配置应该是**：
   ```
   已获授权的 JavaScript 来源:
   - http://sora2aivideos.com
   - http://localhost:3000
   
   已获授权的重定向 URI:
   - http://localhost:3000/api/auth/callback/google
   (如果生产环境也需要，可以添加)
   ```

4. **保存更改**

## 🚀 测试步骤

### 1. 重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### 2. 访问登录页面
打开：http://localhost:3000/auth/signin

### 3. 点击 Google 登录
- 应该跳转到 Google 授权页面
- 选择您的 Google 账户
- 点击"允许"

### 4. 验证成功
- 应该自动返回应用
- 应该显示已登录状态

## 🔍 如果还有问题

### 400 错误（redirect_uri_mismatch）
- ✅ 确保已添加 `http://localhost:3000/api/auth/callback/google`
- ✅ 确保URI完全匹配，没有多余空格

### 其他错误
运行检查脚本：
```bash
./check-google-oauth.sh
```

## 🔐 安全提醒

所有敏感信息已妥善保存：
- ✅ `.env.local` 在 `.gitignore` 中
- ✅ 凭据不会泄露到Git仓库
- ⚠️ 请勿在任何公开场合分享这些凭据

---

**完成以上步骤后，Google 一键登录应该可以正常工作了！** 🎉

