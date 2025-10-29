# ✅ Google OAuth 正确配置指南

## ⚠️ 您遇到的错误

```
来源无效：URI 不能包含路径或以"/"结尾
```

这个错误通常是因为您将URI添加到了**错误的位置**。

## 🔍 两个不同的配置项

Google Cloud Console 中有**两个不同的配置区域**，它们有不同的规则：

### 1️⃣ 已获授权的 JavaScript 来源（JavaScript Origins）

**位置**：在OAuth客户端编辑页面的"已获授权的 JavaScript 来源"部分

**规则**：
- ✅ **只能包含域名和端口**
- ❌ **不能包含路径**
- ❌ **不能以"/"结尾**

**正确的格式**：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

**错误的格式**：
```
❌ http://localhost:3000/api/auth/callback/google  （包含路径）
❌ http://localhost:3000/                         （以"/"结尾）
```

### 2️⃣ 已获授权的重定向URI（Authorized Redirect URIs）

**位置**：在OAuth客户端编辑页面的"已获授权的重定向URI"部分

**规则**：
- ✅ **必须包含完整路径**
- ✅ **必须精确匹配：http://localhost:3000/api/auth/callback/google**

**正确的格式**：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

## 📝 正确配置步骤

### 步骤 1: 访问编辑页面

```
https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
```

找到您的OAuth客户端并点击"编辑"。

### 步骤 2: 配置 JavaScript 来源（第一部分）

在 **"已获授权的 JavaScript 来源"** 部分：

1. 如果有旧的配置，可以先删除或保留
2. 点击 **"+ 添加URI"**
3. 添加（**不要包含路径**）：
   ```
   http://localhost:3000
   ```
4. 再次点击 **"+ 添加URI"**
5. 添加：
   ```
   http://localhost:3001
   ```
6. （可选）添加：
   ```
   http://sora2aivideos.com
   ```

**重要**：这里只写域名+端口，不写路径！

### 步骤 3: 配置重定向URI（第二部分，关键！）

在 **"已获授权的重定向URI"** 部分：

1. 点击 **"+ 添加URI"**
2. 添加（**必须包含完整路径**）：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
3. 再次点击 **"+ 添加URI"**
4. 添加：
   ```
   http://localhost:3001/api/auth/callback/google
   ```

**重要**：这里必须包含完整路径 `/api/auth/callback/google`！

### 步骤 4: 保存

点击页面底部的 **"保存"** 按钮。

## 📊 配置对比表

| 配置项 | 位置 | 格式 | 示例 |
|--------|------|------|------|
| **JavaScript 来源** | "已获授权的 JavaScript 来源" | 只有域名+端口 | `http://localhost:3000` |
| **重定向URI** | "已获授权的重定向URI" | 完整URI包含路径 | `http://localhost:3000/api/auth/callback/google` |

## ✅ 最终配置示例

您的配置应该像这样：

### 已获授权的 JavaScript 来源：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

### 已获授权的重定向URI：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

## 🔍 如何区分两个配置区域

在Google Cloud Console编辑页面中：

1. **"已获授权的 JavaScript 来源"**
   - 通常在上方或左侧
   - 标签说明：用于JavaScript API调用

2. **"已获授权的重定向URI"**
   - 通常在下方或右侧
   - 标签说明：用于OAuth回调

## 🎯 关键提示

**您遇到的错误**：
- 如果您将 `http://localhost:3000/api/auth/callback/google` 添加到了"JavaScript 来源"，就会出现这个错误
- **解决方案**：将完整URI添加到"重定向URI"部分，而不是"JavaScript 来源"部分

**正确做法**：
- JavaScript 来源 = 只有 `http://localhost:3000`（无路径）
- 重定向URI = `http://localhost:3000/api/auth/callback/google`（有路径）

完成正确的配置后，保存并等待2-3分钟，错误就会解决了！✅
