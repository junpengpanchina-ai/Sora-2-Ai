# 🔄 替代数据库设置方案

## 🚨 当前问题
- Supabase项目URL返回404错误
- 无法找到Connection string
- 项目可能未完全创建或ID不正确

## 💡 解决方案

### 方案1：重新创建Supabase项目
1. 访问：https://supabase.com/dashboard
2. 点击 **"New Project"**
3. 选择组织
4. 输入项目名称：`sora-ai-platform`
5. 设置数据库密码：`peng000000`
6. 选择区域（建议选择离您最近的区域）
7. 等待项目创建完成（通常需要1-2分钟）

### 方案2：使用本地PostgreSQL数据库
```bash
# 安装PostgreSQL
brew install postgresql
brew services start postgresql

# 创建数据库
createdb sora_ai_platform

# 更新.env.local
DATABASE_URL="postgresql://$(whoami):@localhost:5432/sora_ai_platform"
```

### 方案3：使用SQLite（快速测试）
修改 `prisma/schema.prisma`：
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 🔧 推荐步骤

### 立即可以做的：
1. **使用SQLite进行快速测试**
2. **或者重新创建Supabase项目**

### 使用SQLite的步骤：
1. 修改Prisma schema
2. 运行数据库迁移
3. 测试应用功能
4. 后续再迁移到Supabase

## 📋 请选择方案

请告诉我您希望：
1. **重新创建Supabase项目** - 我提供详细步骤
2. **使用本地PostgreSQL** - 我帮您安装配置
3. **使用SQLite快速测试** - 立即可以开始开发

选择后我会立即帮您配置。

