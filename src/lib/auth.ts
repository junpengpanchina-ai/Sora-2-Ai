import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 认证开始:', { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ 缺少凭据')
          return null
        }

        try {
          // 从数据库查找用户
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('👤 用户查找结果:', user ? '找到用户' : '未找到用户')

          if (!user || !user.password) {
            console.log('❌ 用户不存在或没有密码')
            return null
          }

          // 验证密码
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          console.log('🔑 密码验证结果:', isValidPassword ? '成功' : '失败')
          
          if (!isValidPassword) {
            console.log('❌ 密码验证失败')
            return null
          }

          console.log('✅ 认证成功:', user.email)
          
          // 返回用户对象，确保包含所有必要字段
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            image: user.image || null,
          }
        } catch (error) {
          console.error('❌ 认证过程出错:', error)
          return null
        }
      }
    }),
    // 只有当 Google 凭据配置正确时才启用 Google 提供者
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET && 
        process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" && 
        process.env.GOOGLE_CLIENT_SECRET !== "your-google-client-secret" 
        ? [GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })]
        : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 Google OAuth 登录回调:', { 
        email: user.email, 
        provider: account?.provider,
        hasProfile: !!profile 
      })

      if (account?.provider === 'google') {
        try {
          // 检查用户是否已存在
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // 创建新用户
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!,
                image: user.image,
                emailVerified: new Date(),
                // Google OAuth 用户不需要密码
                password: null,
              }
            })
            console.log('✅ 创建新Google用户:', newUser.email)
          } else {
            console.log('✅ 现有Google用户登录:', existingUser.email)
          }
          
          return true
        } catch (error) {
          console.error('❌ Google OAuth 用户创建失败:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
}
