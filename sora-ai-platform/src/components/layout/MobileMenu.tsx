'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose}
      />
      
      {/* 菜单面板 */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          {/* 关闭按钮 */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* 用户信息 */}
          {session && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="user" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {session.user?.name || session.user?.email}
                  </p>
                  <p className="text-sm text-gray-500">创作者</p>
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
              <span className="text-gray-700">首页</span>
            </Link>
            
            <Link 
              href="/generate" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <Icon name="video" className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">生成视频</span>
            </Link>

            {session && (
              <>
                <Link 
                  href="/mvp" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="rocket" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">🚀 MVP</span>
                </Link>
                
                <Link 
                  href="/achievements" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="trophy" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">成就</span>
                </Link>
                
                <Link 
                  href="/referral" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="users" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">邀请</span>
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Icon name="bar-chart" className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">仪表板</span>
                </Link>
              </>
            )}
          </nav>

          {/* 用户操作 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {session ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                >
                  退出登录
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/auth/signin" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    登录
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={onClose}>
                  <Button className="w-full">
                    注册
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
