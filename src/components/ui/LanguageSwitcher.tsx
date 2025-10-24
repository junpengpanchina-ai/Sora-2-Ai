'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { useLanguageSwitcher } from '@/hooks/useModernTranslations'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/core'

interface LanguageSwitcherProps {
  currentLocale: string
  className?: string
}

export default function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { changeLanguage, isChanging, currentLocale: activeLocale } = useLanguageSwitcher()

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === activeLocale) || SUPPORTED_LANGUAGES[0]

  // 处理语言切换
  const handleLanguageChange = async (locale: string) => {
    if (locale === activeLocale || isAnimating) return

    setIsAnimating(true)
    setIsOpen(false)

    try {
      await changeLanguage()
    } catch (error) {
      console.error('Language change failed:', error)
    } finally {
      setIsAnimating(false)
    }
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 键盘导航支持
  const handleKeyDown = (event: React.KeyboardEvent, locale: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleLanguageChange(locale)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 transition-all duration-200 ${
          isChanging || isAnimating ? 'opacity-50 pointer-events-none' : ''
        }`}
        disabled={isChanging || isAnimating}
      >
        <span className="text-lg transition-transform duration-200">
          {isAnimating ? '🔄' : currentLanguage.flag}
        </span>
        <span className="hidden sm:inline transition-opacity duration-200">
          {isAnimating ? 'Switching...' : currentLanguage.name}
        </span>
        <Icon 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {isOpen && (
        <>
          {/* 遮罩层 - 带淡入动画 */}
          <div 
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 语言选项 - 带滑入动画 */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-in slide-in-from-top-2 duration-200">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                onKeyDown={(e) => handleKeyDown(e, language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg group ${
                  currentLocale === language.code 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                disabled={isAnimating}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {language.flag}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.nativeName}</div>
                </div>
                {currentLocale === language.code && (
                  <Icon 
                    name="check" 
                    className="h-4 w-4 text-primary-600 animate-in zoom-in duration-200" 
                  />
                )}
                {isAnimating && currentLocale === language.code && (
                  <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            )) || (
              // 回退到默认语言选项
              <>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 first:rounded-t-lg ${
                    currentLocale === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">🇺🇸</span>
                  <span className="font-medium">English</span>
                  {currentLocale === 'en' && <Icon name="check" className="h-4 w-4 text-primary-600" />}
                </button>
                <button
                  onClick={() => handleLanguageChange('zh')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 last:rounded-b-lg ${
                    currentLocale === 'zh' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">🇨🇳</span>
                  <span className="font-medium">中文</span>
                  {currentLocale === 'zh' && <Icon name="check" className="h-4 w-4 text-primary-600" />}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}