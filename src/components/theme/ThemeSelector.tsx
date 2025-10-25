'use client'

import React, { useState } from 'react'
import { useAITheme } from './AIThemeProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

export function ThemeSelector() {
  const { currentTheme, availableThemes, setTheme, isTransitioning } = useAITheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
        disabled={isTransitioning}
      >
        <Icon name="palette" className="w-4 h-4" />
        <span>{currentTheme.name}</span>
        <Icon name={isOpen ? "chevronUp" : "chevronDown"} className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">选择主题</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <Icon name="x" className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id)
                    setIsOpen(false)
                  }}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isTransitioning}
                >
                  <div className="space-y-2">
                    {/* 主题预览 */}
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    
                    <div className="text-left">
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-gray-500">
                        {theme.id === 'professional' && '专业商务'}
                        {theme.id === 'creative' && '创意艺术'}
                        {theme.id === 'futuristic' && '科技未来'}
                        {theme.id === 'cozy' && '温暖舒适'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 主题描述 */}
            <div className="text-sm text-gray-600">
              <p>
                {currentTheme.id === 'professional' && '简洁专业，适合商务办公'}
                {currentTheme.id === 'creative' && '色彩丰富，激发创意灵感'}
                {currentTheme.id === 'futuristic' && '科技感十足，未来风格'}
                {currentTheme.id === 'cozy' && '温暖舒适，放松身心'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
