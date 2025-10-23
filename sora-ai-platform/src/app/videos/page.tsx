'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { downloadVideo, getVideoFilename } from '@/lib/download'
import ShareButton from '@/components/social/ShareButton'

interface Video {
  id: string
  title?: string
  prompt: string
  url?: string
  status: string
  progress: number
  duration?: number
  aspectRatio?: string
  size?: string
  createdAt: string
  updatedAt: string
}

export default function VideosPage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  // 处理视频下载
  const handleDownload = async (video: Video) => {
    if (!video.url) return;
    
    setDownloadingIds(prev => new Set(prev).add(video.id));
    try {
      const filename = getVideoFilename(video.url, video.title || video.prompt);
      
      await downloadVideo(video.url, {
        filename,
        onComplete: () => {
          console.log('视频下载完成');
          setDownloadingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(video.id);
            return newSet;
          });
        },
        onError: (error) => {
          console.error('下载失败:', error);
          setDownloadingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(video.id);
            return newSet;
          });
        }
      });
    } catch (error) {
      console.error('下载视频失败:', error);
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(video.id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchVideos()
    }
  }, [session, status, router])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error('获取视频列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'processing':
        return '处理中'
      case 'failed':
        return '失败'
      case 'pending':
        return '等待中'
      default:
        return status
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/generate">
                <Button>
                  <Icon name="video" className="w-4 h-4 mr-2" />
                  {t.mvp('quickActions.generateVideo')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {videos.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="video" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.t('empty.noVideos')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.t('hints.createFirstVideo')}
              </p>
              <Link href="/generate">
                <Button size="lg">{t.mvp('quickActions.generateVideo')}</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {video.title || t.common('view')}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {video.prompt}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                      {getStatusText(video.status)}
                    </span>
                  </div>

                  {video.status === 'processing' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t.achievements('achievementProgress')}</span>
                        <span>{video.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {video.url && video.status === 'completed' && (
                    <div className="mb-4">
                      <video 
                        src={video.url} 
                        controls 
                        className="w-full rounded-lg"
                        poster="/placeholder-video.jpg"
                      >
                        {t.errors('networkError')}
                      </video>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      {video.duration && (
                        <span>{video.duration}s</span>
                      )}
                      {video.aspectRatio && (
                        <span>{video.aspectRatio}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {video.url && video.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(video)}
                        disabled={downloadingIds.has(video.id)}
                      >
                        <Icon name={downloadingIds.has(video.id) ? "loader" : "download"} className="w-4 h-4 mr-1" />
                        {downloadingIds.has(video.id) ? '下载中...' : t.common('download')}
                      </Button>
                    )}
                    {video.url && video.status === 'completed' && (
                      <ShareButton
                        videoId={video.id}
                        videoTitle={video.title || video.prompt}
                        videoUrl={video.url}
                        onShare={(platform) => {
                          console.log(`分享视频 ${video.id} 到 ${platform}`);
                        }}
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
