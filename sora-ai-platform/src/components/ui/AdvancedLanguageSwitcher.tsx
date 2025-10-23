'use client'

import React, { useState, useEffect } from 'react'
import { useLanguageSwitcher } from '@/hooks/useModernTranslations'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/core'
import { Button } from './Button'
import { Icon } from './Icon'

interface AdvancedLanguageSwitcherProps {
  className?: string
  showFlags?: boolean
  showNativeNames?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'compact'
}

export default function AdvancedLanguageSwitcher({
  className = '',
  showFlags = true,
  showNativeNames = true,
  size = 'md',
  variant = 'default'
}: AdvancedLanguageSwitcherProps) {
  const { currentLocale, isChanging, changeLanguage } = useLanguageSwitcher()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState(currentLocale)

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLocale) || SUPPORTED_LANGUAGES[0]

  // 监听语言变化事件
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { to } = event.detail
      setSelectedLocale(to)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
  }, [])

  const handleLanguageSelect = async (locale: string) => {
    if (locale === currentLocale || isChanging) return

    setIsOpen(false)
    await changeLanguage(locale)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs'
      case 'lg': return 'px-4 py-3 text-base'
      default: return 'px-3 py-2 text-sm'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal': return 'border-0 shadow-none hover:bg-gray-50'
      case 'compact': return 'px-2 py-1 text-xs'
      default: return 'border border-gray-300 shadow-sm'
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center space-x-1">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`p-1 rounded transition-all duration-200 ${
                currentLocale === language.code
                  ? 'bg-primary-100 text-primary-600'
                  : 'hover:bg-gray-100 text-gray-600'
              } ${isChanging ? 'opacity-50 pointer-events-none' : ''}`}
              disabled={isChanging}
            >
              {showFlags && <span className="text-sm">{language.flag}</span>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`${getSizeClasses()} ${getVariantClasses()} flex items-center space-x-2 transition-all duration-200 ${
          isChanging ? 'opacity-50 pointer-events-none' : ''
        }`}
        disabled={isChanging}
      >
        {showFlags && (
          <span className="text-lg transition-transform duration-200">
            {isChanging ? '🔄' : currentLanguage.flag}
          </span>
        )}
        <span className="transition-opacity duration-200">
          {isChanging ? 'Switching...' : currentLanguage.name}
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
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">Select Language</div>
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-all duration-200 rounded-md group ${
                    currentLocale === language.code 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  disabled={isChanging}
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
                  {currentLocale === language.code && (
                    <Icon 
                      name="check" 
                      className="h-4 w-4 text-primary-600 animate-in zoom-in duration-200" 
                    />
                  )}
                  {isChanging && currentLocale === language.code && (
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
