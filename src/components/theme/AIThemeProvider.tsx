'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ThemeConfig, AI_THEMES, getRecommendedTheme, applyThemeTransition, saveUserThemePreference, getUserThemePreference } from '@/lib/ai-theme'

interface AIThemeContextType {
  currentTheme: ThemeConfig
  availableThemes: ThemeConfig[]
  setTheme: (themeId: string) => void
  isTransitioning: boolean
  userPreferences: {
    industry?: string
    role?: string
    usagePattern?: string
    colorPreference?: string
    timeOfDay?: string
  }
  updatePreferences: (preferences: Partial<AIThemeContextType['userPreferences']>) => void
}

const AIThemeContext = createContext<AIThemeContextType | undefined>(undefined)

interface AIThemeProviderProps {
  children: React.ReactNode
}

export function AIThemeProvider({ children }: AIThemeProviderProps) {
  const { data: session } = useSession()
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(AI_THEMES.professional)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userPreferences, setUserPreferences] = useState<AIThemeContextType['userPreferences']>({})

  const availableThemes = Object.values(AI_THEMES)

  // 初始化主题
  useEffect(() => {
    if (session?.user?.id) {
      // 获取用户保存的主题偏好
      const savedThemeId = getUserThemePreference(session.user.id)
      if (savedThemeId && AI_THEMES[savedThemeId]) {
        setCurrentTheme(AI_THEMES[savedThemeId])
        applyThemeTransition(AI_THEMES[savedThemeId])
      } else {
        // 基于用户偏好推荐主题
        const recommendedTheme = getRecommendedTheme(userPreferences)
        setCurrentTheme(recommendedTheme)
        applyThemeTransition(recommendedTheme)
      }
    }
  }, [session?.user?.id, userPreferences])

  // 设置主题
  const setTheme = (themeId: string) => {
    const theme = AI_THEMES[themeId]
    if (!theme) return

    setIsTransitioning(true)
    setCurrentTheme(theme)
    applyThemeTransition(theme)

    // 保存用户偏好
    if (session?.user?.id) {
      saveUserThemePreference(session.user.id, themeId)
    }

    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  // 更新用户偏好
  const updatePreferences = (preferences: Partial<AIThemeContextType['userPreferences']>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }))
  }

  // 基于时间自动切换主题
  useEffect(() => {
    const updateTimeBasedTheme = () => {
      const hour = new Date().getHours()
      let timeOfDay: string

      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning'
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon'
      } else if (hour >= 18 && hour < 22) {
        timeOfDay = 'evening'
      } else {
        timeOfDay = 'night'
      }

      updatePreferences({ timeOfDay })
    }

    updateTimeBasedTheme()
    const interval = setInterval(updateTimeBasedTheme, 60000) // 每分钟检查一次

    return () => clearInterval(interval)
  }, [])

  const value: AIThemeContextType = {
    currentTheme,
    availableThemes,
    setTheme,
    isTransitioning,
    userPreferences,
    updatePreferences
  }

  return (
    <AIThemeContext.Provider value={value}>
      {children}
    </AIThemeContext.Provider>
  )
}

export function useAITheme() {
  const context = useContext(AIThemeContext)
  if (context === undefined) {
    throw new Error('useAITheme must be used within an AIThemeProvider')
  }
  return context
}
