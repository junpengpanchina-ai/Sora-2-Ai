import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import NotificationContainer from '@/components/ui/NotificationContainer'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  // 验证语言是否支持
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // 获取消息
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main>
              {children}
            </main>
            <NotificationContainer />
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
