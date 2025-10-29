# 🔧 修复 redirect_uri_mismatch 错误

## ❌ 当前错误
```
错误 400： redirect_uri_mismatch
```

## 🔍 问题原因

从终端日志可以看到，系统正在尝试使用：
- `http://localhost:3001/api/auth/callback/google`

但是在 Google Cloud Console 中，**没有配置这个重定向URI**。

您的配置中只有：
- JavaScript 来源：`http://sora2aivideos.com`
- **缺少重定向URI配置！**

## ✅ 立即修复步骤

### 步骤 1: 访问编辑页面

**直接访问**（替换为您的客户端ID）：
https://console.cloud.google.com/apis/credentials/edit/222103705593?project=skilled-acolyte-476516-g8

或者：
1. 访问：https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
2. 找到您的 OAuth 客户端（客户端ID：`222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com`）
3. 点击右侧的 **"编辑"（铅笔图标）**

### 步骤 2: 添加重定向URI

在 **"已获授权的重定向URI"** 部分：

1. 点击 **"+ 添加URI"** 按钮

2. 添加以下URI（**每行一个**）：
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

   ⚠️ **非常重要**：
   - 必须添加**两个**URI（因为服务器可能在3000或3001端口运行）
   - URI必须**完全匹配**，包括协议、端口和路径
   - **不能有空格、多余斜杠或尾部斜杠**
   - 协议必须是 `http://`（开发环境），不是 `https://`

3. **保存更改**
   - 点击页面底部的 **"保存"** 按钮

### 步骤 3: 更新JavaScript来源（可选但推荐）

在 **"已获授权的 JavaScript 来源"** 部分：

确保包含：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

### 步骤 4: 验证配置

保存后，您的配置应该类似这样：

**已获授权的 JavaScript 来源**：
- `http://localhost:3000`
- `http://localhost:3001`
- `http://sora2aivideos.com`

**已获授权的重定向URI**：
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3001/api/auth/callback/google`

### 步骤 5: 等待并测试

1. **等待1-2分钟**（让Google更新配置）

2. **重启开发服务器**（如果正在运行）
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```

3. **测试Google登录**
   - 访问：http://localhost:3001/auth/signin
   - 点击"使用Google登录"
   - 应该可以成功完成登录！

## 🎯 快速检查清单

- [ ] 已访问 Google Cloud Console 凭据编辑页面
- [ ] 已找到您的 OAuth 客户端（客户端ID：`222103705593-n67hsjl...`）
- [ ] 已在"已获授权的重定向URI"中添加：`http://localhost:3000/api/auth/callback/google`
- [ ] 已在"已获授权的重定向URI"中添加：`http://localhost:3001/api/auth/callback/google`
- [ ] 已点击"保存"按钮
- [ ] 已等待1-2分钟（让配置生效）
- [ ] 已重启开发服务器
- [ ] 已测试Google登录

## 📸 配置截图参考

在Google Cloud Console中，重定向URI配置区域应该显示：

```
已获授权的重定向 URI
┌─────────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google      │
│ http://localhost:3001/api/auth/callback/google      │
└─────────────────────────────────────────────────────┘
[+ 添加URI] 按钮
```

## ⚠️ 常见错误

### ❌ 不要这样做：
- 不要添加尾部斜杠：`http://localhost:3001/api/auth/callback/google/`
- 不要使用https：`https://localhost:3001/api/auth/callback/google`
- 不要有空格：`http://localhost:3001/api/auth/callback/google `（末尾空格）
- 不要遗漏路径：`http://localhost:3001`

### ✅ 正确的格式：
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3001/api/auth/callback/google`

完成这些步骤后，`redirect_uri_mismatch` 错误应该就会解决了！🎉

---

**提示**：如果您的服务器固定运行在某个端口，可以只添加对应的URI。但如果端口可能变化，建议两个都添加。
