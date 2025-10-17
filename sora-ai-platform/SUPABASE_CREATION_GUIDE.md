# 🚀 创建新的Supabase项目 - 详细步骤

## 📋 第一步：访问Supabase Dashboard

1. 打开浏览器，访问：https://supabase.com/dashboard
2. 使用您的GitHub账户登录（推荐）

## 🆕 第二步：创建新项目

### 2.1 点击"New Project"
- 在Dashboard首页点击 **"New Project"** 按钮
- 或者点击右上角的 **"+"** 图标

### 2.2 选择组织
- 选择您的个人组织或个人账户
- 如果没有组织，会自动使用个人账户

### 2.3 填写项目信息
- **Project Name（项目名称）**: `sora-ai-platform`
- **Database Password（数据库密码）**: `peng000000` （请记住这个密码）
- **Region（区域）**: 选择离您最近的区域
  - 中国用户建议选择：`Asia Pacific (Singapore)` 或 `Asia Pacific (Tokyo)`
  - 美国用户建议选择：`US West (Oregon)` 或 `US East (N. Virginia)`

### 2.4 确认创建
- 点击 **"Create new project"**
- 等待项目创建完成（通常需要1-2分钟）

## ⏳ 第三步：等待项目激活

### 3.1 查看项目状态
- 项目创建后，您会看到项目概览页面
- 等待所有服务完全启动（绿色状态指示器）

### 3.2 确认服务状态
确保以下服务都显示为绿色（活跃状态）：
- ✅ Database
- ✅ API
- ✅ Auth
- ✅ Storage

## 🔗 第四步：获取连接信息

### 4.1 进入数据库设置
1. 点击左侧菜单的 **"Settings"（设置）**
2. 点击 **"Database"（数据库）**

### 4.2 找到连接字符串
在 **"Connection string"** 部分，您会看到：

#### 方式A：Transaction Mode（推荐用于Prisma）
- 标签：**"URI"**
- 格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- 用途：用于Prisma等ORM工具

#### 方式B：Session Mode（连接池）
- 标签：**"Session"**
- 格式：`postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
- 用途：用于连接池

### 4.3 复制连接字符串
1. 选择 **"URI"** 标签（Transaction Mode）
2. 点击 **"Copy"** 按钮复制连接字符串
3. 将 `[YOUR-PASSWORD]` 替换为：`peng000000`

## 📝 第五步：记录项目信息

请记录以下信息并发送给我：

### 必需信息：
1. **完整的DATABASE_URL**（替换密码后的完整字符串）
2. **项目引用ID**（在连接字符串中的 `[PROJECT-REF]` 部分）
3. **项目区域**（如 us-west-1, ap-southeast-1 等）

### 可选信息：
1. **API URL**（在 Settings → API 中）
2. **anon public key**（在 Settings → API 中）

## ⚠️ 注意事项

1. **密码安全**：不要在任何地方分享您的数据库密码
2. **项目激活**：确保项目完全激活后再获取连接信息
3. **区域选择**：选择离您最近的区域以获得更好的性能
4. **免费额度**：Supabase免费计划每月有500MB数据库存储

## 🎯 完成后

一旦您获取到正确的连接字符串，我会立即帮您：
1. 更新 `.env.local` 文件
2. 运行数据库迁移
3. 测试连接
4. 启动应用

请按照上述步骤操作，完成后将连接字符串发送给我！

