'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import MobileMenu from './MobileMenu';
import { useTranslations } from '@/hooks/useTranslations';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const t = useTranslations();
  const pathname = usePathname();
  
  // 从路径中提取当前语言
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleSignOut = async () => {
    try {
      console.log('🔐 开始登出...');
      await signOut({ callbackUrl: '/' });
      console.log('✅ 登出成功');
    } catch (error) {
      console.error('❌ 退出登录失败:', error);
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
            {session && (
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
            {session ? (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline">{t.nav('dashboard')}</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  {t.common('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">{t.common('login')}</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>{t.common('register')}</Button>
                </Link>
              </>
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