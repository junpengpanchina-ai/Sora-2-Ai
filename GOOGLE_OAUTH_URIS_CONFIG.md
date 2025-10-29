# 🔧 Google OAuth URI 配置正确方法

## ⚠️ 错误原因

当您看到 "URI 不能包含路径或以'/'结尾" 错误时，说明您把URI添加到了**错误的位置**。

## 📋 两个不同的配置区域

在Google Cloud Console编辑OAuth客户端时，有**两个完全不同的配置区域**：

### 区域 1️⃣：已获授权的 JavaScript 来源

**位置标签**：通常会显示为 "Authorized JavaScript origins" 或 "已获授权的 JavaScript 来源"

**格式要求**：
- ✅ **只能包含**：协议 + 域名 + 端口
- ❌ **不能包含**：路径、查询参数、尾部斜杠

**正确示例**：
```
http://localhost:3000
http://localhost:3001
http://sora2aivideos.com
```

**错误示例**（会导致您看到的错误）：
```
❌ http://localhost:3000/api/auth/callback/google  （包含路径）
❌ http://localhost:3000/                          （以"/"结尾）
```

### 区域 2️⃣：已获授权的重定向URI

**位置标签**：通常会显示为 "Authorized redirect URIs" 或 "已获授权的重定向URI"

**格式要求**：
- ✅ **必须包含**：完整路径
- ✅ **必须精确匹配**：包括协议、域名、端口和完整路径

**正确示例**：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

**错误示例**：
```
❌ http://localhost:3000/api/auth/callback/google/  （尾部斜杠）
❌ http://localhost:3000                            （缺少路径）
```

## 🎯 正确配置步骤（一步步操作）

### 步骤 1: 访问编辑页面

```
https://console.cloud.google.com/apis/credentials?project=skilled-acolyte-476516-g8
```

找到您的OAuth客户端并点击**"编辑"**。

### 步骤 2: 查找配置区域

在编辑页面中，您会看到类似这样的布局：

```
┌─────────────────────────────────────────────────┐
│ OAuth 客户端ID设置                               │
├─────────────────────────────────────────────────┤
│ 已获授权的 JavaScript 来源                       │  ← 区域1（不要路径）
│ [ 输入框 ]                                       │
│ http://localhost:3000                           │
│                                                  │
│ 已获授权的重定向URI                               │  ← 区域2（需要路径）
│ [ 输入框 ]                                       │
│ [ 空 ]                                          │
└─────────────────────────────────────────────────┘
```

### 步骤 3: 配置 JavaScript 来源（区域1）

**在这个区域**（"已获授权的 JavaScript 来源"）：

1. 如果输入框为空，点击输入框
2. 输入（**只有域名和端口**）：
   ```
   http://localhost:3000
   ```
3. 如果有 "+ 添加URI" 按钮，点击它添加下一个
4. 输入：
   ```
   http://localhost:3001
   ```

⚠️ **关键**：这里不能有 `/api/auth/callback/google` 路径！

### 步骤 4: 配置重定向URI（区域2 - 关键！）

**滚动或向下找到** "已获授权的重定向URI" 区域（通常在JavaScript来源下方）。

**在这个区域**：

1. 找到 **"+ 添加URI"** 按钮（通常在这个区域的右侧或下方）
2. 点击 **"+ 添加URI"**
3. 会弹出新的输入框
4. 在输入框中输入（**必须包含完整路径**）：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. 再次点击 **"+ 添加URI"**
6. 在第二个输入框中输入：
   ```
   http://localhost:3001/api/auth/callback/google
   ```

⚠️ **关键**：这里必须有 `/api/auth/callback/google` 路径！

### 步骤 5: 保存

点击页面底部的 **"保存"** 按钮。

## 🔍 如何确认配置正确

保存后，您应该看到类似这样的配置：

### ✅ 已获授权的 JavaScript 来源：
```
http://localhost:3000
http://localhost:3001
```

### ✅ 已获授权的重定向URI：
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

## ⚠️ 如果仍然看到错误

### 情况 1: "URI 不能包含路径" 错误

**可能原因**：您在"JavaScript 来源"区域添加了包含路径的URI

**解决方法**：
- 从"JavaScript 来源"中删除包含路径的URI
- 只保留 `http://localhost:3000` 这样的格式（无路径）
- 将包含路径的URI添加到"重定向URI"区域

### 情况 2: 找不到"重定向URI"配置区域

**解决方法**：
- 向下滚动页面，通常这个区域在JavaScript来源下方
- 查找标签为 "Authorized redirect URIs" 或类似的中文标签
- 如果没有看到，可能需要展开某个折叠区域

### 情况 3: 界面版本不同

某些Google Cloud Console版本可能布局不同。

**建议**：
1. 查找带有 "redirect" 或 "回调" 关键词的区域
2. 查找允许您添加多个URI的区域（通常有 "+ 添加URI" 按钮）
3. 尝试搜索页面中的关键词

## 📸 配置示例（文本描述）

在Google Cloud Console中，正确的配置应该显示为：

**区域1 - 已获授权的 JavaScript 来源**：
```
┌─────────────────────────────────────┐
│ http://localhost:3000               │
│ http://localhost:3001               │
└─────────────────────────────────────┘
```

**区域2 - 已获授权的重定向URI**：
```
┌──────────────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google          │
│ http://localhost:3001/api/auth/callback/google          │
└──────────────────────────────────────────────────────────┘
```

## 🎯 快速检查

- [ ] JavaScript 来源区域：只包含 `http://localhost:3000`（无路径）
- [ ] 重定向URI区域：包含 `http://localhost:3000/api/auth/callback/google`（有路径）
- [ ] 两个区域都已正确配置
- [ ] 已保存更改

**完成这些步骤后，等待2-3分钟，然后测试Google登录！** ✅
