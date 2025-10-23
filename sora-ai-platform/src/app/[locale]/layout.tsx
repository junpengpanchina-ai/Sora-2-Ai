import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ErrorBoundary>
        <Header />
        <main>
          {children}
        </main>
        <NotificationContainer />
      </ErrorBoundary>
    </NextIntlClientProvider>
  )
}
