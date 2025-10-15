# 🔒 SQL插入指南

## ⚠️ 安全提醒
- 永远不要在聊天中分享敏感信息
- 包括：API密钥、密码、连接字符串等

## 🔧 SQL插入步骤

### 1. 使用Supabase Dashboard
- 登录 Supabase Dashboard
- 进入您的项目
- 点击左侧菜单的 "SQL Editor"
- 直接在这里执行SQL语句

### 2. 插入用户数据
```sql
-- 插入用户数据
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
    'user_123456789',  -- 生成唯一ID
    'Test User',       -- 用户名
    '123@qq.com',      -- 邮箱
    NULL,              -- 邮箱验证时间
    NULL,              -- 头像
    NOW(),             -- 创建时间
    NOW(),             -- 更新时间
    NULL,              -- 订阅ID
    NULL,              -- 订阅状态
    'basic',           -- 订阅方案
    NULL               -- 订阅结束时间
);
```

### 3. 验证插入结果
```sql
-- 查看插入的用户
SELECT * FROM "User" WHERE email = '123@qq.com';

-- 查看所有用户
SELECT id, name, email, "subscriptionPlan", "createdAt" FROM "User";
```

### 4. 更新用户数据
```sql
-- 更新用户信息
UPDATE "User" 
SET name = 'Updated Name',
    "updatedAt" = NOW()
WHERE email = '123@qq.com';
```

### 5. 删除用户数据
```sql
-- 删除用户（谨慎使用）
DELETE FROM "User" WHERE email = '123@qq.com';
```

## 🛡️ 安全最佳实践
1. 使用Supabase Dashboard的SQL Editor
2. 不要分享连接字符串
3. 定期备份数据
4. 监控访问日志
5. 使用参数化查询防止SQL注入
