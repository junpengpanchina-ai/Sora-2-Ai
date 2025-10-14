# Sora2 AI视频生成器

一个基于Sora2 API的现代化视频生成应用，支持从文本描述生成高质量视频。

## ✨ 功能特性

- 🎬 **智能视频生成** - 基于文本描述生成高质量视频
- 🖼️ **参考图片支持** - 可上传参考图片提升生成效果
- 📱 **多比例支持** - 支持9:16竖屏和16:9横屏
- ⏱️ **灵活时长** - 支持10秒和15秒视频
- 🎨 **质量选择** - 标准质量和高清质量可选
- 📊 **实时进度** - WebSocket实时显示生成进度
- 💾 **一键下载** - 生成完成后可直接下载视频
- 📱 **响应式设计** - 完美适配各种设备

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Sora-2-Ai
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   
   # 编辑环境变量文件
   nano .env
   ```
   
   在 `.env` 文件中配置以下变量：
   ```env
   SORA_API_BASE_URL=https://grsai.dakka.com.cn
   SORA_API_KEY=your_api_key_here
   PORT=3000
   WS_PORT=3001
   ```

4. **启动应用**
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## 📖 使用指南

### 基本使用

1. **输入视频描述**
   - 在提示词框中详细描述您想要的视频内容
   - 描述越详细，生成效果越好

2. **选择视频设置**
   - **视频比例**: 9:16 (竖屏) 或 16:9 (横屏)
   - **视频时长**: 10秒 或 15秒
   - **视频质量**: 标准质量 或 高清质量

3. **可选设置**
   - 上传参考图片URL（可选）
   - 图片将作为AI生成的参考

4. **生成视频**
   - 点击"生成视频"按钮
   - 等待AI处理完成
   - 查看生成的视频并下载

### 提示词技巧

- **详细描述场景**: "一只可爱的小猫在花园里追逐蝴蝶，阳光明媚，花朵盛开"
- **包含动作描述**: "海浪拍打着岩石，夕阳西下，海鸥在天空中飞翔"
- **描述环境氛围**: "未来城市的空中交通，飞行汽车穿梭在高楼大厦之间，霓虹灯闪烁"

## 🛠️ 技术架构

### 后端技术栈
- **Node.js** - 服务器运行环境
- **Express.js** - Web框架
- **WebSocket** - 实时通信
- **Axios** - HTTP客户端

### 前端技术栈
- **原生JavaScript** - 无框架依赖
- **CSS3** - 现代化样式
- **WebSocket** - 实时进度更新
- **HTML5 Video** - 视频播放

### API集成
- **Sora2 API** - 视频生成服务
- **RESTful API** - HTTP接口
- **WebSocket** - 实时通信

## 📁 项目结构

```
Sora-2-Ai/
├── public/                 # 前端静态文件
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   └── app.js            # 前端逻辑
├── services/              # 服务层
│   └── soraService.js    # Sora2 API服务
├── server.js             # 服务器入口
├── config.js             # 配置文件
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 🔧 API接口

### 生成视频
```http
POST /api/generate-video
Content-Type: application/json

{
  "prompt": "视频描述",
  "url": "参考图片URL（可选）",
  "aspectRatio": "16:9",
  "duration": 10,
  "size": "small"
}
```

### 获取结果
```http
POST /api/get-result
Content-Type: application/json

{
  "id": "任务ID"
}
```

### 获取选项
```http
GET /api/options
```

## 🌟 特色功能

### 实时进度显示
- WebSocket实时更新生成进度
- 可视化进度条
- 任务状态跟踪

### 智能错误处理
- 网络错误自动重试
- 详细的错误信息提示
- 用户友好的错误界面

### 响应式设计
- 完美适配桌面和移动设备
- 现代化UI设计
- 流畅的动画效果

## 🔒 安全考虑

- API密钥安全存储
- 输入参数验证
- 错误信息过滤
- CORS跨域保护

## 📝 开发说明

### 添加新功能
1. 在 `services/soraService.js` 中添加新的API方法
2. 在 `server.js` 中添加对应的路由
3. 在前端 `app.js` 中添加相应的处理逻辑

### 自定义样式
- 修改 `public/styles.css` 文件
- 支持CSS变量自定义主题
- 响应式断点可调整

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 常见问题

### Q: 生成视频需要多长时间？
A: 通常需要30秒到2分钟，具体时间取决于视频复杂度和服务器负载。

### Q: 支持哪些视频格式？
A: 目前支持MP4格式，视频有效期为2小时。

### Q: 如何提高生成质量？
A: 提供详细的提示词描述，选择合适的视频比例和质量设置。

### Q: 生成的视频可以商用吗？
A: 请遵守Sora2 API的使用条款和相关法律法规。

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 在线讨论

---

**享受AI视频创作的乐趣！** 🎬✨
