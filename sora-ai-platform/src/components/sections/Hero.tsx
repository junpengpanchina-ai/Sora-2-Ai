import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            用AI创造
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              无限可能
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            只需一句话，让AI为您生成专业级视频内容。从创意到成品，只需几分钟。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="transform hover:scale-105 transition-transform">
                开始创作
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Icon name="play" className="w-5 h-5 mr-2" />
              观看演示
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
