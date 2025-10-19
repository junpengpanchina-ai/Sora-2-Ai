import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import NotificationContainer from '@/components/ui/NotificationContainer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sora AI - 用AI创造无限可能',
  description: '只需一句话，让AI为您生成专业级视频内容。从创意到成品，只需几分钟。',
  keywords: ['AI视频生成', 'Sora', '视频制作', '人工智能'],
  authors: [{ name: 'Sora AI Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
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