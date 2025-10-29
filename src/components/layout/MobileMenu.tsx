'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import AuthButton from '@/components/auth/AuthButton'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useSimpleAuth()
  const t = useTranslations()

  const handleSignOut = async () => {
    try {
      console.log('🔐 移动端开始登出...');
      onClose();
      
      // 1. 调用 NextAuth signOut
      try {
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false, callbackUrl: '/' });
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (nextAuthError) {
        console.log('⚠️ NextAuth 登出失败:', nextAuthError);
      }
      
      // 2. 清除 simple-auth session
      try {
        await fetch('/api/simple-auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (simpleAuthError) {
        console.log('⚠️ Simple Auth 登出失败:', simpleAuthError);
      }
      
      // 3. 清除本地存储
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (storageError) {
          console.log('⚠️ 清除本地存储失败:', storageError);
        }
        
        // 4. 设置退出标志
        try {
          sessionStorage.setItem('just_logged_out', 'true');
        } catch (e) {
          console.log('⚠️ 设置退出标志失败:', e);
        }
        
        // 5. 强制刷新页面
        await new Promise(resolve => setTimeout(resolve, 300));
        window.location.replace('/');
      }
    } catch (error) {
      console.error('❌ 移动端登出失败:', error);
      // 即使出错也强制刷新页面
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose}
        aria-label={t.common('close')}
      />
      
      {/* 菜单面板 */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          {/* 关闭按钮 */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t.common('close')}
            >
              <Icon name="x" className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* 用户信息 */}
          {user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="user" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.name || user.email}
                  </p>
                  <p className="text-sm text-gray-500">{t.common('profile')}</p>
                </div>
              </div>
            </div>
          )}

          {/* 导航菜单 */}
          <nav className="space-y-2">
            <Link 
              href="/" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Icon name="home" className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{t.nav('home')}</span>
            </Link>
            
            <Link 
              href="/generate" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Icon name="video" className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{t.nav('generate')}</span>
            </Link>

            <Link 
              href="/pricing" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Icon name="dollar-sign" className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Pricing</span>
            </Link>

            {user && (
              <>
                <Link 
                  href="/mvp" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="rocket" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{t.nav('mvp')}</span>
                </Link>
                
                <Link 
                  href="/achievements" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="trophy" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{t.nav('achievements')}</span>
                </Link>
                
                <Link 
                  href="/referral" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="users" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{t.nav('referral')}</span>
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="bar-chart" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{t.nav('dashboard')}</span>
                </Link>
              </>
            )}
          </nav>

          {/* 用户操作 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {user ? (
              <div className="space-y-3">
                <AuthButton 
                  variant="outline"
                  className="w-full"
                  onLogout={() => {
                    handleSignOut()
                    onClose()
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <AuthButton 
                  variant="outline"
                  className="w-full"
                />
                <Link href="/auth/signup" onClick={onClose}>
                  <Button className="w-full">
                    {t.common('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
