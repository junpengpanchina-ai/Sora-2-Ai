# 🎬 Sora2 API 集成说明

## 📋 API 参数配置

根据官方API文档，当前支持的参数如下：

### ✅ 支持的参数

| 参数 | 类型 | 必填 | 可选值 | 默认值 | 说明 |
|------|------|------|--------|--------|------|
| `model` | string | ✅ | `"sora-2"` | `"sora-2"` | 模型名称 |
| `prompt` | string | ✅ | - | - | 视频描述提示词 |
| `url` | string | ❌ | 有效URL | `""` | 参考图片URL |
| `aspectRatio` | string | ❌ | `"9:16"`, `"16:9"` | `"9:16"` | 视频比例 |
| `duration` | number | ❌ | `10`, `15` | `10` | 视频时长（秒） |
| `size` | string | ❌ | `"small"`, `"large"` | `"small"` | 视频清晰度 |
| `webHook` | string | ❌ | URL或`"-1"` | `"-1"` | 回调地址（-1表示轮询模式） |
| `shutProgress` | boolean | ❌ | `true`, `false` | `false` | 是否关闭进度回复 |

## 🔧 代码实现

### 1. API 服务类 (`src/lib/sora-api.ts`)

```typescript
export class SoraAPI {
  private baseUrl = 'https://grsai.dakka.com.cn';
  private apiKey = process.env.NEXT_PUBLIC_SORA_API_KEY || '';
  
  // 生成视频
  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResponse>
  
  // 获取结果
  async getResult(id: string): Promise<VideoResult>
  
  // 轮询结果
  async pollResult(id: string, onProgress?: (result: VideoResult) => void): Promise<VideoResult>
}
```

### 2. API 路由

#### 生成视频 (`/api/generate-video`)
- **方法**: POST
- **功能**: 创建视频生成任务
- **返回**: 任务ID用于后续轮询

#### 获取结果 (`/api/video-result`)
- **方法**: POST
- **功能**: 查询视频生成结果
- **参数**: `{ id: string }`

### 3. 前端集成

生成页面 (`src/app/generate/page.tsx`) 通过以下流程工作：

1. 用户输入提示词和参数
2. 调用 `/api/generate-video` 创建任务
3. 使用返回的任务ID轮询 `/api/video-result`
4. 显示进度和最终结果

## 🔑 环境变量配置

在 `.env.local` 文件中添加：

```env
# Sora API 配置
NEXT_PUBLIC_SORA_API_KEY="your-sora-api-key-here"
```

## 📡 API 请求格式

### 生成视频请求

```http
POST https://grsai.dakka.com.cn/v1/video/sora-video
Content-Type: application/json
Authorization: Bearer your-api-key

{
  "model": "sora-2",
  "prompt": "一只可爱的小猫在花园里玩耍",
  "url": "",
  "aspectRatio": "9:16",
  "duration": 10,
  "size": "small",
  "webHook": "-1",
  "shutProgress": false
}
```

### 获取结果请求

```http
POST https://grsai.dakka.com.cn/v1/draw/result
Content-Type: application/json
Authorization: Bearer your-api-key

{
  "id": "task-id-here"
}
```

## 📊 响应格式

### 生成视频响应

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "f44bcf50-f2d0-4c26-a467-26f2014a771b"
  }
}
```

### 结果查询响应

#### 成功响应
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "f44bcf50-f2d0-4c26-a467-26f2014a771b",
    "results": [
      {
        "url": "https://example.com/example.mp4"
      }
    ],
    "progress": 100,
    "status": "succeeded",
    "failure_reason": "",
    "error": ""
  }
}
```

#### 错误响应
```json
{
  "code": -22,
  "msg": "任务不存在",
  "data": null
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| `0` | 成功 |
| `-22` | 任务不存在 |

## ⚠️ 重要说明

1. **API密钥**: 需要从Sora2服务提供商获取有效的API密钥
2. **视频URL有效期**: 生成的视频URL有效期为2小时
3. **轮询机制**: 使用webHook="-1"启用轮询模式，每2秒查询一次结果
4. **错误处理**: 包含完整的错误处理和用户友好的错误信息
5. **参数验证**: 前端和后端都包含严格的参数验证
6. **错误码处理**: 正确处理API返回的错误码（如-22任务不存在）
7. **响应格式**: 严格按照官方API文档的响应格式处理数据

## 🚀 使用流程

1. 配置环境变量（API密钥）
2. 启动开发服务器：`npm run dev`
3. 访问生成页面：`http://localhost:3000/generate`
4. 输入提示词，选择参数
5. 点击生成按钮开始创建视频
6. 等待轮询完成，查看结果

## 🔍 调试信息

代码中包含详细的控制台日志，便于调试：
- API请求参数
- API响应数据
- 错误信息
- 轮询状态

查看浏览器开发者工具的Console标签页获取详细信息。
