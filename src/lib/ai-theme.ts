// AI个性化主题系统
export interface ThemeConfig {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  animations: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      ease: string
      easeIn: string
      easeOut: string
      easeInOut: string
    }
  }
}

// 预设主题配置
export const AI_THEMES: Record<string, ThemeConfig> = {
  // 专业商务主题
  professional: {
    id: 'professional',
    name: 'Professional',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },

  // 创意艺术主题
  creative: {
    id: 'creative',
    name: 'Creative',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#fef7ff',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    typography: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem'
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(139 92 246 / 0.1)',
      md: '0 4px 8px 0 rgb(139 92 246 / 0.15)',
      lg: '0 8px 16px 0 rgb(139 92 246 / 0.2)',
      xl: '0 16px 32px 0 rgb(139 92 246 / 0.25)'
    },
    animations: {
      duration: {
        fast: '200ms',
        normal: '400ms',
        slow: '600ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },

  // 科技未来主题
  futuristic: {
    id: 'futuristic',
    name: 'Futuristic',
    colors: {
      primary: '#00d4aa',
      secondary: '#6366f1',
      accent: '#f59e0b',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#a1a1aa'
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem'
    },
    shadows: {
      sm: '0 0 4px 0 rgb(0 212 170 / 0.2)',
      md: '0 0 8px 0 rgb(0 212 170 / 0.3)',
      lg: '0 0 16px 0 rgb(0 212 170 / 0.4)',
      xl: '0 0 32px 0 rgb(0 212 170 / 0.5)'
    },
    animations: {
      duration: {
        fast: '100ms',
        normal: '200ms',
        slow: '400ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  },

  // 温暖舒适主题
  cozy: {
    id: 'cozy',
    name: 'Cozy',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#f97316',
      background: '#fef3c7',
      surface: '#ffffff',
      text: '#92400e',
      textSecondary: '#a16207'
    },
    typography: {
      fontFamily: 'Georgia, serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(245 158 11 / 0.1)',
      md: '0 4px 6px -1px rgb(245 158 11 / 0.1)',
      lg: '0 10px 15px -3px rgb(245 158 11 / 0.1)',
      xl: '0 20px 25px -5px rgb(245 158 11 / 0.1)'
    },
    animations: {
      duration: {
        fast: '250ms',
        normal: '500ms',
        slow: '750ms'
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out'
      }
    }
  }
}

// AI主题推荐算法
export function getRecommendedTheme(userPreferences: {
  industry?: string
  role?: string
  usagePattern?: string
  colorPreference?: string
  timeOfDay?: string
}): ThemeConfig {
  const { industry, role, usagePattern, colorPreference, timeOfDay } = userPreferences

  // 基于行业推荐
  if (industry === 'finance' || industry === 'legal') {
    return AI_THEMES.professional
  }
  
  if (industry === 'design' || industry === 'marketing') {
    return AI_THEMES.creative
  }
  
  if (industry === 'tech' || industry === 'gaming') {
    return AI_THEMES.futuristic
  }
  
  if (industry === 'healthcare' || industry === 'education') {
    return AI_THEMES.cozy
  }

  // 基于角色推荐
  if (role === 'executive' || role === 'manager') {
    return AI_THEMES.professional
  }
  
  if (role === 'designer' || role === 'creator') {
    return AI_THEMES.creative
  }
  
  if (role === 'developer' || role === 'engineer') {
    return AI_THEMES.futuristic
  }

  // 基于使用模式推荐
  if (usagePattern === 'focused' || usagePattern === 'analytical') {
    return AI_THEMES.professional
  }
  
  if (usagePattern === 'creative' || usagePattern === 'experimental') {
    return AI_THEMES.creative
  }
  
  if (usagePattern === 'technical' || usagePattern === 'precise') {
    return AI_THEMES.futuristic
  }

  // 基于时间推荐
  if (timeOfDay === 'morning') {
    return AI_THEMES.professional
  }
  
  if (timeOfDay === 'afternoon') {
    return AI_THEMES.creative
  }
  
  if (timeOfDay === 'evening') {
    return AI_THEMES.futuristic
  }
  
  if (timeOfDay === 'night') {
    return AI_THEMES.cozy
  }

  // 默认推荐
  return AI_THEMES.professional
}

// 主题切换动画
export function applyThemeTransition(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  
  // 设置CSS变量
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-secondary', theme.colors.secondary)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  root.style.setProperty('--theme-background', theme.colors.background)
  root.style.setProperty('--theme-surface', theme.colors.surface)
  root.style.setProperty('--theme-text', theme.colors.text)
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
  
  // 应用字体
  root.style.setProperty('--theme-font-family', theme.typography.fontFamily)
  
  // 应用动画
  root.style.setProperty('--theme-transition-duration', theme.animations.duration.normal)
  root.style.setProperty('--theme-transition-easing', theme.animations.easing.easeInOut)
  
  // 添加过渡类
  root.classList.add('theme-transitioning')
  
  // 移除过渡类
  setTimeout(() => {
    root.classList.remove('theme-transitioning')
  }, parseInt(theme.animations.duration.normal))
}

// 保存用户主题偏好
export function saveUserThemePreference(userId: string, themeId: string): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(`user-theme-${userId}`, themeId)
}

// 获取用户主题偏好
export function getUserThemePreference(userId: string): string | null {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem(`user-theme-${userId}`)
}
