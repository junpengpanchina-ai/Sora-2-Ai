import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // 这里可以添加额外的中间件逻辑
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 保护需要认证的路由
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/generate')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generate/:path*',
    '/pricing/:path*',
    '/videos/:path*'
  ]
}
