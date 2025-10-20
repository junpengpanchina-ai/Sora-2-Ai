// 启用国际化：支持英文与中文，英文为默认兜底
export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

// 为 next-intl 提供请求期的 messages（SSR/路由级别）
export default function getRequestConfig({ locale }: { locale: Locale }) {
  // 采用静态导入，便于打包优化与类型约束
  // 注意：messages 结构需与组件中使用的 key 对齐
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messages = locale === 'zh'
    ? require('../messages/zh.json')
    : require('../messages/en.json')

  return {
    messages
  }
}
