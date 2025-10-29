# 🔧 修复连接问题和 Google OAuth 配置

## ✅ 服务器状态

**服务器现在正在运行：**
- ✅ 已重启开发服务器
- ✅ 运行在：http://localhost:3000

## ⚠️ 仍需解决的问题

从之前的终端日志，您遇到了两个问题：

### 1. redirect_uri_mismatch（已解决配置，等待验证）
### 2. OAuth state missing（通常也是重定向URI问题）

## 🚀 立即执行：配置 Google Cloud Console

### 关键步骤：

1. **访问凭据编辑页面**
   
   直接访问：
   ```
   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
   ```

2. **找到您的 OAuth 客户端**
   - 客户端ID：`222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com`
   - 点击右侧的 **"编辑"（铅笔图标）**

3. **添加重定向URI（必须！）**
   
   在 **"已获授权的重定向URI"** 部分：
   - 点击 **"+ 添加URI"**
   - 添加以下URI：
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - ⚠️ **重要**：确保没有尾部斜杠，没有空格

4. **更新 JavaScript 来源**
   
   在 **"已获授权的 JavaScript 来源"** 部分，确保包含：
   ```
   http://localhost:3000
   ```

5. **保存更改**
   - 点击页面底部的 **"保存"** 按钮

### 完整配置应该包括：

**已获授权的 JavaScript 来源**：
```
http://localhost:3000
http://sora2aivideos.com
```

**已获授权的重定向URI**：
```
http://localhost:3000/api/auth/callback/google
```

## 🔍 验证步骤

### 步骤 1: 确认配置已保存

1. 等待 **2-3 分钟**（Google 配置更新需要时间）
2. 再次查看您的 OAuth 客户端配置
3. 确认重定向URI已显示在列表中

### 步骤 2: 测试登录

1. **访问登录页面**
   ```
   http://localhost:3000/auth/signin
   ```

2. **点击"使用Google登录"按钮**

3. **应该看到**：
   - ✅ 跳转到 Google 授权页面
   - ✅ 授权后返回应用
   - ✅ 成功登录

4. **如果还有错误**：
   - 检查浏览器控制台的错误信息
   - 检查服务器终端日志
   - 确认重定向URI完全匹配

## 📝 当前服务器信息

- **运行端口**: 3000
- **访问地址**: http://localhost:3000
- **状态**: ✅ 正常运行

## 🐛 常见问题

### 如果还是看到 redirect_uri_mismatch：

1. **检查URI格式**
   - ✅ 正确：`http://localhost:3000/api/auth/callback/google`
   - ❌ 错误：`http://localhost:3000/api/auth/callback/google/`（有尾部斜杠）
   - ❌ 错误：`http://localhost:3000/api/auth/callback/google `（有空格）

2. **检查端口**
   - 确保 Google Cloud Console 中的端口（3000）与服务器运行端口一致
   - 如果服务器运行在3001，也需要添加对应的URI

3. **等待配置生效**
   - Google 配置更新可能需要几分钟
   - 尝试清除浏览器缓存
   - 使用无痕模式测试

### 如果看到 ERR_CONNECTION_REFUSED：

1. **检查服务器是否运行**
   ```bash
   # 检查端口
   lsof -ti:3000
   
   # 如果没有任何输出，重启服务器
   npm run dev
   ```

2. **检查防火墙设置**
   - 确保 localhost 连接未被阻止

## ✅ 完成检查清单

- [ ] 已访问 Google Cloud Console
- [ ] 已编辑 OAuth 客户端
- [ ] 已添加重定向URI：`http://localhost:3000/api/auth/callback/google`
- [ ] 已添加 JavaScript 来源：`http://localhost:3000`
- [ ] 已保存更改
- [ ] 已等待2-3分钟（配置生效）
- [ ] 已访问 http://localhost:3000/auth/signin
- [ ] 已测试 Google 登录

---

**完成后，Google 一键登录应该可以正常工作了！** 🎉

如果还有问题，请检查：
- 浏览器控制台错误
- 服务器终端日志
- Google Cloud Console 配置是否完全匹配
