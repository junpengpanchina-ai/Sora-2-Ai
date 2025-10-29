# 🔧 修复 redirect_uri_mismatch 错误

## ❌ 当前错误
```
错误 400：redirect_uri_mismatch
无法登录，因为"sora-2"发送的请求无效
```

## 🔍 问题原因
您的服务器运行在 `http://localhost:3001`，但Google Cloud Console中没有配置这个重定向URI。

## ✅ 解决方案（选择其中一种）

### 方案1：在Google Cloud Console中添加3001端口（推荐）

1. **访问OAuth客户端编辑页面**：
   ```
   https://console.cloud.google.com/apis/credentials/oauthclient/222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com?project=skilled-acolyte-476516-g8
   ```

2. **添加以下配置**：

   **已获授权的 JavaScript 来源**：
   ```
   http://localhost:3000
   http://localhost:3001
   ```

   **已获授权的重定向 URI**：
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

3. **保存更改**

### 方案2：使用3000端口（更简单）

1. **停止占用3000端口的进程**：
   ```bash
   # 查找占用3000端口的进程
   lsof -ti:3000 | xargs kill -9
   ```

2. **或者修改.env.local使用3001**（如果确实需要使用3001）：
   保持现有配置不变，按方案1添加URI

## 🚀 快速修复步骤

### 立即操作：

1. **访问Google Cloud Console**：
   直接点击：https://console.cloud.google.com/apis/credentials/oauthclient/222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com?project=skilled-acolyte-476516-g8

2. **滚动到"已获授权的重定向 URI"部分**

3. **点击"+ 添加 URI"**

4. **添加以下URI**（逐行添加）：
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

5. **在"已获授权的 JavaScript 来源"中添加**：
   ```
   http://localhost:3000
   http://localhost:3001
   ```

6. **点击"保存"**

7. **等待1-2分钟让更改生效**

## ✅ 验证修复

1. **重启开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问登录页面**：
   - http://localhost:3000/auth/signin （或3001，取决于实际端口）

3. **点击Google登录**，应该可以正常工作了

## 🔍 如果仍然有问题

### 检查当前配置：
```bash
# 检查环境变量
grep NEXTAUTH_URL .env.local

# 检查实际使用的端口
curl -I http://localhost:3000/auth/signin 2>/dev/null || echo "3000端口不可用"
curl -I http://localhost:3001/auth/signin 2>/dev/null || echo "3001端口不可用"
```

### 确保URI完全匹配：
- ✅ 协议必须是 `http://`（不是 `https://`）
- ✅ 不能有多余的斜杠
- ✅ 不能有空格
- ✅ 路径必须是 `/api/auth/callback/google`

---

**完成上述步骤后，错误应该就解决了！** ✅

