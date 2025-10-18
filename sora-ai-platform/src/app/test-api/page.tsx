'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('一只可爱的小猫在草地上玩耍');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [duration, setDuration] = useState<10 | 15>(10);
  const [size, setSize] = useState<'small' | 'large'>('small');

  const testAPI = async () => {
    setLoading(true);
    setResult('正在测试API连接...');
    
    try {
      // 第一步：测试视频生成
      setResult('步骤1: 正在调用视频生成API...\n');
      const generateResponse = await fetch('/api/generate-video', {
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
      
      const generateData = await generateResponse.json();
      setResult(prev => prev + `生成请求响应:\n${JSON.stringify(generateData, null, 2)}\n\n`);
      
      if (generateData.success && generateData.data?.id) {
        setResult(prev => prev + `步骤2: 开始轮询结果 (ID: ${generateData.data.id})...\n`);
        
        // 第二步：轮询结果
        const finalResult = await pollVideoResult(generateData.data.id);
        setResult(prev => prev + `\n最终结果:\n${JSON.stringify(finalResult, null, 2)}`);
      } else {
        setResult(prev => prev + `生成失败: ${generateData.error}`);
      }
    } catch (error) {
      setResult(prev => prev + `\n错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const pollVideoResult = async (id: string) => {
    const maxAttempts = 10; // 测试时减少轮询次数
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
            setResult(prev => prev + `进度更新: ${result.progress}% - ${result.status}\n`);

            if (result.status === 'succeeded' || result.status === 'failed') {
              resolve(result);
              return;
            }

            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 3000); // 每3秒轮询一次
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

  const testConnection = async () => {
    setLoading(true);
    setResult('正在测试API连接...');
    
    try {
      const response = await fetch('https://grsai.dakka.com.cn/v1/video/sora-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sora-2',
          prompt: 'test',
          aspectRatio: '9:16',
          duration: 10,
          size: 'small',
          webHook: '-1',
          shutProgress: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`连接成功！\n响应: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`连接失败！状态码: ${response.status}`);
      }
    } catch (error) {
      setResult(`连接错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sora2 API 测试中心</h1>
          <p className="text-lg text-gray-600">
            测试Sora2 API连接和视频生成功能
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 参数配置 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">测试参数</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提示词
                </label>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="输入视频描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频比例
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="9:16">9:16 (竖屏)</option>
                  <option value="16:9">16:9 (横屏)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频时长
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) as 10 | 15)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10秒</option>
                  <option value={15}>15秒</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频质量
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as 'small' | 'large')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">标准质量</option>
                  <option value="large">高清质量</option>
                </select>
              </div>
            </div>
          </Card>

          {/* 测试控制 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">测试控制</h2>
            
            <div className="space-y-4">
              <Button 
                onClick={testConnection}
                loading={loading}
                variant="outline"
                className="w-full"
              >
                测试API连接
              </Button>
              
              <Button 
                onClick={testAPI}
                loading={loading}
                className="w-full"
              >
                完整视频生成测试
              </Button>
              
              <Button 
                onClick={() => setResult('')}
                variant="ghost"
                className="w-full"
              >
                清空结果
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">测试说明</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>连接测试</strong>：仅测试API是否可达</li>
                <li>• <strong>完整测试</strong>：包含生成和轮询完整流程</li>
                <li>• <strong>轮询机制</strong>：每2秒检查一次生成状态</li>
                <li>• <strong>超时设置</strong>：最多轮询2分钟</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* 结果显示 */}
        {result && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">测试结果</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto whitespace-pre-wrap">{result}</pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
