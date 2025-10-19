import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        
        {/* MVP功能预览 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🚀 全新增长功能
              </h2>
              <p className="text-xl text-gray-600">
                基于经典增长理论的AI视频创作生态
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">用户等级系统</h3>
                <p className="text-gray-600 mb-4">
                  铜牌到钻石，解锁专属特权和奖励
                </p>
                <Link href="/achievements">
                  <Button variant="outline">查看等级</Button>
                </Link>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">邀请奖励机制</h3>
                <p className="text-gray-600 mb-4">
                  邀请好友获得免费视频，病毒式增长
                </p>
                <Link href="/referral">
                  <Button variant="outline">邀请好友</Button>
                </Link>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">社交分享功能</h3>
                <p className="text-gray-600 mb-4">
                  一键分享到各大平台，扩大影响力
                </p>
                <Link href="/generate">
                  <Button variant="outline">开始创作</Button>
                </Link>
              </Card>
            </div>
            
            <div className="text-center">
              <Link href="/mvp">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Icon name="rocket" className="h-5 w-5 mr-2" />
                  体验完整功能
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}