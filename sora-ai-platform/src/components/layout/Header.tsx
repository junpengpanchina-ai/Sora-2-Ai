'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Sora AI
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              首页
            </Link>
            <Link href="/generate" className="text-gray-700 hover:text-gray-900">
              生成视频
            </Link>
            {session && (
              <>
                <Link href="/mvp" className="text-gray-700 hover:text-gray-900 font-medium">
                  🚀 MVP
                </Link>
                <Link href="/achievements" className="text-gray-700 hover:text-gray-900">
                  成就
                </Link>
                <Link href="/referral" className="text-gray-700 hover:text-gray-900">
                  邀请
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  仪表板
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline">仪表板</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">登录</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>注册</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="menu" className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>
    </header>
  );
};

export default Header;