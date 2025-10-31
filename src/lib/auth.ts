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
    async jwt({ token, user, account }) {
      // 初次登录时，user 对象存在
      if (user) {
        // 确保从数据库获取完整的用户信息
        let dbUser
        try {
          dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (dbUser) {
            token.id = dbUser.id
            token.email = dbUser.email
            token.name = dbUser.name || dbUser.email
            token.image = dbUser.image
          } else {
            // 如果数据库中没有（不应该发生），使用 user 对象
            token.id = user.id
            token.email = user.email
            token.name = user.name || user.email
            token.image = user.image
          }
          
          console.log('✅ JWT token 设置完成:', {
            id: token.id,
            email: token.email
          })
        } catch (error) {
          console.error('❌ 获取用户信息失败:', error)
          // 即使出错也设置基本信息
          token.id = user.id
          token.email = user.email
          token.name = user.name || user.email
          token.image = user.image
        }
      }
      
      // 如果 token 中没有 id，尝试从数据库获取（用于刷新时）
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string }
          })
          if (dbUser) {
            token.id = dbUser.id
            token.name = dbUser.name || dbUser.email
            token.image = dbUser.image
          }
        } catch (error) {
          console.error('❌ 刷新 token 时获取用户信息失败:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && token.email) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = (token.name as string) || token.email as string
        session.user.image = (token.image as string) || null
        
        console.log('✅ Session 设置完成:', {
          id: session.user.id,
          email: session.user.email
        })
      } else {
        console.warn('⚠️ Session token 中缺少必要信息:', { token })
      }
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30天
      },
    },
  },
}
