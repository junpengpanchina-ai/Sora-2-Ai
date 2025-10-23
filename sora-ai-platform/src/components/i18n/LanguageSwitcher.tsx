'use client'

import React from 'react'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  showFlags?: boolean
  showNativeNames?: boolean
  className?: string
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  size = 'md',
  showFlags = true,
  showNativeNames = true,
  className = ''
}: LanguageSwitcherProps) {
  // 只显示英文标识
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-lg">🇺🇸</span>
      <span className="text-sm font-medium">English</span>
    </div>
  )
}