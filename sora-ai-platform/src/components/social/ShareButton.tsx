'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

interface ShareButtonProps {
  videoId: string
  videoTitle: string
  videoUrl: string
  onShare?: (platform: string) => void
}

const SHARE_PLATFORMS = [
  {
    id: 'wechat',
    name: '微信',
    icon: 'message-circle',
    color: 'bg-green-500',
    url: (title: string, url: string) => 
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  },
  {
    id: 'weibo',
    name: '微博',
    icon: 'twitter',
    color: 'bg-red-500',
    url: (title: string, url: string) => 
      `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: 'video',
    color: 'bg-black',
    url: (title: string, url: string) => 
      `https://www.douyin.com/share/video/${videoId}`
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: 'heart',
    color: 'bg-pink-500',
    url: (title: string, url: string) => 
      `https://www.xiaohongshu.com/explore/${videoId}`
  },
  {
    id: 'bilibili',
    name: 'B站',
    icon: 'play',
    color: 'bg-blue-500',
    url: (title: string, url: string) => 
      `https://www.bilibili.com/video/${videoId}`
  },
  {
    id: 'qq',
    name: 'QQ',
    icon: 'message-square',
    color: 'bg-blue-600',
    url: (title: string, url: string) => 
      `https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: 'bg-blue-700',
    url: (title: string, url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'twitter',
    color: 'bg-sky-500',
    url: (title: string, url: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  }
]

export default function ShareButton({ videoId, videoTitle, videoUrl, onShare }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform: string) => {
    const platformConfig = SHARE_PLATFORMS.find(p => p.id === platform)
    if (!platformConfig) return

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(videoUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        const shareUrl = platformConfig.url(videoTitle, videoUrl)
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }
      
      onShare?.(platform)
      
      // 记录分享行为
      await fetch('/api/analytics/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          platform,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('分享失败:', error)
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Icon name="share" className="h-4 w-4" />
        <span>分享</span>
      </Button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 分享面板 */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">分享到</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {SHARE_PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleShare(platform.id)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center`}>
                      <Icon name={platform.icon as any} className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{platform.name}</span>
                  </button>
                ))}
              </div>

              {/* 复制链接 */}
              <div className="border-t pt-3">
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon name={copied ? "check" : "copy"} className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {copied ? '已复制' : '复制链接'}
                  </span>
                </button>
              </div>

              {/* 分享奖励提示 */}
              <div className="mt-3 p-2 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 text-center">
                  🎉 分享视频可获得免费视频奖励！
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
