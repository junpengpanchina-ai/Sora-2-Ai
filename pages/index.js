import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到子目录应用
    router.replace('/sora-ai-platform')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      正在重定向到 Sora AI Platform...
    </div>
  )
}
