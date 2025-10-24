# 🚀 Sora AI 平台部署指南

## 📋 目录
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [数据库配置](#数据库配置)
- [API配置](#api配置)
- [支付配置](#支付配置)
- [Docker部署](#docker部署)
- [故障排除](#故障排除)

## 🖥️ 系统要求

### 最低要求
- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **内存**: 4GB RAM
- **存储**: 10GB 可用空间

### 推荐配置
- **Node.js**: 20.x LTS
- **内存**: 8GB RAM
- **存储**: 20GB 可用空间
- **Docker**: 20.x 或更高版本（可选）

## 🚀 快速开始

### 方法一：一键启动（推荐）
```bash
# 进入项目目录
cd sora-ai-platform

# 运行快速启动脚本
./quick-start.sh
```

### 方法二：手动启动
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
./setup-env.sh

# 3. 初始化数据库
npx prisma generate
npx prisma db push

# 4. 启动开发服务器
npm run dev
```

## ⚙️ 环境配置

### 必需的环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NEXTAUTH_URL` | 应用URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT密钥 | `your-secret-key` |
| `DATABASE_URL` | 数据库连接 | `file:./dev.db` |
| `SORA_API_KEY` | Sora API密钥 | `your-api-key` |

### 可选的环境变量

| 变量名 | 描述 | 用途 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth客户端ID | 社交登录 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth客户端密钥 | 社交登录 |
| `STRIPE_SECRET_KEY` | Stripe密钥 | 支付功能 |
| `STRIPE_PUBLISHABLE_KEY` | Stripe公钥 | 支付功能 |
| `REDIS_URL` | Redis连接 | 缓存和会话 |

### 配置步骤

1. **运行环境配置脚本**
```bash
./setup-env.sh
```

2. **编辑环境变量文件**
```bash
nano .env.local
```

3. **配置必需的API密钥**
```bash
# 编辑 .env.local 文件，填入实际值
SORA_API_KEY=your-actual-sora-api-key
NEXT_PUBLIC_SORA_API_KEY=your-actual-sora-api-key
```

## 🗄️ 数据库配置

### SQLite（默认，开发环境）
```bash
# 使用默认SQLite数据库
DATABASE_URL="file:./dev.db"

# 初始化数据库
npx prisma generate
npx prisma db push
```

### PostgreSQL（生产环境）
```bash
# 配置PostgreSQL连接
DATABASE_URL="postgresql://username:password@localhost:5432/sora_ai"

# 初始化数据库
npx prisma generate
npx prisma db push
```

### 数据库管理
```bash
# 打开Prisma Studio（数据库管理界面）
npx prisma studio

# 重置数据库
npx prisma db push --force-reset

# 查看数据库状态
npx prisma db status
```

## 🔌 API配置

### Sora API配置
1. **获取API密钥**
   - 访问 [Sora API官网](https://grsai.dakka.com.cn)
   - 注册账号并获取API密钥

2. **配置API密钥**
```bash
# 在 .env.local 中配置
SORA_API_KEY=your-sora-api-key
NEXT_PUBLIC_SORA_API_KEY=your-sora-api-key
```

3. **测试API连接**
```bash
# 访问测试页面
http://localhost:3000/test-api
```

### Google OAuth配置（可选）
1. **创建Google OAuth应用**
   - 访问 [Google Cloud Console](https://console.cloud.google.com)
   - 创建OAuth 2.0客户端ID

2. **配置OAuth凭据**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 💳 支付配置

### Stripe配置（可选）
1. **创建Stripe账号**
   - 访问 [Stripe官网](https://stripe.com)
   - 获取API密钥

2. **配置支付密钥**
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

3. **创建产品价格**
```bash
# 运行Stripe产品创建脚本
node scripts/create-stripe-products.js
```

## 🐳 Docker部署

### 使用Docker Compose（推荐）
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

### 手动Docker部署
```bash
# 构建镜像
docker build -t sora-ai-platform .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e SORA_API_KEY="your-api-key" \
  sora-ai-platform
```

### Docker服务说明
- **app**: 主应用服务（端口3000）
- **db**: PostgreSQL数据库（端口5432）
- **redis**: Redis缓存（端口6379）
- **nginx**: 反向代理（端口80/443）

## 🔍 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 检查端口占用
lsof -i :3000

# 杀死占用进程
kill -9 $(lsof -t -i:3000)

# 或修改端口
PORT=3001 npm run dev
```

#### 2. 数据库连接失败
```bash
# 检查数据库文件权限
ls -la dev.db

# 重新初始化数据库
rm dev.db
npx prisma db push
```

#### 3. 依赖安装失败
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install
```

#### 4. API调用失败
```bash
# 检查API密钥配置
grep SORA_API_KEY .env.local

# 测试API连接
curl -X POST https://grsai.dakka.com.cn/v1/video/sora-video \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"model":"sora-2","prompt":"test"}'
```

### 日志查看
```bash
# 开发环境日志
npm run dev

# Docker日志
docker-compose logs -f app

# 生产环境日志
pm2 logs sora-ai
```

### 性能监控
```bash
# 检查系统资源
htop

# 检查Docker资源
docker stats

# 检查应用性能
npm run build && npm start
```

## 📊 部署检查

### 运行部署检查脚本
```bash
./check-deployment.sh
```

### 手动检查项目
```bash
# 检查Node.js版本
node --version

# 检查依赖
npm list

# 检查环境变量
cat .env.local

# 检查数据库
npx prisma db status

# 检查构建
npm run build
```

## 🎯 生产部署

### 构建生产版本
```bash
# 构建应用
npm run build

# 启动生产服务器
npm start

# 或使用PM2管理
npm install -g pm2
pm2 start npm --name "sora-ai" -- start
```

### 环境变量配置
```bash
# 生产环境配置
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 安全配置
```bash
# 生成强密钥
openssl rand -base64 32

# 配置HTTPS
# 配置防火墙
# 配置SSL证书
```

## 📞 技术支持

如果遇到问题，请：

1. **查看日志文件**
2. **运行部署检查脚本**
3. **检查环境变量配置**
4. **查看GitHub Issues**
5. **联系技术支持**

---

🎉 **部署完成！** 访问 http://localhost:3000 开始使用 Sora AI 平台！
