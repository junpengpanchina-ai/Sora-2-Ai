'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// 简化的语言配置
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
]

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
  const { state, actions } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === state.locale) || SUPPORTED_LANGUAGES[0]

  // 处理语言切换
  const handleLanguageChange = async (locale: string) => {
    if (locale === state.locale || state.isChanging) return
    
    setIsOpen(false)
    await actions.changeLanguage(locale)
  }

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 按钮样式
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs'
      case 'lg': return 'px-4 py-3 text-base'
      default: return 'px-3 py-2 text-sm'
    }
  }

  // 按钮变体
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={state.isChanging}
            className={`
              ${getSizeClasses()}
              rounded-lg transition-all duration-200
              ${state.locale === language.code
                ? 'bg-primary-100 text-primary-600 shadow-sm'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
              ${state.isChanging ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            {showFlags && <span className="text-lg mr-1">{language.flag}</span>}
            <span className="font-medium">{language.name}</span>
          </button>
        ))}
      </div>
    )
  }

  // 最小化变体
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={state.isChanging}
            className={`
              p-1 rounded transition-all duration-200
              ${state.locale === language.code
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-gray-100 text-gray-600'
              }
              ${state.isChanging ? 'opacity-50 pointer-events-none' : ''}
            `}
            title={showNativeNames ? language.nativeName : language.name}
          >
            {showFlags && <span className="text-sm">{language.flag}</span>}
          </button>
        ))}
      </div>
    )
  }

  // 下拉菜单变体（默认）
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size={size}
        className={`
          flex items-center space-x-2 transition-all duration-200
          ${state.isChanging ? 'opacity-50 pointer-events-none' : ''}
        `}
        disabled={state.isChanging}
      >
        {showFlags && (
          <span className="text-lg transition-transform duration-200">
            {state.isChanging ? '🔄' : currentLanguage.flag}
          </span>
        )}
        <span className="transition-opacity duration-200">
          {state.isChanging ? 'Switching...' : currentLanguage.name}
        </span>
        {showNativeNames && currentLanguage.nativeName !== currentLanguage.name && (
          <span className="text-xs text-gray-500 hidden sm:inline">
            ({currentLanguage.nativeName})
          </span>
        )}
        <Icon 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 语言选项 */}
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                Select Language
              </div>
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 
                    transition-all duration-200 rounded-md group
                    ${state.locale === language.code 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:text-gray-900'
                    }
                  `}
                  disabled={state.isChanging}
                >
                  {showFlags && (
                    <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                      {language.flag}
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{language.name}</div>
                    {showNativeNames && language.nativeName !== language.name && (
                      <div className="text-xs text-gray-500">{language.nativeName}</div>
                    )}
                  </div>
                  {state.locale === language.code && (
                    <Icon 
                      name="check" 
                      className="h-4 w-4 text-primary-600 animate-in zoom-in duration-200" 
                    />
                  )}
                  {state.isChanging && state.locale === language.code && (
                    <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
