# 🚀 快速本地部署

## 一键部署
```bash
# 1. 克隆项目
git clone <your-repo-url>
cd Sora-2-Ai

# 2. 快速部署
./quick-deploy.sh
```

## 手动部署
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp env.local.template .env.local
# 编辑 .env.local 文件，填入您的配置

# 3. 初始化数据库
./init-database.sh

# 4. 启动开发服务器
./start.sh dev
```

## 环境变量配置
编辑 `.env.local` 文件，至少需要配置：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe (测试环境)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# 应用
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 访问应用
- 开发环境: http://localhost:3000
- 定价页面: http://localhost:3000/pricing
- 数据库管理: `./start.sh db`

## 常用命令
```bash
./start.sh dev     # 开发模式
./start.sh build   # 构建生产版本
./start.sh start   # 启动生产服务器
./start.sh db      # 打开数据库管理
./start.sh reset   # 重置数据库
```

## 故障排除
1. **端口被占用**: `lsof -i :3000` 查看占用进程
2. **依赖安装失败**: `rm -rf node_modules && npm install`
3. **数据库错误**: `./start.sh reset` 重置数据库
4. **Stripe支付失败**: 检查密钥配置是否正确
