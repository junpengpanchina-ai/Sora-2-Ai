# 🔧 连接问题修复指南

## 问题描述

**错误信息**：
```
无法访问此网站
localhost 拒绝了我们的连接请求。
```

## 原因分析

这个错误通常表示：
1. ❌ 开发服务器没有运行
2. ❌ 服务器进程已停止
3. ❌ 端口被其他程序占用
4. ❌ 服务器启动失败

## ✅ 已执行的修复

1. **检查服务器状态** - 确认服务器未运行
2. **清理构建缓存** - 删除 `.next/cache` 目录
3. **启动开发服务器** - 在后台运行 `npm run dev`

## 🚀 验证步骤

### 步骤 1: 等待服务器启动

开发服务器启动通常需要 5-15 秒。请稍等片刻。

### 步骤 2: 检查服务器状态

在终端运行：
```bash
lsof -ti:3000,3001
```

如果返回进程ID，说明服务器正在运行。

### 步骤 3: 访问网站

尝试访问：
- `http://localhost:3000`
- `http://localhost:3001` (如果 3000 被占用)

## 🔍 如果仍然无法连接

### 方案 1: 手动启动服务器

```bash
# 停止所有 Next.js 进程
pkill -f "next dev"

# 等待 2 秒
sleep 2

# 清理缓存
rm -rf .next

# 启动服务器
npm run dev
```

### 方案 2: 检查端口占用

```bash
# 查看端口占用情况
lsof -i :3000
lsof -i :3001

# 如果有其他进程占用，终止它
kill -9 $(lsof -ti:3000,3001)
```

### 方案 3: 完全重置

```bash
# 1. 停止所有相关进程
pkill -f "next dev"
pkill -f "node"

# 2. 清理所有缓存
rm -rf .next
rm -rf node_modules/.cache

# 3. 重新安装依赖（如果需要）
# npm install

# 4. 启动服务器
npm run dev
```

### 方案 4: 检查防火墙

如果使用 macOS：

```bash
# 检查防火墙状态
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 如果防火墙开启，可能需要允许 Node.js 访问网络
```

### 方案 5: 使用不同的端口

如果 3000 和 3001 都被占用，可以指定其他端口：

```bash
PORT=3002 npm run dev
```

然后访问 `http://localhost:3002`

## 📋 常见问题排查

### Q1: 服务器启动但页面空白？
- 检查浏览器控制台错误
- 检查终端中的编译错误
- 确认所有依赖已安装

### Q2: 编译成功但访问时 500 错误？
- 检查 `.env.local` 配置是否正确
- 检查数据库连接是否正常
- 查看终端中的详细错误信息

### Q3: 端口已经被占用？
```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程（替换 PID 为实际进程ID）
kill -9 <PID>

# 或者终止所有 Node 进程（谨慎使用）
pkill node
```

### Q4: 服务器启动后立即退出？

检查：
1. **依赖是否完整**：`npm install`
2. **环境变量**：确保 `.env.local` 存在且配置正确
3. **Node.js 版本**：需要 Node.js 18+ 或 20+
4. **错误日志**：查看终端输出的错误信息

## 🎯 快速诊断命令

运行以下命令进行快速诊断：

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查端口占用
lsof -ti:3000,3001

# 检查进程
ps aux | grep next

# 检查构建目录
ls -la .next 2>/dev/null || echo ".next 目录不存在"

# 检查环境文件
ls -la .env.local 2>/dev/null && echo "✅ .env.local 存在" || echo "❌ .env.local 不存在"
```

## ✅ 正常状态检查清单

服务器正常运行时应该：
- ✅ 终端显示 "Ready in XXXms"
- ✅ 显示 "Local: http://localhost:3000" 或类似消息
- ✅ 编译成功，没有错误
- ✅ 可以访问 `http://localhost:3000`

---

**当前状态**：服务器正在后台启动中，请等待 10-15 秒后尝试访问。

**如果 15 秒后仍无法访问**，请查看终端输出或运行诊断命令。
