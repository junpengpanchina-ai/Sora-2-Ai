const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');
const SoraService = require('./services/soraService');
const config = require('./config');

const app = express();
const PORT = config.server.port;
const WS_PORT = config.server.wsPort;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 初始化Sora服务
const soraService = new SoraService();

// API路由
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, url, aspectRatio, duration, size, webHook, shutProgress } = req.body;
    
    // 验证必填参数
    if (!prompt) {
      return res.status(400).json({ 
        code: -1, 
        msg: '提示词不能为空',
        data: null 
      });
    }

    // 调用Sora2 API
    const result = await soraService.generateVideo({
      model: 'sora-2',
      prompt,
      url,
      aspectRatio: aspectRatio || '9:16',
      duration: duration || 10,
      size: size || 'small',
      webHook: webHook || '-1', // 使用轮询方式
      shutProgress: shutProgress || false
    });

    res.json(result);
  } catch (error) {
    console.error('生成视频失败:', error);
    res.status(500).json({ 
      code: -1, 
      msg: '生成视频失败: ' + error.message,
      data: null 
    });
  }
});

// 获取视频结果
app.post('/api/get-result', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        code: -1, 
        msg: '任务ID不能为空',
        data: null 
      });
    }

    const result = await soraService.getResult(id);
    res.json(result);
  } catch (error) {
    console.error('获取结果失败:', error);
    res.status(500).json({ 
      code: -1, 
      msg: '获取结果失败: ' + error.message,
      data: null 
    });
  }
});

// 获取支持的选项
app.get('/api/options', (req, res) => {
  res.json({
    code: 0,
    msg: 'success',
    data: config.videoOptions
  });
});

// 启动HTTP服务器
app.listen(PORT, () => {
  console.log(`🚀 HTTP服务器运行在端口 ${PORT}`);
});

// 启动WebSocket服务器
const wss = new WebSocket.Server({ port: WS_PORT });
console.log(`🔌 WebSocket服务器运行在端口 ${WS_PORT}`);

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('新的WebSocket连接');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'generate') {
        // 生成视频
        const result = await soraService.generateVideo(data.params);
        ws.send(JSON.stringify({ type: 'result', data: result }));
        
        // 如果使用轮询方式，开始轮询结果
        if (result.code === 0 && result.data && result.data.id) {
          pollResult(ws, result.data.id);
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error.message 
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket连接关闭');
  });
});

// 轮询结果函数
async function pollResult(ws, id) {
  const maxAttempts = 60; // 最多轮询60次
  let attempts = 0;
  
  const poll = async () => {
    try {
      const result = await soraService.getResult(id);
      
      // 发送进度更新
      ws.send(JSON.stringify({ 
        type: 'progress', 
        data: result.data 
      }));
      
      // 如果任务完成或失败，停止轮询
      if (result.data && (result.data.status === 'succeeded' || result.data.status === 'failed')) {
        ws.send(JSON.stringify({ 
          type: 'final', 
          data: result.data 
        }));
        return;
      }
      
      // 继续轮询
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000); // 每2秒轮询一次
      } else {
        ws.send(JSON.stringify({ 
          type: 'timeout', 
          message: '轮询超时' 
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error.message 
      }));
    }
  };
  
  // 开始轮询
  setTimeout(poll, 1000); // 1秒后开始第一次轮询
}
