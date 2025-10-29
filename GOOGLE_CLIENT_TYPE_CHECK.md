# 🔍 Google OAuth 客户端类型检查与修复

## 📍 访问客户端详情页面

### 步骤 1: 进入凭据页面

直接访问（会使用您的项目）：
```
https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
```

或者手动导航：
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择项目：`skilled-acolyte-476516-g8`
3. 左侧菜单：**"API和服务"** > **"凭据"**

### 步骤 2: 找到您的 OAuth 2.0 客户端

在凭据列表中，找到 **"OAuth 2.0 客户端ID"** 类型的凭据。

如果有很多凭据，可以：
- 按照**类型**排序查找
- 或者通过客户端ID/名称查找

### 步骤 3: 点击客户端名称进入详情

**重要**：点击客户端的**名称**（不是编辑按钮），进入详情页面。

## ✅ 检查客户端类型

在客户端详情页面，您应该能看到以下信息：

### 📋 关键信息检查清单

1. **应用类型 / Application type**
   - ✅ 应该是：**"Web 应用程序"** 或 **"Web application"**
   - ❌ 如果是："桌面应用程序"、"iOS"、"Android" 或其他，需要重新创建

2. **客户端ID / Client ID**
   - 格式类似：`123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - 记录这个ID，可能需要更新到 `.env.local`

3. **客户端密钥 / Client secret**
   - 格式类似：`GOCSPX-xxxxxxxxxxxxxxxxxxxxx`
   - 记录这个密钥，可能需要更新到 `.env.local`

4. **已获授权的 JavaScript 来源 / Authorized JavaScript origins**
   - 应该包含：
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - ⚠️ **注意**：这里不能包含路径，只能包含协议和域名

5. **已获授权的重定向URI / Authorized redirect URIs**
   - 应该包含：
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```
   - ⚠️ **注意**：这里必须包含完整路径

## ❌ 如果客户端类型不是"Web 应用程序"

### 解决方案：重新创建 OAuth 客户端

#### 步骤 A: 删除旧客户端（可选）

1. 在凭据列表页面
2. 找到您要替换的 OAuth 客户端
3. 点击右侧的 **"删除"** 或垃圾桶图标
4. 确认删除

> ⚠️ **注意**：删除前请记录好客户端ID和密钥，以防万一需要恢复。

#### 步骤 B: 创建新的 Web 应用程序客户端

1. **点击 "+ 创建凭据"**
   - 选择：**"OAuth 2.0 客户端ID"**

2. **选择应用类型**
   - ✅ **必须选择："Web 应用程序"**
   - ❌ 不要选择："桌面应用程序"、"iOS"、"Android"等

3. **填写名称**
   - 例如：`Sora AI Platform - Web Client`
   - 或任何您喜欢的名称

4. **配置已获授权的 JavaScript 来源**
   - 点击 "+ 添加URI"
   - 输入：`http://localhost:3000`
   - 再添加：`http://localhost:3001`
   - ⚠️ **不要包含路径！**（没有 `/api/auth/callback/google`）

5. **配置已获授权的重定向URI**
   - 点击 "+ 添加URI"
   - 输入：`http://localhost:3000/api/auth/callback/google`
   - 再添加：`http://localhost:3001/api/auth/callback/google`
   - ✅ **这里必须包含完整路径！**

6. **点击"创建"**

#### 步骤 C: 复制新的凭据

创建成功后，会显示：
- **客户端ID**（格式：`xxx.apps.googleusercontent.com`）
- **客户端密钥**（格式：`GOCSPX-xxxxx`）

⚠️ **立即复制并保存**，因为客户端密钥只会显示一次！

#### 步骤 D: 更新环境变量

更新您的 `.env.local` 文件：

```bash
GOOGLE_CLIENT_ID="您的客户端ID"
GOOGLE_CLIENT_SECRET="您的客户端密钥"
```

然后重启开发服务器。

## 📸 界面截图参考

### 正确的应用类型选择界面：

```
┌─────────────────────────────────────────┐
│  应用类型                                │
│  ○ 桌面应用程序                          │
│  ● Web 应用程序  ← 选择这个！           │
│  ○ iOS                                   │
│  ○ Android                               │
│  ○ 通用                                  │
└─────────────────────────────────────────┘
```

### 正确的配置界面：

```
┌─────────────────────────────────────────┐
│  名称                                    │
│  [Sora AI Platform]                     │
│                                          │
│  已获授权的 JavaScript 来源               │
│  [+] http://localhost:3000               │
│  [+] http://localhost:3001               │
│                                          │
│  已获授权的重定向URI                      │
│  [+] http://localhost:3000/api/auth/callback/google │
│  [+] http://localhost:3001/api/auth/callback/google │
└─────────────────────────────────────────┘
```

## 🔄 验证修复

创建或更新后：

1. **等待1-2分钟**（Google可能需要时间同步）

2. **重启开发服务器**：
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 然后重新启动
   npm run dev
   ```

3. **测试Google登录**：
   - 访问 `http://localhost:3000/auth/signin` 或 `http://localhost:3001/auth/signin`
   - 点击 "Continue with Google"
   - 应该能正常跳转到Google授权页面

## ❓ 如果仍然遇到问题

请告诉我：

1. **您看到的应用类型是什么？**
   - Web 应用程序 ✅
   - 桌面应用程序 ❌
   - 其他 ❌

2. **您能否看到"已获授权的重定向URI"字段？**
   - 能看到 ✅
   - 看不到 ❌

3. **如果能看到，添加时出现的错误消息是什么？**

---

**关键要点**：
- ✅ 应用类型必须是 "Web 应用程序"
- ✅ JavaScript 来源：`http://localhost:3000`（无路径）
- ✅ 重定向URI：`http://localhost:3000/api/auth/callback/google`（有路径）
