'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { useTranslations } from '@/hooks/useTranslations'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {t.home('title')}
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home('subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
              {t.pricing('title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.pricing('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.pricing('free')}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Requires invitation code</li>
                  <li>• 3 free videos per month</li>
                  <li>• 5-second video length</li>
                  <li>• 720p video quality</li>
                  <li>• Community support</li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">Get Invitation Code</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t.pricing('plans.pro.popular')}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.pricing('pro')}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$19.99<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• 40 videos per month</li>
                  <li>• 15-second video length</li>
                  <li>• 1080p HD quality</li>
                  <li>• Priority support</li>
                  <li>• Advanced templates</li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">{t.pricing('getStarted')}</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.pricing('enterprise')}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$59.99<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• 120 videos per month</li>
                  <li>• 15-second video length</li>
                  <li>• 4K ultra-HD quality</li>
                  <li>• Dedicated account manager</li>
                  <li>• API access</li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">{t.pricing('contactSales')}</Button>
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