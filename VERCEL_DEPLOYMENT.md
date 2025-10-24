# Vercel 部署配置说明

## 问题解决

Vercel 部署失败的原因是项目结构问题：
- Next.js 项目位于 `sora-ai-platform/` 子目录中
- Vercel 默认在根目录查找 Next.js 项目
- 需要配置正确的根目录和构建命令

## 解决方案

### 方法 1: 在 Vercel 控制台设置根目录（推荐）

1. **在 Vercel 控制台中设置**：
   - 进入项目设置 (Project Settings)
   - 找到 "Root Directory" 设置
   - 设置为 `sora-ai-platform`
   - 保存设置

2. **重新部署**：
   - 触发新的部署
   - Vercel 会自动使用正确的根目录

### 方法 2: 使用根目录 package.json 和 vercel.json 配置

1. **更新了根目录 `package.json`**：
   ```json
   {
     "name": "sora-2-ai",
     "version": "1.0.0",
     "description": "Sora2视频生成AI应用",
     "private": true,
     "scripts": {
       "dev": "cd sora-ai-platform && npm run dev",
       "build": "cd sora-ai-platform && npm run build",
       "start": "cd sora-ai-platform && npm run start",
       "lint": "cd sora-ai-platform && npm run lint"
     },
     "workspaces": [
       "sora-ai-platform"
     ],
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **创建了 `vercel.json` 配置文件**：
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "sora-ai-platform/.next",
     "installCommand": "npm install",
     "devCommand": "npm run dev",
     "framework": "nextjs"
   }
   ```

### 3. 环境变量配置

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

### 4. 部署步骤

1. **提交代码到 GitHub**：
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **在 Vercel 中设置根目录**：
   - 进入项目设置
   - 设置 Root Directory 为 `sora-ai-platform`
   - 保存设置

3. **设置环境变量**：
   - 在 Vercel 控制台中添加必要的环境变量

4. **重新部署**：
   - 触发新的部署

### 5. 验证部署

部署成功后，访问您的 Vercel 域名应该能看到：
- 主页正常显示
- 样式正确加载
- API 路由正常工作

## 注意事项

- **推荐使用方法 1**：在 Vercel 控制台直接设置根目录
- 确保所有依赖都在 `sora-ai-platform/package.json` 中
- 环境变量必须在 Vercel 控制台中设置
- 数据库需要单独配置（推荐使用 Supabase 或 PlanetScale）

## 故障排除

如果仍然遇到问题：

1. **检查 Vercel 控制台设置**：
   - 确认 Root Directory 设置为 `sora-ai-platform`
   - 确认 Framework Preset 设置为 Next.js

2. **检查 package.json**：
   - 确认 `sora-ai-platform/package.json` 中有 `next` 依赖

3. **重新部署**：
   - 删除之前的部署
   - 重新导入项目
   - 设置正确的根目录
