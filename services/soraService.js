const axios = require('axios');
const config = require('../config');

class SoraService {
  constructor() {
    this.baseUrl = config.soraApi.baseUrl;
    this.apiKey = config.soraApi.apiKey;
  }

  /**
   * 生成视频
   * @param {Object} params - 生成参数
   * @returns {Promise<Object>} 生成结果
   */
  async generateVideo(params) {
    try {
      const url = `${this.baseUrl}${config.soraApi.endpoints.video}`;
      
      const requestData = {
        model: params.model || 'sora-2',
        prompt: params.prompt,
        url: params.url || '',
        aspectRatio: params.aspectRatio || '9:16',
        duration: params.duration || 10,
        size: params.size || 'small',
        webHook: params.webHook || '-1',
        shutProgress: params.shutProgress || false
      };

      console.log('发送Sora2 API请求:', url);
      console.log('请求参数:', requestData);

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        timeout: 60000 // 60秒超时
      });

      console.log('Sora2 API响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('Sora2 API调用失败:', error);
      
      if (error.response) {
        // API返回了错误响应
        return {
          code: -1,
          msg: `API错误: ${error.response.status} - ${error.response.statusText}`,
          data: null
        };
      } else if (error.request) {
        // 网络错误
        return {
          code: -1,
          msg: '网络连接失败，请检查网络连接',
          data: null
        };
      } else {
        // 其他错误
        return {
          code: -1,
          msg: `请求失败: ${error.message}`,
          data: null
        };
      }
    }
  }

  /**
   * 获取视频生成结果
   * @param {string} id - 任务ID
   * @returns {Promise<Object>} 结果数据
   */
  async getResult(id) {
    try {
      const url = `${this.baseUrl}${config.soraApi.endpoints.result}`;
      
      const requestData = { id };

      console.log('获取结果请求:', url);
      console.log('请求参数:', requestData);

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        timeout: 30000 // 30秒超时
      });

      console.log('获取结果响应:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取结果失败:', error);
      
      if (error.response) {
        return {
          code: -1,
          msg: `获取结果失败: ${error.response.status} - ${error.response.statusText}`,
          data: null
        };
      } else if (error.request) {
        return {
          code: -1,
          msg: '网络连接失败，请检查网络连接',
          data: null
        };
      } else {
        return {
          code: -1,
          msg: `获取结果失败: ${error.message}`,
          data: null
        };
      }
    }
  }

  /**
   * 验证参数
   * @param {Object} params - 参数对象
   * @returns {Object} 验证结果
   */
  validateParams(params) {
    const errors = [];

    if (!params.prompt || params.prompt.trim() === '') {
      errors.push('提示词不能为空');
    }

    if (params.aspectRatio && !config.videoOptions.aspectRatios.includes(params.aspectRatio)) {
      errors.push(`不支持的视频比例: ${params.aspectRatio}`);
    }

    if (params.duration && !config.videoOptions.durations.includes(params.duration)) {
      errors.push(`不支持的视频时长: ${params.duration}`);
    }

    if (params.size && !config.videoOptions.sizes.includes(params.size)) {
      errors.push(`不支持的视频尺寸: ${params.size}`);
    }

    if (params.url && !this.isValidUrl(params.url)) {
      errors.push('参考图片URL格式不正确');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证URL格式
   * @param {string} url - URL字符串
   * @returns {boolean} 是否有效
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = SoraService;
