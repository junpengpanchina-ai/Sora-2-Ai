import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import NotificationContainer from '@/components/ui/NotificationContainer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AIThemeProvider } from '@/components/theme/AIThemeProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AuthDebugPanel from '@/components/auth/AuthDebugPanel'
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
          <AIThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <ErrorBoundary>
                <Header />
                <main>
                  {children}
                </main>
                <NotificationContainer />
                <SpeedInsights />
                <AuthDebugPanel />
              </ErrorBoundary>
            </NextIntlClientProvider>
          </AIThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
