'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { VideoResult } from '@/lib/sora-api';
import { useTranslations } from '@/hooks/useTranslations';
import { downloadVideo, getVideoFilename } from '@/lib/download';
import ShareButton from '@/components/social/ShareButton';

export default function GeneratePage() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('16:9');
  const [duration, setDuration] = useState<5 | 10 | 15>(15);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [style, setStyle] = useState<'realistic' | 'animated' | 'artistic' | 'cinematic'>('realistic');
  const [motion, setMotion] = useState<'static' | 'slow' | 'medium' | 'fast'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 处理视频下载
  const handleDownload = async () => {
    if (!result?.results?.[0]?.url) return;
    
    setIsDownloading(true);
    try {
      const videoUrl = result.results[0].url;
      const filename = getVideoFilename(videoUrl, prompt);
      
      await downloadVideo(videoUrl, {
        filename,
        onComplete: () => {
          console.log('视频下载完成');
          setIsDownloading(false);
        },
        onError: (error) => {
          console.error('下载失败:', error);
          setIsDownloading(false);
        }
      });
    } catch (error) {
      console.error('下载视频失败:', error);
      setIsDownloading(false);
    }
  };

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 如果正在检查登录状态，显示加载
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    );
  }

  // 如果未登录，显示登录提示
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <Icon name="lock" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">需要登录</h2>
          <p className="text-gray-600 mb-4">请先登录以使用视频生成功能</p>
          <Button onClick={() => router.push('/auth/signin')} className="w-full">
            去登录
          </Button>
        </Card>
      </div>
    );
  }

  const promptSuggestions = [
    "一只可爱的小猫在花园里玩耍",
    "未来城市的夜景，霓虹灯闪烁",
    "海浪拍打着岩石，夕阳西下",
    "雪花飘落在森林中，宁静祥和",
    "宇航员在太空中漂浮，地球在背景中",
    "古老的城堡在月光下显得神秘",
    "热带雨林中的瀑布，鸟儿在歌唱",
    "城市街道上的雨夜，灯光反射在湿漉漉的地面上"
  ];

  // 计算预估生成时间
  const calculateEstimatedTime = (duration: number, size: string): string => {
    let baseMinutes = 0;
    
    // 根据视频长度计算基础时间
    if (duration <= 5) baseMinutes = 2;
    else if (duration <= 10) baseMinutes = 4;
    else if (duration <= 15) baseMinutes = 6;
    else baseMinutes = 10;
    
    // 根据质量调整时间
    if (size === 'small') baseMinutes = Math.ceil(baseMinutes * 0.8);
    else if (size === 'large') baseMinutes = Math.ceil(baseMinutes * 1.5);
    
    if (baseMinutes <= 2) return "1-2 分钟";
    else if (baseMinutes <= 5) return "3-5 分钟";
    else if (baseMinutes <= 10) return "5-10 分钟";
    else return "10-15 分钟";
  };


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(t.generate('promptRequired'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setProgress(0);
    
    // 计算预估时间
    const estimatedMinutes = calculateEstimatedTime(duration, size);
    setEstimatedTime(estimatedMinutes);

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
          size,
          style,
          motion
        })
      });

      const data = await response.json();

      if (data.video?.id) {
        setGenerationId(data.video.id);
        // 开始轮询结果
        const finalResult = await pollVideoResult(data.video.id);
        setResult(finalResult);
      } else {
        setError(data.message || t.generate('generateFailed'));
      }
    } catch (err) {
      setError(`${t.generate('generateFailed')}: ${err instanceof Error ? err.message : t.common('error')}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoResult = async (id: string): Promise<VideoResult> => {
    const maxAttempts = 150; // 最多轮询150次 (5分钟)
    let attempts = 0;

    return new Promise((resolve) => {
      const poll = async () => {
        try {
          const response = await fetch(`/api/generate-video?id=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await response.json();
          
          if (data.video) {
            const result = data.video;
            setProgress(result.progress || 0);

            if (result.status === 'completed' || result.status === 'failed') {
              resolve({
                id: result.id,
                progress: result.progress || 100,
                status: result.status === 'completed' ? 'succeeded' : 'failed',
                results: result.url ? [{ url: result.url }] : [],
                error: result.status === 'failed' ? '生成失败' : undefined
              });
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
                error: t.generate('pollTimeout')
              });
            }
          } else {
            resolve({
              id,
              progress: 0,
              status: 'failed',
              error: data.message || t.generate('fetchResultFailed')
            });
          }
        } catch (error) {
          resolve({
            id,
            progress: 0,
            status: 'failed',
            error: `${t.generate('pollFailed')}: ${error instanceof Error ? error.message : t.common('error')}`
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
            {t.generate('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t.generate('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主编辑区 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.generate('promptLabel')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showSuggestions ? '隐藏建议' : '查看建议'}
                    </button>
                  </div>
                  
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder={t.generate('promptPlaceholder')}
                  />
                  
                  {/* 提示词建议 */}
                  {showSuggestions && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">提示词建议：</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {promptSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setPrompt(suggestion);
                              setShowSuggestions(false);
                            }}
                            className="text-left p-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded border border-transparent hover:border-gray-300 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.generate('durationLabel')}
                    </label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value) as 5 | 10 | 15)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="5">5s</option>
                      <option value="10">10s</option>
                      <option value="15">15s</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.generate('aspectRatioLabel')}
                    </label>
                    <select 
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9' | '1:1')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="9:16">9:16 (竖屏)</option>
                      <option value="16:9">16:9 (横屏)</option>
                      <option value="1:1">1:1 (方形)</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  loading={isGenerating}
                  size="lg"
                  className="w-full"
                >
                  {isGenerating ? t.generate('btnGenerating') : t.generate('btnGenerate')}
                </Button>
                
                {/* 生成时间提示 */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Icon name="info" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">⏱️ 生成时间说明</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 5秒视频：约 1-2 分钟</li>
                        <li>• 10秒视频：约 2-3 分钟</li>
                        <li>• 15秒视频：约 3-5 分钟</li>
                        <li>• 4K质量：时间会增加 50%</li>
                        <li>• 复杂场景：可能需要更长时间</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.generate('advancedSettings')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.generate('videoQuality')}
                  </label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">标准 (720p)</option>
                    <option value="medium">高清 (1080p)</option>
                    <option value="large">超清 (4K)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.generate('stylePreset')}
                  </label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value as 'realistic' | 'animated' | 'artistic' | 'cinematic')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="realistic">写实风格</option>
                    <option value="animated">动画风格</option>
                    <option value="artistic">艺术风格</option>
                    <option value="cinematic">电影风格</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    运动强度
                  </label>
                  <select 
                    value={motion}
                    onChange={(e) => setMotion(e.target.value as 'static' | 'slow' | 'medium' | 'fast')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="static">静态</option>
                    <option value="slow">缓慢</option>
                    <option value="medium">中等</option>
                    <option value="fast">快速</option>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.generate('generatingTitle')}</h3>
                  <p className="text-gray-600 mb-2">{t.generate('generatingTip')}</p>
                  {estimatedTime && (
                    <p className="text-sm text-blue-600 mb-4">
                      ⏱️ 预估时间：{estimatedTime}
                    </p>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{progress}% {t.generate('progressLabel')}</span>
                    <span className="text-xs">
                      {progress < 20 && "正在初始化..."}
                      {progress >= 20 && progress < 50 && "正在分析提示词..."}
                      {progress >= 50 && progress < 80 && "正在生成视频..."}
                      {progress >= 80 && progress < 100 && "正在渲染最终结果..."}
                      {progress === 100 && "生成完成！"}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* 错误显示 */}
            {error && (
              <Card className="p-6 mt-6 border-red-200 bg-red-50">
                <div className="text-center">
                  <Icon name="close" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">{t.generate('errorTitle')}</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setError(null)}
                    className="w-full"
                  >
                    {t.common('retry')}
                  </Button>
                </div>
              </Card>
            )}

            {/* 结果展示 */}
            {result && result.status === 'succeeded' && result.results && result.results.length > 0 && (
              <Card className="p-6 mt-6">
                <div className="text-center mb-4">
                  <Icon name="check" className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.generate('successTitle')}</h3>
                  <p className="text-gray-600 mb-4">{t.generate('successTip')}</p>
                </div>
                
                {/* 视频播放器 */}
                <div className="mb-4">
                  <VideoPlayer 
                    url={result.results[0].url} 
                    title={prompt.substring(0, 50)}
                    className="w-full h-64"
                  />
                </div>
                
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Icon name={isDownloading ? "loader" : "download"} className="w-4 h-4 mr-2" />
                    {isDownloading ? '下载中...' : t.generate('downloadVideo')}
                  </Button>
                  <ShareButton
                    videoId={result.id || 'unknown'}
                    videoTitle={prompt.substring(0, 50)}
                    videoUrl={result.results[0].url}
                    onShare={(platform) => {
                      console.log(`分享到 ${platform}`);
                    }}
                  />
                </div>
              </Card>
            )}

            {/* 失败结果 */}
            {result && result.status === 'failed' && (
              <Card className="p-6 mt-6 border-red-200 bg-red-50">
                <div className="text-center">
                  <Icon name="close" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">{t.generate('failedTitle')}</h3>
                  <p className="text-red-600 mb-4">{result.error || '未知错误'}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setResult(null)}
                    className="w-full"
                  >
                    {t.generate('regenerate')}
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
