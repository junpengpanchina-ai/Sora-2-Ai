// 配置文件
module.exports = {
  // Sora2 API配置
  soraApi: {
    baseUrl: process.env.SORA_API_BASE_URL || 'https://grsai.dakka.com.cn',
    apiKey: process.env.SORA_API_KEY || 'sk-bd625bca604243989a7018a67614c889',
    endpoints: {
      video: '/v1/video/sora-video',
      result: '/v1/draw/result'
    }
  },
  
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    wsPort: process.env.WS_PORT || 3001
  },
  
  // 支持的视频参数
  videoOptions: {
    aspectRatios: ['9:16', '16:9'],
    durations: [10, 15],
    sizes: ['small', 'large']
  }
};
