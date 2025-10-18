# 🔒 安全测试指南

## ⚠️ 安全提醒
- 永远不要在聊天中分享敏感信息
- 包括：API密钥、密码、连接字符串等

## 🔧 安全测试步骤

### 1. 使用Supabase Dashboard测试
- 登录 Supabase Dashboard
- 进入您的项目
- 点击左侧菜单的 "SQL Editor"
- 直接在这里执行SQL语句

### 2. 测试数据库连接
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

### 3. 测试用户表
```sql
-- 查看用户表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User' AND table_schema = 'public';

-- 查看现有用户
SELECT id, name, email, "subscriptionPlan", "createdAt" FROM "User";
```

### 4. 测试插入数据
```sql
-- 插入测试用户
INSERT INTO "User" (
    "id",
    "name",
    "email",
    "emailVerified",
    "image",
    "createdAt",
    "updatedAt",
    "subscriptionId",
    "subscriptionStatus",
    "subscriptionPlan",
    "subscriptionEndsAt"
) VALUES (
    'test_user_001',
    'Test User',
    'test@example.com',
    NULL,
    NULL,
    NOW(),
    NOW(),
    NULL,
    NULL,
    'basic',
    NULL
);
```

### 5. 验证插入结果
```sql
-- 查看插入的用户
SELECT * FROM "User" WHERE email = 'test@example.com';

-- 查看所有用户
SELECT id, name, email, "subscriptionPlan", "createdAt" FROM "User";
```

## 🛡️ 安全最佳实践
1. 使用Supabase Dashboard的SQL Editor
2. 不要分享连接字符串
3. 定期备份数据
4. 监控访问日志
5. 使用参数化查询防止SQL注入




