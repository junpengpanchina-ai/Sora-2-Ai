'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  仪表板
                </Link>
                <Link href="/payments" className="text-gray-700 hover:text-gray-900">
                  支付记录
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                首页
              </Link>
              <Link href="/generate" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                生成视频
              </Link>
              {session && (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    仪表板
                  </Link>
                  <Link href="/payments" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    支付记录
                  </Link>
                </>
              )}
              <div className="px-3 py-2">
                {session ? (
                  <>
                    <div className="text-sm text-gray-700 mb-2">
                      {session.user?.name || session.user?.email}
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="w-full">
                      退出登录
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="outline" className="w-full mb-2">登录</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full">注册</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;