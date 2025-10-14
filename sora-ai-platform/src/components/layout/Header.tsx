'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="play" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Sora AI</span>
          </Link>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors">
              生成视频
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">
              模板库
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              定价
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
              帮助
            </Link>
          </div>
          
          {/* 用户操作 */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              登录
            </Button>
            <Button size="sm">
              开始使用
            </Button>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>
        </div>
        
        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors">
                生成视频
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">
                模板库
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                定价
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                帮助
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" size="sm" className="justify-start">
                  登录
                </Button>
                <Button size="sm" className="justify-start">
                  开始使用
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
