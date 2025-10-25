import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // 移除数据库适配器以提高性能，使用JWT session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
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
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  callbacks: {
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
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
}
