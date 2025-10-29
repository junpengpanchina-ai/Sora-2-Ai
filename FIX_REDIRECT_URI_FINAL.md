# 🔧 修复 redirect_uri_mismatch 错误（最终解决方案）

## ❌ 当前错误

```
错误 400：redirect_uri_mismatch
redirect_uri=http://localhost:3001/api/auth/callback/google
```

## 🔍 问题分析

从错误信息可以看到，系统正在尝试使用：
```
http://localhost:3001/api/auth/callback/google
```

但是 Google Cloud Console 中**还没有配置这个重定向URI**。

## ✅ 立即修复（必须在 Google Cloud Console 中操作）

### 📝 步骤 1: 访问 Google Cloud Console

直接访问凭据编辑页面：
```
https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
```

### 📝 步骤 2: 编辑您的 OAuth 客户端

1. 找到您的 OAuth 客户端
   - **客户端ID**: `222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com`
   - 点击右侧的 **"编辑"（铅笔图标）**

### 📝 步骤 3: 添加重定向URI（关键步骤！）

在 **"已获授权的重定向URI"** 部分：

1. 点击 **"+ 添加URI"** 按钮

2. 添加以下两个URI（**必须两个都添加**）：
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

   ⚠️ **非常重要**：
   - 必须添加**两个端口**（因为服务器可能在任一端口运行）
   - URI必须**完全匹配**，包括协议、主机、端口和路径
   - **不能有空格、多余斜杠或尾部斜杠**
   - 协议必须是 `http://`（开发环境）

3. **每个URI单独添加**：
   - 第一次点击"+ 添加URI"，输入：`http://localhost:3000/api/auth/callback/google`
   - 第二次点击"+ 添加URI"，输入：`http://localhost:3001/api/auth/callback/google`

### 📝 步骤 4: 更新 JavaScript 来源（推荐）

在 **"已获授权的 JavaScript 来源"** 部分，确保包含：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

### 📝 步骤 5: 保存更改

- 点击页面底部的 **"保存"** 按钮
- 等待保存完成

## 🔍 验证配置

保存后，您的配置应该包含：

**已获授权的 JavaScript 来源**：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

**已获授权的重定向URI**：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

## ⏰ 等待配置生效

1. **保存后等待 2-3 分钟**（Google 需要时间更新配置）
2. **不要立即测试**，让配置先生效

## 🧪 测试步骤

等待2-3分钟后：

1. **访问登录页面**
   - 如果服务器在3000端口：`http://localhost:3000/auth/signin`
   - 如果服务器在3001端口：`http://localhost:3001/auth/signin`

2. **点击"使用Google登录"**

3. **应该可以成功**：
   - 跳转到 Google 授权页面
   - 授权后成功返回并登录

## 📋 完整配置截图参考

在Google Cloud Console中，配置应该看起来像这样：

```
已获授权的 JavaScript 来源
┌─────────────────────────────┐
│ http://localhost:3000        │
│ http://localhost:3001        │
│ http://sora2aivideos.com     │
└─────────────────────────────┘

已获授权的重定向 URI
┌──────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google    │
│ http://localhost:3001/api/auth/callback/google    │
└──────────────────────────────────────────────────┘
```

## ⚠️ 常见错误避免

### ❌ 不要这样做：
- ❌ 只添加一个端口（必须两个都添加）
- ❌ 添加尾部斜杠：`http://localhost:3001/api/auth/callback/google/`
- ❌ 使用 https：`https://localhost:3001/api/auth/callback/google`
- ❌ 有空格：`http://localhost:3001/api/auth/callback/google `（末尾空格）
- ❌ 遗漏 `/api/auth/callback/google` 路径

### ✅ 正确的格式：
- ✅ `http://localhost:3000/api/auth/callback/google`
- ✅ `http://localhost:3001/api/auth/callback/google`

## 🔧 如果仍然有错误

### 1. 确认配置已保存

- 再次查看您的 OAuth 客户端配置
- 确认重定向URI列表中有两个URI

### 2. 检查URI格式

确保URI：
- 没有多余空格
- 没有尾部斜杠
- 协议是 `http://`
- 端口号正确（3000 和 3001）

### 3. 清除浏览器缓存

- 清除浏览器缓存和 Cookie
- 或使用无痕模式测试

### 4. 检查服务器端口

确认当前服务器运行在哪个端口：
```bash
lsof -ti:3000,3001
```

## 📝 快速检查清单

在继续之前，确认：

- [ ] 已访问 Google Cloud Console 凭据页面
- [ ] 已找到您的 OAuth 客户端并点击编辑
- [ ] 已添加重定向URI：`http://localhost:3000/api/auth/callback/google`
- [ ] 已添加重定向URI：`http://localhost:3001/api/auth/callback/google`
- [ ] 已确认URI格式正确（无空格、无尾部斜杠）
- [ ] 已点击"保存"按钮
- [ ] 已等待 2-3 分钟（配置生效）
- [ ] 已尝试重新登录测试

## 🎯 关键提示

**最重要的是**：必须在Google Cloud Console中添加 `http://localhost:3001/api/auth/callback/google` 这个URI！

当前的错误就是因为这个URI没有被配置。添加后，等待几分钟让配置生效，然后就可以正常使用了。

---

**完成这些步骤后，redirect_uri_mismatch 错误应该就会解决！** ✅
