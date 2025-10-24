# 🚀 Vercel部署配置指南

## 📋 问题解决

### 问题：Next.js版本检测失败
**错误信息**: "无法识别 Next.js 版本，请确保它被定义为项目依赖项"

### 解决方案

#### 方案一：Vercel控制台设置（推荐）

1. **进入Vercel控制台**
   - 访问 [vercel.com](https://vercel.com)
   - 选择您的项目

2. **配置项目设置**
   - 进入 "Settings" → "General"
   - 设置以下配置：
     ```
     Framework Preset: Next.js
     Root Directory: sora-ai-platform
     Build Command: npm run build
     Output Directory: .next
     Install Command: npm install
     ```

3. **环境变量配置**
   - 进入 "Settings" → "Environment Variables"
   - 添加以下变量：
     ```
     NEXTAUTH_URL=https://your-domain.vercel.app
     NEXTAUTH_SECRET=your-secret-key
     DATABASE_URL=your-database-url
     SORA_API_KEY=your-sora-api-key
     NEXT_PUBLIC_SORA_API_KEY=your-sora-api-key
     ```

#### 方案二：使用Vercel CLI

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 在项目根目录部署
cd /Users/p/Documents/GitHub/Sora-2-Ai
vercel

# 4. 配置环境变量
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add SORA_API_KEY
# ... 添加其他环境变量

# 5. 重新部署
vercel --prod
```

#### 方案三：GitHub集成部署

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **在Vercel控制台重新连接**
   - 删除现有项目
   - 重新连接GitHub仓库
   - 设置根目录为 `sora-ai-platform`

## 🔧 配置文件说明

### vercel.json配置
```json
{
  "version": 2,
  "builds": [
    {
      "src": "sora-ai-platform/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "sora-ai-platform/$1"
    }
  ]
}
```

### package.json配置
根目录的package.json已添加Next.js依赖：
```json
{
  "dependencies": {
    "next": "^14.2.33"
  }
}
```

## 🚨 常见问题解决

### 1. Next.js版本检测失败
**原因**: Vercel无法找到Next.js依赖
**解决**: 
- 确保根目录package.json包含Next.js依赖
- 或在Vercel控制台设置正确的根目录

### 2. 构建失败
**原因**: 依赖安装或构建配置问题
**解决**:
- 检查Node.js版本（需要18+）
- 确保所有环境变量已配置
- 检查构建日志中的具体错误

### 3. 环境变量未生效
**原因**: 环境变量配置不正确
**解决**:
- 确保变量名正确（区分大小写）
- 检查变量值是否包含特殊字符
- 重新部署项目

## 📊 部署检查清单

### 部署前检查
- [ ] 代码已推送到GitHub
- [ ] 环境变量已配置
- [ ] 数据库连接正常
- [ ] API密钥有效

### 部署后检查
- [ ] 主页加载正常
- [ ] 用户认证功能
- [ ] 视频生成功能
- [ ] 数据库连接
- [ ] API接口正常

## 🎯 最佳实践

### 1. 环境变量管理
- 使用Vercel控制台管理环境变量
- 为不同环境（开发、预览、生产）设置不同值
- 定期轮换敏感密钥

### 2. 性能优化
- 启用Vercel Analytics
- 配置CDN缓存
- 优化图片和静态资源

### 3. 监控和日志
- 使用Vercel Functions日志
- 配置错误监控（如Sentry）
- 设置性能监控

---

🎉 **配置完成！** 现在可以成功部署到Vercel了！
