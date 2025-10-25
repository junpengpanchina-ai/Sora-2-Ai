import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({
  children
}: RootLayoutProps) {
  const messages = await getMessages()

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <Header />
              <main>
                {children}
              </main>
              <NotificationContainer />
              <SpeedInsights />
            </ErrorBoundary>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
