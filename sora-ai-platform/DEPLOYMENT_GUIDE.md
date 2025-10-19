# 🚀 Sora AI 部署指南

## 📋 部署方式选择

### 方式1: 本地开发（推荐用于开发）
```bash
# 使用启动脚本
./start.sh

# 或手动启动
npm install
npm run dev
```

### 方式2: Docker部署（推荐用于生产）
```bash
# 使用Docker启动脚本
./docker-start.sh

# 或手动启动
docker-compose up -d
```

### 方式3: 生产环境部署
```bash
# 使用部署脚本
./scripts/deploy.sh
```

## 🌐 访问地址

- **本地开发**: http://localhost:3000
- **Docker部署**: http://localhost:3000
- **生产环境**: https://your-domain.com

## 🔧 环境要求

### 本地开发
- Node.js 18+
- npm 或 yarn
- 数据库连接

### Docker部署
- Docker
- docker-compose
- 4GB+ 内存

### 生产环境
- Ubuntu 20.04+ / CentOS 8+
- 4GB+ RAM
- 50GB+ 存储
- PostgreSQL + Redis

## 📱 功能测试

### 基础功能
- [ ] 首页访问
- [ ] 语言切换
- [ ] 用户注册/登录
- [ ] 视频生成
- [ ] 支付功能

### 国际化功能
- [ ] 英文版: /en
- [ ] 中文版: /zh
- [ ] 语言切换器
- [ ] 翻译完整性

### 移动端测试
- [ ] 响应式设计
- [ ] 移动端菜单
- [ ] 触摸交互
- [ ] 性能表现

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -ti:3000
   # 杀死进程
   kill -9 $(lsof -ti:3000)
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存
   rm -rf node_modules package-lock.json
   # 重新安装
   npm install
   ```

3. **Docker启动失败**
   ```bash
   # 检查Docker状态
   docker --version
   docker-compose --version
   # 重启Docker服务
   sudo systemctl restart docker
   ```

## 📊 性能监控

### 开发环境
- 访问: http://localhost:3000/admin/performance
- 查看性能指标
- 优化建议

### 生产环境
- 监控服务器资源
- 数据库性能
- 用户访问统计

## 🔒 安全配置

### 环境变量
- 配置生产环境变量
- 设置安全密钥
- 数据库连接字符串

### 网络安全
- HTTPS配置
- 防火墙设置
- 访问控制

## 📈 扩展功能

### 短期优化
- CDN配置
- 缓存策略
- 性能优化

### 长期规划
- 微服务架构
- 负载均衡
- 全球部署

---

**🎉 部署完成后，您的Sora AI平台将支持：**
- ✅ 中英文国际化
- ✅ 用户等级系统
- ✅ 邀请奖励机制
- ✅ 社交分享功能
- ✅ 病毒式传播
- ✅ 性能监控
- ✅ 移动端适配
