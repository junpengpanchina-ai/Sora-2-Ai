'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // 模拟API调用
    setTimeout(() => {
      setResult('视频生成完成！');
      setIsGenerating(false);
    }, 3000);
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
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="10">10秒</option>
                      <option value="15">15秒</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      视频比例
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="16:9">16:9 (横屏)</option>
                      <option value="9:16">9:16 (竖屏)</option>
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
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="standard">标准质量</option>
                    <option value="hd">高清质量</option>
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

            {result && (
              <Card className="p-6 mt-6">
                <div className="text-center">
                  <Icon name="check" className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">生成完成</h3>
                  <p className="text-gray-600 mb-4">{result}</p>
                  <Button size="sm" className="w-full">
                    <Icon name="download" className="w-4 h-4 mr-2" />
                    下载视频
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
