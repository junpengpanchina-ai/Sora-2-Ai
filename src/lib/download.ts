/**
 * 视频下载工具函数
 */

export interface DownloadOptions {
  filename?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * 下载视频文件
 * @param url 视频URL
 * @param options 下载选项
 */
export async function downloadVideo(url: string, options: DownloadOptions = {}) {
  const { filename, onProgress, onComplete, onError } = options

  try {
    // 创建下载链接
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || `video_${Date.now()}.mp4`
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理URL对象
    window.URL.revokeObjectURL(downloadUrl)
    
    onComplete?.()
  } catch (error) {
    console.error('下载视频失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 获取视频文件名
 * @param url 视频URL
 * @param title 视频标题
 */
export function getVideoFilename(url: string, title?: string): string {
  if (title) {
    // 清理标题中的非法字符
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50)
    return `${cleanTitle}.mp4`
  }
  
  // 从URL中提取文件名
  const urlParts = url.split('/')
  const lastPart = urlParts[urlParts.length - 1]
  
  if (lastPart.includes('.')) {
    return lastPart
  }
  
  return `video_${Date.now()}.mp4`
}

/**
 * 检查浏览器是否支持下载
 */
export function isDownloadSupported(): boolean {
  return typeof window !== 'undefined' && 'download' in document.createElement('a')
}
