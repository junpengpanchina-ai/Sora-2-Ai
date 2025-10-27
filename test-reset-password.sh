#!/bin/bash

echo "========================================="
echo "🔧 测试密码重置功能"
echo "========================================="
echo ""

# 1. 查看当前用户
echo "📋 当前数据库中的用户："
npx prisma studio --browser none &
STUDIO_PID=$!
sleep 2

# 2. 或者使用SQLite命令行
echo ""
echo "📋 直接查询数据库："
sqlite3 prisma/dev.db "SELECT id, email, name, resetToken IS NOT NULL as hasResetToken FROM User LIMIT 5;"

echo ""
echo "========================================="
echo "测试步骤："
echo "========================================="
echo "1. 访问: http://localhost:3000/auth/forgot-password"
echo "2. 输入邮箱地址"
echo "3. 查看终端输出的重置链接"
echo "4. 复制链接并在浏览器中打开"
echo "5. 设置新密码"
echo ""
echo "或者使用Prisma Studio查看数据库："
echo "npx prisma studio"
echo ""

# 清理
if [ ! -z "$STUDIO_PID" ]; then
    kill $STUDIO_PID 2>/dev/null
fi

