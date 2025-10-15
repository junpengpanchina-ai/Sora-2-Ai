# 🔒 SQL连接指南

## ⚠️ 安全提醒
- 永远不要在聊天中分享敏感信息
- 包括：API密钥、密码、连接字符串等

## 🔧 SQL连接步骤

### 1. 使用Supabase Dashboard
- 登录 Supabase Dashboard
- 进入您的项目
- 点击左侧菜单的 "SQL Editor"
- 直接在这里执行SQL语句

### 2. 测试连接
```sql
-- 测试数据库连接
SELECT version();

-- 查看当前数据库
SELECT current_database();

-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 3. 创建必要的表
```sql
-- 创建用户表（如果不存在）
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionPlan" TEXT,
    "subscriptionEndsAt" TIMESTAMP(3)
);

-- 创建账户表
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    UNIQUE("provider", "providerAccountId")
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- 创建视频表
CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "prompt" TEXT NOT NULL,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "aspectRatio" TEXT,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL
);
```

### 4. 验证表创建
```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 🛡️ 安全最佳实践
1. 使用Supabase Dashboard的SQL Editor
2. 不要分享连接字符串
3. 定期备份数据
4. 监控访问日志
