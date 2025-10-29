# 🔄 重新创建 Google OAuth 客户端（解决配置问题）

## ⚠️ 问题

您在添加重定向URI时遇到 "URI 不能包含路径" 错误。这可能是由于：
1. 现有客户端配置有问题
2. 客户端类型选择不正确
3. 需要在创建时一次性配置

## ✅ 解决方案：删除并重新创建

### 步骤 1: 删除现有客户端（可选，建议）

1. **访问凭据页面**
   ```
   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
   ```

2. **找到您的OAuth客户端**
   - 客户端ID: `222103705593-n67hsjl9mnt5i69keat0o9iuq2pojvc8.apps.googleusercontent.com`
   - 点击右侧的 **"删除"**（垃圾桶图标）
   - 确认删除

   ⚠️ **注意**：删除后您需要重新复制客户端ID和密钥到`.env.local`文件

### 步骤 2: 创建新的OAuth客户端

1. **点击 "+ 创建凭据"**
   - 选择 **"OAuth 2.0 客户端ID"**

2. **选择应用类型**
   - 必须选择 **"Web 应用程序"**
   - 不要选择其他类型（如"桌面应用"等）

3. **填写名称**
   ```
   Sora AI Platform - Localhost
   ```

4. **配置 JavaScript 来源**（第一部分）
   
   在 "已获授权的 JavaScript 来源" 部分：
   - 点击输入框
   - 添加：`http://localhost:3000`
   - 如果有多个输入框或"+添加"按钮，再添加：`http://localhost:3001`

   ⚠️ **这里只写域名+端口，不要路径！**

5. **配置重定向URI**（第二部分 - 关键！）
   
   在 "已获授权的重定向URI" 部分：
   - 找到输入框（通常会显示 "+ 添加URI" 按钮）
   - 点击 "+ 添加URI" 或直接在输入框中输入
   - **这里必须输入完整路径**：
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - 再次点击 "+ 添加URI"
   - 添加：
     ```
     http://localhost:3001/api/auth/callback/google
     ```

6. **创建**
   - 点击 "创建" 按钮

7. **保存凭据**
   - 立即复制显示的：
     - **客户端ID**
     - **客户端密钥**
   - ⚠️ **重要**：客户端密钥只显示一次！

### 步骤 3: 更新环境变量

编辑 `.env.local` 文件，更新凭据：

```env
GOOGLE_CLIENT_ID="新的客户端ID"
GOOGLE_CLIENT_SECRET="新的客户端密钥"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="0GMv2X8WLOUVyNnW+RkWYdrEki2079sVmF7/JK0a+cI="
```

### 步骤 4: 重启服务器

```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

## 🔍 如果还是不能添加路径的URI

### 替代方案 1: 检查OAuth同意屏幕

确保OAuth同意屏幕已完全配置：

1. 访问：
   ```
   https://console.cloud.google.com/apis/credentials/consent?project=skilled-acolyte-476516-g8
   ```

2. 确认已填写所有必填项并完成所有步骤

3. 确保应用状态不是"已发布"（如果还在测试阶段）

### 替代方案 2: 使用不同的创建方式

尝试通过API创建（如果控制台有问题）：

1. 使用 gcloud CLI
2. 或通过REST API

但这通常不是必需的，控制台应该可以正常工作。

### 替代方案 3: 检查客户端类型

确认您创建的是 **"Web 应用程序"** 类型，不是其他类型。

## 📝 创建时的完整配置示例

创建新客户端时，您应该看到类似这样的界面：

```
应用类型: Web 应用程序 ✅

名称: Sora AI Platform - Localhost

已获授权的 JavaScript 来源:
┌─────────────────────────────┐
│ http://localhost:3000        │
│ http://localhost:3001        │
└─────────────────────────────┘
[+ 添加 URI] 按钮

已获授权的重定向URI:
┌──────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google │
│ http://localhost:3001/api/auth/callback/google │
└──────────────────────────────────────────┘
[+ 添加 URI] 按钮
```

## ⚠️ 关键提示

如果您在**创建时**（而不是编辑时）仍然看到这个错误，可能的原因：

1. **您可能在JavaScript来源字段中添加了路径**
   - 解决方案：只在JavaScript来源中添加 `http://localhost:3000`（无路径）

2. **您可能在错误的位置输入**
   - 确保在标记为 "已获授权的重定向URI" 的区域输入

3. **浏览器缓存问题**
   - 尝试清除浏览器缓存或使用无痕模式

## 🎯 验证步骤

创建完成后，确认：

1. 客户端ID显示正确
2. 在编辑页面能看到两个区域：
   - JavaScript来源：只包含 `http://localhost:3000`（无路径）
   - 重定向URI：包含 `http://localhost:3000/api/auth/callback/google`（有路径）
3. 两个区域都已保存

如果重新创建后仍然无法添加包含路径的重定向URI，请告诉我具体的错误信息或界面截图，我会提供其他解决方案。
