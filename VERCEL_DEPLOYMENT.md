# Vercel 部署配置说明

## 问题解决

Vercel 部署失败的原因是项目结构问题：
- Next.js 项目位于 `sora-ai-platform/` 子目录中
- Vercel 默认在根目录查找 Next.js 项目
- 需要配置正确的根目录和构建命令

## 解决方案

### 1. 创建了 `vercel.json` 配置文件

```json
{
  "buildCommand": "cd sora-ai-platform && npm run build",
  "outputDirectory": "sora-ai-platform/.next",
  "installCommand": "cd sora-ai-platform && npm install",
  "devCommand": "cd sora-ai-platform && npm run dev",
  "framework": "nextjs",
  "rootDirectory": "sora-ai-platform",
  "functions": {
    "sora-ai-platform/src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "DATABASE_URL": "@database_url"
  }
}
```

### 2. 环境变量配置

在 Vercel 控制台中设置以下环境变量：

#### 必需的环境变量：
- `NEXTAUTH_URL`: 您的域名 (例如: https://your-domain.vercel.app)
- `NEXTAUTH_SECRET`: 随机生成的密钥
- `DATABASE_URL`: 数据库连接字符串

#### 可选的环境变量：
- `SORA_API_KEY`: Sora API 密钥
- `SORA_API_URL`: Sora API 端点
- `STRIPE_SECRET_KEY`: Stripe 密钥
- `STRIPE_PUBLISHABLE_KEY`: Stripe 公钥

### 3. 部署步骤

1. 提交代码到 GitHub
2. 在 Vercel 中导入项目
3. Vercel 会自动检测到 `vercel.json` 配置
4. 设置环境变量
5. 部署

### 4. 验证部署

部署成功后，访问您的 Vercel 域名应该能看到：
- 主页正常显示
- 样式正确加载
- API 路由正常工作

## 注意事项

- 确保所有依赖都在 `sora-ai-platform/package.json` 中
- 环境变量必须在 Vercel 控制台中设置
- 数据库需要单独配置（推荐使用 Supabase 或 PlanetScale）
