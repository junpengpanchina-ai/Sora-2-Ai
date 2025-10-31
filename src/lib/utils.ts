import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function isSimpleAuthCompatEnabled(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    const serverFlag = process.env.SIMPLE_AUTH_COMPAT;
    if (serverFlag !== undefined) {
      return serverFlag === 'true' || serverFlag === '1';
    }
  }
  if (typeof window !== 'undefined') {
    const clientFlag = (process?.env?.NEXT_PUBLIC_SIMPLE_AUTH_COMPAT as string) || '';
    return clientFlag === 'true' || clientFlag === '1';
  }
  return false;
}
