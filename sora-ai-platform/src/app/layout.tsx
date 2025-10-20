import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import NotificationContainer from '@/components/ui/NotificationContainer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sora AI - Create Unlimited Possibilities with AI',
  description: 'Generate professional-grade video content with just one sentence. From idea to finished product in minutes.',
  keywords: ['AI video generation', 'Sora', 'video creation', 'artificial intelligence'],
  authors: [{ name: 'Sora AI Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionProvider>
            {children}
            <NotificationContainer />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}