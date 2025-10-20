'use client'

import React from 'react'
import { Icon } from './Icon'

interface VideoPlayerProps {
  url: string
  title?: string
  className?: string
}

export function VideoPlayer({ url, title, className = '' }: VideoPlayerProps) {
  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        controls
        className="w-full h-full"
        poster="/api/placeholder/800/450"
      >
        <source src={url} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
      
      {/* 视频标题覆盖层 */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-sm">{title}</h3>
        </div>
      )}
      
      {/* 播放按钮覆盖层 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Icon name="play" className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </div>
  )
}
