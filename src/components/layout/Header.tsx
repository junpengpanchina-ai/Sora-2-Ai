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
import { signOut, useSession } from 'next-auth/react';
import AuthButton from '@/components/auth/AuthButton';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: simpleAuthUser, loading: simpleAuthLoading } = useSimpleAuth();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const t = useTranslations();
  
  // 合并两种登录方式的状态
  const user = nextAuthSession?.user || simpleAuthUser;
  const loading = simpleAuthLoading || nextAuthStatus === 'loading';
  const pathname = usePathname();
  
  // 从路径中提取当前语言
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleSignOut = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    try {
      console.log('🔐 Header开始登出...');
      
      // 显示加载状态
      const button = e?.currentTarget as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = '退出中...';
      }
      
      // 1. 先手动清除所有 NextAuth cookies（在调用 signOut 之前）
      if (typeof document !== 'undefined') {
        // 清除所有 NextAuth 相关的 cookies
        const cookieNames = [
          'next-auth.session-token',
          'next-auth.csrf-token',
          'next-auth.callback-url',
          'next-auth.pkce.code_verifier',
          'next-auth.state',
          '__Secure-next-auth.session-token',
          '__Host-next-auth.csrf-token',
        ];
        
        cookieNames.forEach(name => {
          // 清除当前路径
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          // 清除根路径
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`;
        });
        console.log('✅ 已手动清除 NextAuth cookies');
      }
      
      // 2. 调用强制退出 API（清除服务器端 session）
      try {
        console.log('🔄 调用强制退出 API...');
        const forceLogoutRes = await fetch('/api/auth/force-logout', {
          method: 'POST',
          credentials: 'include'
        });
        const forceLogoutData = await forceLogoutRes.json();
        console.log('✅ 强制退出 API 结果:', forceLogoutData);
      } catch (forceLogoutError) {
        console.log('⚠️ 强制退出 API 失败:', forceLogoutError);
      }
      
      // 3. 调用 NextAuth signOut（用于 Google OAuth）
      try {
        console.log('🔄 调用 NextAuth signOut...');
        await signOut({ 
          redirect: false,
          callbackUrl: '/'
        });
        console.log('✅ NextAuth 登出成功');
      } catch (nextAuthError) {
        console.log('⚠️ NextAuth 登出失败:', nextAuthError);
      }
      
      // 4. 清除 simple-auth session（如果有）
      try {
        await fetch('/api/simple-auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
        console.log('✅ Simple Auth 登出成功');
      } catch (simpleAuthError) {
        console.log('⚠️ Simple Auth 登出失败:', simpleAuthError);
      }
      
      // 5. 设置退出标志（必须在清除存储之前设置）
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('just_logged_out', 'true');
          console.log('✅ 已设置退出标志');
        } catch (e) {
          console.log('⚠️ 设置退出标志失败:', e);
        }
      }
      
      // 6. 强制清除所有可能的本地存储和 cookies
      if (typeof window !== 'undefined') {
        try {
          // 清除 localStorage（但保留退出标志）
          localStorage.clear();
          
          // 清除所有 cookies（确保清除）
          if (typeof document !== 'undefined') {
            document.cookie.split(";").forEach((c) => {
              const eqPos = c.indexOf("=");
              const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
              if (name) {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
              }
            });
            console.log('✅ 已清除所有 cookies');
          }
          
          // 注意：不清除 sessionStorage，因为我们需要保留 just_logged_out 标志
          console.log('✅ 已清除 localStorage 和 cookies（保留退出标志）');
        } catch (storageError) {
          console.log('⚠️ 清除存储失败:', storageError);
        }
        
        // 7. 等待一下确保所有清除操作完成
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 8. 强制刷新页面并清除缓存（使用完整重载）
        console.log('🔄 准备刷新页面...');
        // 使用 replace 而不是 href，避免浏览器历史记录
        window.location.replace('/');
      }
    } catch (error) {
      console.error('❌ Header退出登录失败:', error);
      // 即使出错也强制刷新页面
      if (typeof window !== 'undefined') {
        window.location.replace('/');
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
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
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
            
            {/* 调试信息 - 临时显示 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {loading ? '加载中...' : user ? `已登录: ${user.email}` : '未登录'}
                <br />
                NextAuth: {nextAuthStatus} | SimpleAuth: {simpleAuthUser ? '有' : '无'}
              </div>
            )}
            
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.name || user.email}
                </span>
                <Link href="/dashboard">
                  <Button variant="outline">{t.nav('dashboard')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    console.log('🔴 退出按钮被点击！', e);
                    handleSignOut(e);
                  }}
                  className="bg-red-50 text-red-600 border-red-300 hover:bg-red-100 cursor-pointer"
                  type="button"
                >
                  {t.common('logout') || '退出'}
                </Button>
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