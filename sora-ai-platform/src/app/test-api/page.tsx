'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SoraAPI } from '@/lib/sora-api';

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('正在测试API连接...');
    
    try {
      const soraAPI = new SoraAPI();
      const response = await soraAPI.generateVideo({
        prompt: '一只可爱的小猫在草地上玩耍',
        aspectRatio: '9:16',
        duration: 10,
        size: 'small'
      });
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sora2 API 测试</h1>
          <p className="text-gray-600 mb-6">
            点击按钮测试Sora2 API连接和视频生成功能
          </p>
          
          <Button 
            onClick={testAPI}
            loading={loading}
            className="mb-6"
          >
            {loading ? '测试中...' : '测试API'}
          </Button>
          
          {result && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">API响应:</h3>
              <pre className="text-sm overflow-auto">{result}</pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
