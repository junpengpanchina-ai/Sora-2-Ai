import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Sora AI Platform
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              使用最先进的AI技术，从简单文本描述生成专业级视频内容。从创意到成品，只需几分钟。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  <Icon name="play" className="w-5 h-5 mr-2" />
                  免费开始
                </Button>
              </Link>
              <Link href="/generate">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Icon name="video" className="w-5 h-5 mr-2" />
                  立即生成
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              为什么选择 Sora AI？
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              最先进的AI视频生成技术，让创意无限可能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="zap" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI驱动生成</h3>
              <p className="text-gray-600">
                先进的人工智能技术，从简单文本描述生成令人惊叹的视频内容
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="clock" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">快速处理</h3>
              <p className="text-gray-600">
                几分钟内完成视频生成，无需等待数小时，让您的创意快速实现
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="users" className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">易于使用</h3>
              <p className="text-gray-600">
                无需技术背景，只需描述您的想法，AI就能为您创建专业视频
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="award" className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">专业质量</h3>
              <p className="text-gray-600">
                生成4K高清视频，支持多种风格和格式，满足各种创作需求
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="gift" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">推荐奖励</h3>
              <p className="text-gray-600">
                邀请朋友使用，获得免费视频生成次数和专属功能
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="shield" className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
              <p className="text-gray-600">
                企业级安全保障，您的创意和内容完全受保护
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
              如何使用？
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              三个简单步骤，即可生成专业视频
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">描述您的想法</h3>
              <p className="text-gray-600">
                用简单的文字描述您想要创建的视频内容，AI会理解您的创意
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI智能生成</h3>
              <p className="text-gray-600">
                我们的AI系统分析您的描述，生成符合您需求的高质量视频
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">下载分享</h3>
              <p className="text-gray-600">
                生成完成后，您可以下载视频或直接分享到社交媒体
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
              选择适合您的方案
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              从免费体验到专业创作，我们为每个用户提供最佳选择
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">免费版</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• 需要邀请码激活</li>
                  <li>• 每月3个免费视频</li>
                  <li>• 5秒视频长度</li>
                  <li>• 720p视频质量</li>
                  <li>• 社区支持</li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">获取邀请码</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  最受欢迎
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">专业版</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$19.99<span className="text-lg text-gray-500">/月</span></div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• 每月40个视频</li>
                  <li>• 15秒视频长度</li>
                  <li>• 1080p高清质量</li>
                  <li>• 优先技术支持</li>
                  <li>• 高级模板</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">选择专业版</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">企业版</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$59.99<span className="text-lg text-gray-500">/月</span></div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• 每月120个视频</li>
                  <li>• 15秒视频长度</li>
                  <li>• 4K超高清质量</li>
                  <li>• 专属客户经理</li>
                  <li>• API接口访问</li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">联系销售</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            准备开始您的AI视频创作之旅？
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            加入数万名创作者，用AI技术释放无限创意
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Icon name="rocket" className="w-5 h-5 mr-2" />
                立即注册
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Icon name="play" className="w-5 h-5 mr-2" />
                免费试用
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
