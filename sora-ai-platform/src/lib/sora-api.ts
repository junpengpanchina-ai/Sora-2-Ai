// Sora2 API 服务
export interface VideoGenerationParams {
  prompt: string;
  url?: string;
  aspectRatio?: '9:16' | '16:9';
  duration?: 10 | 15;
  size?: 'small' | 'large';
}

export interface VideoGenerationResponse {
  code: number;
  msg: string;
  data?: {
    id: string;
  };
}

export interface VideoResult {
  id: string;
  results?: Array<{
    url: string;
  }>;
  progress: number;
  status: 'running' | 'succeeded' | 'failed';
  failure_reason?: string;
  error?: string;
}

export interface VideoResultResponse {
  code: number;
  msg: string;
  data?: VideoResult;
}

export class SoraAPI {
  private baseUrl = 'https://grsai.dakka.com.cn';
  private apiKey = process.env.NEXT_PUBLIC_SORA_API_KEY || '';
  
  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/video/sora-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
        },
        body: JSON.stringify({
          model: 'sora-2',
          prompt: params.prompt,
          url: params.url || '',
          aspectRatio: params.aspectRatio || '9:16',
          duration: params.duration || 10,
          size: params.size || 'small',
          webHook: '-1', // 使用轮询方式
          shutProgress: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sora2 API调用失败:', error);
      return {
        code: -1,
        msg: `API调用失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  async getResult(id: string): Promise<VideoResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/draw/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VideoResultResponse = await response.json();
      
      // 处理API响应
      if (result.code === 0 && result.data) {
        return result.data;
      } else if (result.code === -22) {
        return {
          id,
          progress: 0,
          status: 'failed',
          error: '任务不存在',
        };
      } else {
        return {
          id,
          progress: 0,
          status: 'failed',
          error: result.msg || '获取结果失败',
        };
      }
    } catch (error) {
      console.error('获取结果失败:', error);
      return {
        id,
        progress: 0,
        status: 'failed',
        error: `获取结果失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  // 轮询获取结果
  async pollResult(id: string, onProgress?: (result: VideoResult) => void): Promise<VideoResult> {
    const maxAttempts = 60; // 最多轮询60次
    let attempts = 0;

    return new Promise((resolve) => {
      const poll = async () => {
        try {
          const result = await this.getResult(id);
          
          if (onProgress) {
            onProgress(result);
          }

          if (result.status === 'succeeded' || result.status === 'failed') {
            resolve(result);
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000); // 每2秒轮询一次
          } else {
            resolve({
              id,
              progress: 0,
              status: 'failed',
              error: '轮询超时'
            });
          }
        } catch (error) {
          resolve({
            id,
            progress: 0,
            status: 'failed',
            error: `轮询失败: ${error instanceof Error ? error.message : '未知错误'}`
          });
        }
      };

      // 开始轮询
      setTimeout(poll, 1000);
    });
  }
}
