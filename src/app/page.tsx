'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'
import { useSimpleAuth } from '@/hooks/useSimpleAuth'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const t = useTranslations()
  const { user, loading } = useSimpleAuth()
  const router = useRouter()
  
  // 如果用户已登录，显示欢迎信息
  const showWelcomeMessage = user && !loading
  
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 登录成功状态显示 */}
            {showWelcomeMessage && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <Icon name="checkCircle" className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Welcome back, {user.name || user.email}! 🎉
                  </span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  You are successfully logged in
                </p>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t.home('title')}
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home('subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {showWelcomeMessage ? (
                <>
                  <Link href="/generate">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Icon name="video" className="w-5 h-5 mr-2" />
                      Start Creating Videos
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto"
                    >
                      <Icon name="user" className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Icon name="play" className="w-5 h-5 mr-2" />
                      {t.home('getStarted')}
                    </Button>
                  </Link>
                  <Link href="/generate">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto"
                    >
                      <Icon name="video" className="w-5 h-5 mr-2" />
                      {t.home('watchDemo')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t.home('features.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.home('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="zap" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.aiGeneration.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.aiGeneration.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="clock" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.fastProcessing.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.fastProcessing.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="users" className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.home('features.easyToUse.title')}</h3>
              <p className="text-gray-600">
                {t.home('features.easyToUse.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="award" className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Quality</h3>
              <p className="text-gray-600">
                Generate 4K ultra-high-definition videos with multiple styles and formats to meet all your creative needs
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="gift" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Referral Rewards</h3>
              <p className="text-gray-600">
                Invite friends to use our platform and earn free video generation credits and exclusive features
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="shield" className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security ensures your creative ideas and content are fully protected
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to generate professional videos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Vision</h3>
              <p className="text-gray-600">
                Use simple text to describe the video content you want to create, and our AI will understand your creative ideas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Smart Generation</h3>
              <p className="text-gray-600">
                Our AI system analyzes your description and generates high-quality videos that meet your requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Share</h3>
              <p className="text-gray-600">
                Once generation is complete, you can download your video or share it directly on social media
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              简单透明的定价
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              选择适合您的AI视频生成方案。所有方案都包含3天免费试用，让您充分体验我们的AI技术。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sora Solo */}
            <Card className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sora Solo</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$42<span className="text-xl text-gray-500">/月</span></div>
                <div className="text-sm text-green-600 font-medium mb-4">3天免费试用</div>
                <ul className="space-y-2 text-gray-600 mb-6 text-sm">
                  <li>• 每月50个AI视频生成</li>
                  <li>• 最长30秒视频时长</li>
                  <li>• 4K超高清画质</li>
                  <li>• AI智能剪辑和配音</li>
                  <li>• 无水印导出</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-gray-800 hover:bg-gray-900">开始3天免费试用</Button>
                </Link>
              </div>
            </Card>

            {/* Sora Teams - Recommended */}
            <Card className="p-8 border-2 border-blue-500 relative scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  推荐方案
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sora Teams</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$299<span className="text-xl text-gray-500">/月</span></div>
                <div className="text-sm text-green-600 font-medium mb-4">3天免费试用</div>
                <ul className="space-y-2 text-gray-600 mb-6 text-sm">
                  <li>• 每月200个AI视频生成</li>
                  <li>• 最长60秒视频时长</li>
                  <li>• 4K超高清画质</li>
                  <li>• 团队协作功能(最多10人)</li>
                  <li>• API接口访问</li>
                  <li>• 专属客户经理</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">开始3天免费试用</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* View Full Pricing */}
          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <Icon name="arrow-right" className="w-5 h-5 mr-2" />
                查看完整定价详情
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your AI Video Creation Journey?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of creators and unleash unlimited creativity with AI technology
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Icon name="rocket" className="w-5 h-5 mr-2" />
                {t.common('signup')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}