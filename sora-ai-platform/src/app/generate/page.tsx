'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { VideoResult } from '@/lib/sora-api';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [duration, setDuration] = useState<10 | 15>(10);
  const [size, setSize] = useState<'small' | 'large'>('small');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入视频描述');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      // 调用后端API生成视频
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
          size
        })
      });

      const data = await response.json();

      if (data.success && data.data?.id) {
        // 开始轮询结果
        const finalResult = await pollVideoResult(data.data.id);
        setResult(finalResult);
      } else {
        setError(data.error || '生成失败');
      }
    } catch (err) {
      setError(`生成失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoResult = async (id: string): Promise<VideoResult> => {
    const maxAttempts = 60; // 最多轮询60次
    let attempts = 0;

    return new Promise((resolve) => {
      const poll = async () => {
        try {
          const response = await fetch('/api/video-result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
          });

          const data = await response.json();
          
          if (data.success) {
            const result = data.data;
            setProgress(result.progress);

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
          } else {
            resolve({
              id,
              progress: 0,
              status: 'failed',
              error: data.error || '获取结果失败'
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            生成AI视频
          </h1>
          <p className="text-lg text-gray-600">
            描述您想要的视频内容，AI将为您生成专业视频
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主编辑区 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频描述
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="详细描述您想要生成的视频内容..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      视频时长
                    </label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value) as 10 | 15)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="10">10秒</option>
                      <option value="15">15秒</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      视频比例
                    </label>
                    <select 
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="9:16">9:16 (竖屏)</option>
                      <option value="16:9">16:9 (横屏)</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  loading={isGenerating}
                  size="lg"
                  className="w-full"
                >
                  {isGenerating ? '生成中...' : '生成视频'}
                </Button>
              </div>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">高级设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频质量
                  </label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value as 'small' | 'large')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">标准质量</option>
                    <option value="large">高清质量</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    风格预设
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="realistic">写实风格</option>
                    <option value="animated">动画风格</option>
                    <option value="artistic">艺术风格</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* 进度显示 */}
            {isGenerating && (
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="play" className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">正在生成视频</h3>
                  <p className="text-gray-600 mb-4">请稍候，AI正在为您创作...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">{progress}% 完成</p>
                </div>
              </Card>
            )}

            {/* 错误显示 */}
            {error && (
              <Card className="p-6 mt-6 border-red-200 bg-red-50">
                <div className="text-center">
                  <Icon name="close" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">生成失败</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setError(null)}
                    className="w-full"
                  >
                    重试
                  </Button>
                </div>
              </Card>
            )}

            {/* 结果展示 */}
            {result && result.status === 'succeeded' && result.results && result.results.length > 0 && (
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <Icon name="check" className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">生成完成</h3>
                  <p className="text-gray-600 mb-4">您的AI视频已准备就绪</p>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      <Icon name="download" className="w-4 h-4 mr-2" />
                      下载视频
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Icon name="share" className="w-4 h-4 mr-2" />
                      分享视频
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* 失败结果 */}
            {result && result.status === 'failed' && (
              <Card className="p-6 mt-6 border-red-200 bg-red-50">
                <div className="text-center">
                  <Icon name="close" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">生成失败</h3>
                  <p className="text-red-600 mb-4">{result.error || '未知错误'}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setResult(null)}
                    className="w-full"
                  >
                    重新生成
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
