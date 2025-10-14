# Sora AI视频平台 - Apple + Figma 混合风格设计方案

## 🎨 设计理念

### 核心原则
- **Apple美学**: 简洁、优雅、直观的用户体验
- **Figma功能**: 丰富、强大、协作的设计工具
- **完美融合**: 在简洁中体现功能，在功能中保持简洁

### 设计语言
- **视觉层次**: 清晰的信息架构和视觉引导
- **交互设计**: 直观的操作流程和反馈机制
- **响应式**: 完美适配桌面、平板、手机
- **可访问性**: 支持各种用户群体

---

## 🎯 设计系统架构

### 色彩系统
```css
/* Apple + Figma 混合色彩系统 */
:root {
  /* Apple风格 - 简洁优雅 */
  --apple-primary: #007AFF;
  --apple-secondary: #5856D6;
  --apple-success: #34C759;
  --apple-warning: #FF9500;
  --apple-error: #FF3B30;
  
  /* Figma风格 - 功能丰富 */
  --figma-primary: #8B5CF6;
  --figma-secondary: #06B6D4;
  --figma-accent: #F59E0B;
  --figma-success: #10B981;
  
  /* 中性色系 */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* 背景色 */
  --background: var(--white);
  --surface: var(--gray-50);
  --surface-hover: var(--gray-100);
  
  /* 文字色 */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-tertiary: var(--gray-500);
  
  /* 边框色 */
  --border: var(--gray-200);
  --border-hover: var(--gray-300);
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

### 字体系统
```css
/* 字体系统 */
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  
  /* 字体大小 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 间距系统
```css
/* 间距系统 */
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

## 🏠 首页设计 (Apple风格)

### 布局结构
```tsx
// 首页布局
<div className="min-h-screen bg-white">
  {/* 导航栏 */}
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <nav className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">Sora AI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors">生成视频</a>
          <a href="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">模板库</a>
          <a href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">定价</a>
          <a href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">帮助</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">登录</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            开始使用
          </button>
        </div>
      </div>
    </nav>
  </header>

  {/* 主要内容 */}
  <main>
    {/* Hero区域 */}
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            用AI创造
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              无限可能
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            只需一句话，让AI为您生成专业级视频内容。从创意到成品，只需几分钟。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105">
              开始创作
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all">
              观看演示
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* 功能特性 */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h2>
          <p className="text-lg text-gray-600">强大的AI技术，简单易用的界面</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">简单易用</h3>
            <p className="text-gray-600">只需输入文字描述，AI自动生成专业视频</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">专业质量</h3>
            <p className="text-gray-600">基于先进AI技术，生成电影级视频质量</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">快速生成</h3>
            <p className="text-gray-600">几分钟内完成从创意到成品的全过程</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
```

---

## 🎬 视频生成页面 (Figma风格)

### 布局结构
```tsx
// 视频生成页面
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 主编辑区 */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* 页面头部 */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">创建新视频</h1>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  保存草稿
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  预览
                </button>
              </div>
            </div>
          </div>
          
          {/* 编辑区域 */}
          <div className="p-6">
            <div className="space-y-6">
              {/* 提示词输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频描述
                </label>
                <div className="relative">
                  <textarea 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="详细描述您想要生成的视频内容..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    <span id="charCount">0</span>/500
                  </div>
                </div>
              </div>
              
              {/* 参考图片上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  参考图片 (可选)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">拖拽图片到此处或点击上传</p>
                  <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, GIF 格式</p>
                </div>
              </div>
              
              {/* 视频设置 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频时长
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="10">10秒</option>
                    <option value="15">15秒</option>
                    <option value="30">30秒</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频比例
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="16:9">16:9 (横屏)</option>
                    <option value="9:16">9:16 (竖屏)</option>
                    <option value="1:1">1:1 (方形)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频质量
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="standard">标准质量</option>
                    <option value="hd">高清质量</option>
                    <option value="uhd">超高清质量</option>
                  </select>
                </div>
              </div>
              
              {/* 生成按钮 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">保存到模板库</span>
                  </label>
                </div>
                
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                  生成视频
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 侧边栏 */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          {/* 高级设置 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">高级设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  风格预设
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="realistic">写实风格</option>
                  <option value="animated">动画风格</option>
                  <option value="artistic">艺术风格</option>
                  <option value="cinematic">电影风格</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  色彩风格
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button className="w-8 h-8 bg-gray-900 rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors"></button>
                  <button className="w-8 h-8 bg-blue-600 rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors"></button>
                  <button className="w-8 h-8 bg-purple-600 rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors"></button>
                  <button className="w-8 h-8 bg-green-600 rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors"></button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 模板库 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐模板</h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900">产品展示</h4>
                <p className="text-sm text-gray-600">适合产品介绍和营销</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900">教育内容</h4>
                <p className="text-sm text-gray-600">适合教学和培训</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900">社交媒体</h4>
                <p className="text-sm text-gray-600">适合短视频平台</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 💰 定价页面 (Apple + Stripe风格)

### 布局结构
```tsx
// 定价页面
<div className="min-h-screen bg-white">
  <div className="max-w-6xl mx-auto px-6 py-16">
    {/* 页面头部 */}
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        选择适合您的方案
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        灵活的定价，满足不同需求
      </p>
      
      {/* 计费周期切换 */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          月付
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">
          年付
        </button>
      </div>
    </div>
    
    {/* 定价方案 */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* 免费版 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">免费版</h3>
          <p className="text-gray-600 mb-6">适合个人用户试用</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">¥0</span>
            <span className="text-gray-600">/月</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">3个视频/月</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">10秒视频</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">标准质量</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">基础模板</span>
            </li>
          </ul>
          
          <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            当前方案
          </button>
        </div>
      </div>
      
      {/* 专业版 */}
      <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            推荐
          </span>
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">专业版</h3>
          <p className="text-gray-600 mb-6">适合内容创作者</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">¥99</span>
            <span className="text-gray-600">/月</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">20个视频/月</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">高清质量</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">所有模板</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">优先处理</span>
            </li>
          </ul>
          
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            升级到专业版
          </button>
        </div>
      </div>
      
      {/* 企业版 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">企业版</h3>
          <p className="text-gray-600 mb-6">适合团队和企业</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">¥999</span>
            <span className="text-gray-600">/月</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">无限视频</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">团队协作</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">API访问</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">专属客服</span>
            </li>
          </ul>
          
          <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            联系销售
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 组件库设计

### 按钮组件
```tsx
// 按钮组件系统
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

### 卡片组件
```tsx
// 卡片组件系统
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md'
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-200 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : '';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};
```

---

## 📱 响应式设计

### 断点系统
```css
/* 响应式断点 */
@media (max-width: 640px) {
  /* 手机端 */
  .container { padding: 1rem; }
  .grid { grid-template-columns: 1fr; }
  .text-4xl { font-size: 2rem; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* 平板端 */
  .container { padding: 1.5rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1025px) {
  /* 桌面端 */
  .container { padding: 2rem; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 移动端优化
```tsx
// 移动端导航
<div className="md:hidden">
  <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>
```

---

## 🎯 实施建议

### 开发优先级
1. **第一阶段**: 基础组件库 + 首页设计
2. **第二阶段**: 视频生成页面 + 用户系统
3. **第三阶段**: 定价页面 + 支付系统
4. **第四阶段**: 用户中心 + 高级功能

### 技术实现
- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS + 自定义设计系统
- **组件**: 自建组件库 + Headless UI
- **动画**: Framer Motion
- **图标**: Lucide React

### 质量保证
- **设计一致性**: 严格遵循设计系统
- **响应式测试**: 多设备兼容性测试
- **性能优化**: 图片优化 + 代码分割
- **可访问性**: 键盘导航 + 屏幕阅读器支持

这个Apple + Figma混合风格设计方案将为您的Sora AI视频平台提供世界级的用户体验，既保持了Apple的简洁优雅，又具备了Figma的功能丰富性！
