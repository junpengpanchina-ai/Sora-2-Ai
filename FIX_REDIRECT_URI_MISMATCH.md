# 🔧 修复 Google OAuth redirect_uri_mismatch 错误

## ❌ 错误信息

```
錯誤代碼 400： redirect_uri_mismatch
```

## 🔍 问题原因

从终端日志可以看到：

1. **服务器可能运行在不同端口**：
   - 有时运行在 `localhost:3000`
   - 有时运行在 `localhost:3001`（当 3000 被占用时）

2. **Google OAuth 回调 URL 配置不匹配**：
   - 当前配置：`http://localhost:3001/api/auth/callback/google`
   - 如果服务器实际运行在 `3000`，就会不匹配

3. **Google Cloud Console 中可能只配置了一个端口**

## ✅ 解决方案

### 方案 1：在 Google Cloud Console 中添加两个端口的重定向 URI（推荐）

**必须同时添加以下两个重定向 URI**：

1. `http://localhost:3000/api/auth/callback/google`
2. `http://localhost:3001/api/auth/callback/google`

**操作步骤**：

1. **访问 Google Cloud Console**：
   ```
   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
   ```

2. **找到您的 OAuth 2.0 客户端**（包含 `222103705593` 的那个）

3. **点击客户端名称**进入详情页（不是编辑按钮）

4. **在"已获授权的重定向URI"部分**：
   - 确保以下两个 URI 都存在：
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```

5. **如果没有，点击"+ 添加URI"添加缺失的那个**

6. **保存更改**

7. **等待 1-2 分钟**让 Google 同步配置

### 方案 2：统一使用固定端口（替代方案）

如果您希望始终使用同一个端口：

1. **停止当前服务器**

2. **确保端口 3000 可用**：
   ```bash
   # 终止占用 3000 端口的进程
   lsof -ti:3000 | xargs kill -9 2>/dev/null
   ```

3. **启动服务器**：
   ```bash
   npm run dev
   ```

4. **更新 `.env.local`**：
   ```env
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **确保 Google Cloud Console 中配置了**：
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 方案 3：检查当前配置并更新

运行检查脚本：

```bash
./check-google-oauth.sh
```

根据输出确认：
- 当前服务器运行的端口
- Google Cloud Console 中配置的端口

## 📋 详细配置步骤

### 在 Google Cloud Console 中添加重定向 URI

1. **访问凭据页面**：
   ```
   https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
   ```

2. **找到 OAuth 客户端**：
   - 查找客户端 ID 包含：`222103705593-n67hsjl9mnt5i69ke...`
   - 或者名称类似："Web client" 的 OAuth 2.0 客户端

3. **点击客户端名称**（左侧的名称链接，不是右侧的编辑图标）

4. **滚动到"已获授权的重定向URI"部分**

5. **检查现有 URI**：
   - 如果只有 `http://localhost:3001/api/auth/callback/google`
   - 需要添加 `http://localhost:3000/api/auth/callback/google`

6. **添加新 URI**：
   - 点击"+ 添加URI"或"添加URI"按钮
   - 输入：`http://localhost:3000/api/auth/callback/google`
   - 确保格式完全正确，包括 `http://` 和完整路径

7. **保存**（通常是"保存"按钮在页面底部）

8. **等待配置生效**（1-2 分钟）

## 🔍 验证修复

### 步骤 1: 确认服务器端口

```bash
# 查看当前服务器运行在哪个端口
lsof -ti:3000,3001
curl -s http://localhost:3000/api/auth/providers | grep callbackUrl
```

### 步骤 2: 确认 Google 配置

在 Google Cloud Console 中：
- ✅ `http://localhost:3000/api/auth/callback/google` 已添加
- ✅ `http://localhost:3001/api/auth/callback/google` 已添加

### 步骤 3: 测试登录

1. 访问登录页面：`http://localhost:3000/auth/signin`
2. 点击 "Continue with Google"
3. 应该能正常跳转到 Google 授权页面
4. 授权后应该能正常回调

## ⚠️ 重要提醒

### 重定向 URI 格式必须完全匹配：

✅ **正确格式**：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

❌ **错误格式**：
```
http://localhost:3000/api/auth/callback/google/  （末尾不能有斜杠）
https://localhost:3000/api/auth/callback/google   （不能是 https）
localhost:3000/api/auth/callback/google           （缺少 http://）
http://localhost:3000/callback/google             （路径不完整）
```

### 字段位置很重要：

- ✅ **"已获授权的重定向URI"**（Authorized redirect URIs）- 这里添加完整路径
- ❌ **"已获授权的 JavaScript 来源"**（Authorized JavaScript origins）- 这里只添加域名，不能有路径

## 🚀 快速修复命令

创建一个临时脚本来辅助修复：

```bash
# 检查当前端口
CURRENT_PORT=$(lsof -ti:3000 2>/dev/null && echo "3000" || echo "3001")
echo "当前服务器运行在端口: $CURRENT_PORT"

# 显示需要添加的 URI
echo "请在 Google Cloud Console 确保以下 URI 都已添加："
echo "  http://localhost:3000/api/auth/callback/google"
echo "  http://localhost:3001/api/auth/callback/google"
```

## 📞 如果仍然无法修复

如果添加了两个端口的 URI 后仍然报错：

1. **等待更长时间**（Google 配置可能需要 5-10 分钟同步）

2. **清除浏览器缓存和 Cookie**：
   - 清除 `localhost` 相关的 Cookie
   - 使用无痕模式测试

3. **重新创建 OAuth 客户端**：
   - 在 Google Cloud Console 删除现有客户端
   - 创建新的"Web 应用程序"客户端
   - 在创建时一次性添加两个端口的重定向 URI

4. **检查 OAuth 同意屏幕**：
   - 确保同意屏幕配置已完成
   - 确保测试用户已添加

---

**关键点**：**必须同时配置两个端口的重定向 URI**，因为 Next.js 开发服务器可能会根据端口占用情况切换端口。
