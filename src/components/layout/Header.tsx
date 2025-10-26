'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import MobileMenu from './MobileMenu';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { useTranslations } from '@/hooks/useTranslations';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import AuthButton from '@/components/auth/AuthButton';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useSimpleAuth();
  const t = useTranslations();
  const pathname = usePathname();
  
  // 从路径中提取当前语言
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleSignOut = async () => {
    try {
      console.log('🔐 Header开始登出...');
      // 手动刷新页面或跳转到首页
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ Header退出登录失败:', error);
      // 即使出错也尝试跳转到首页
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
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
              {t.nav('home')}
            </Link>
            <Link href="/generate" className="text-gray-700 hover:text-gray-900">
              {t.nav('generate')}
            </Link>
            {user && (
              <>
                <Link href="/mvp" className="text-gray-700 hover:text-gray-900 font-medium">
                  {t.nav('mvp')}
                </Link>
                <Link href="/achievements" className="text-gray-700 hover:text-gray-900">
                  {t.nav('achievements')}
                </Link>
                <Link href="/referral" className="text-gray-700 hover:text-gray-900">
                  {t.nav('referral')}
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  {t.nav('dashboard')}
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* 主题选择器 */}
            <ThemeSelector />
            
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.name || user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline">{t.nav('dashboard')}</Button>
                </Link>
                <AuthButton 
                  variant="outline"
                  onLogout={handleSignOut}
                />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <AuthButton variant="outline" />
                <Link href="/auth/signup">
                  <Button>{t.common('register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t.common('open')}
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