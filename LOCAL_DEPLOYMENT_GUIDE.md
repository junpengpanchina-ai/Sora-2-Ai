# 🚀 Sora-2-Ai 本地部署指南

## 📋 系统要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **Git**: 用于克隆代码
- **数据库**: SQLite (默认) 或 PostgreSQL

## 🛠️ 部署步骤

### 1. 克隆项目
```bash
git clone https://github.com/your-username/Sora-2-Ai.git
cd Sora-2-Ai
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境变量配置

创建 `.env.local` 文件：
```bash
cp env.local.example .env.local
```

编辑 `.env.local` 文件，添加以下配置：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe 配置
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# 应用配置
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# AI API 配置 (如果需要)
OPENAI_API_KEY="your_openai_api_key"
SORA_API_KEY="your_sora_api_key"

# 邮件配置 (可选)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your_email@gmail.com"
EMAIL_SERVER_PASSWORD="your_app_password"
EMAIL_FROM="your_email@gmail.com"
```

### 4. 数据库初始化
```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库架构
npm run db:push
```

### 5. 启动开发服务器
```bash
npm run dev
```

### 6. 访问应用
打开浏览器访问：`http://localhost:3000`

## 🔧 配置说明

### Stripe 配置
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 获取测试环境的 Secret Key 和 Publishable Key
3. 在 Stripe Dashboard 中创建产品：
   - 青铜会员: $2.00/月
   - 白银会员: $8.00/月
   - 黄金会员: $20.00/月
   - 钻石会员: $40.00/月

### 数据库配置
- **SQLite** (默认): 使用本地文件数据库
- **PostgreSQL**: 修改 `prisma/schema.prisma` 中的 `provider` 为 `"postgresql"`

## 📁 项目结构

```
Sora-2-Ai/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── auth/           # 认证页面
│   │   ├── pricing/        # 定价页面
│   │   └── ...
│   ├── components/         # React 组件
│   ├── lib/               # 工具库
│   │   ├── stripe.ts      # Stripe 配置
│   │   ├── pricing-calculator.ts  # 定价计算
│   │   └── ...
│   └── styles/            # 样式文件
├── prisma/                # 数据库配置
├── public/               # 静态资源
├── messages/             # 国际化文件
└── ...
```

## 🎯 功能特性

### 会员体系
- **体验版**: 免费，需要邀请码
- **青铜会员**: $2.00/月，30个5秒视频
- **白银会员**: $8.00/月，60个10秒视频
- **黄金会员**: $20.00/月，120个15秒视频
- **钻石会员**: $40.00/月，200个15秒视频

### 支付功能
- Stripe 集成
- 订阅管理
- 升级优惠
- 邀请奖励

### 积分系统
- 邀请奖励
- 使用奖励
- 会员奖励
- 积分兑换

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用其他端口
npm run dev -- -p 3001
```

### 2. 数据库连接失败
```bash
# 重新生成 Prisma 客户端
npm run db:generate

# 重置数据库
rm prisma/dev.db
npm run db:push
```

### 3. Stripe 支付失败
- 检查 Stripe 密钥是否正确
- 确认价格 ID 是否有效
- 检查网络连接

### 4. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

## 🚀 生产环境部署

### 1. 构建项目
```bash
npm run build
```

### 2. 启动生产服务器
```bash
npm start
```

### 3. 使用 PM2 管理进程
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "sora-ai" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs sora-ai
```

## 📊 监控和日志

### 1. 应用日志
```bash
# 查看 Next.js 日志
npm run dev 2>&1 | tee app.log

# 使用 PM2 查看日志
pm2 logs sora-ai
```

### 2. 数据库监控
```bash
# 查看数据库文件大小
ls -lh prisma/dev.db

# 使用 Prisma Studio
npx prisma studio
```

## 🔒 安全配置

### 1. 环境变量安全
- 不要将 `.env.local` 提交到版本控制
- 使用强密码和密钥
- 定期轮换 API 密钥

### 2. 数据库安全
- 使用强密码
- 限制数据库访问权限
- 定期备份数据

### 3. API 安全
- 使用 HTTPS
- 实施速率限制
- 验证输入数据

## 📈 性能优化

### 1. 数据库优化
```bash
# 创建索引
npx prisma db seed

# 分析查询性能
npx prisma studio
```

### 2. 缓存配置
- 启用 Next.js 缓存
- 使用 Redis 缓存
- 配置 CDN

### 3. 图片优化
- 使用 WebP 格式
- 实施懒加载
- 压缩图片

## 🆘 获取帮助

如果遇到问题，可以：
1. 查看项目文档
2. 检查 GitHub Issues
3. 联系开发团队

---

**祝您部署成功！** 🎉
