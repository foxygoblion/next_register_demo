import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔵 API 路由: 接收到注册请求')
  
  try {
    const body = await request.json()
    const { username, email, password } = body
    
    // 数据验证
    if (!username || !email || !password) {
      console.log('❌ 验证失败: 缺少必填字段')
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }
    
    if (username.length < 3) {
      return NextResponse.json(
        { error: '用户名至少3个字符' },
        { status: 400 }
      )
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少6个字符' },
        { status: 400 }
      )
    }
    
    // 模拟数据库操作延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 实际项目中的操作：
    // 1. 检查用户名/邮箱是否已存在
    // const existingUser = await db.user.findUnique({ where: { email } })
    // if (existingUser) return error
    
    // 2. 加密密码
    // const hashedPassword = await bcrypt.hash(password, 10)
    
    // 3. 保存到数据库
    // const user = await db.user.create({
    //   data: { username, email, password: hashedPassword }
    // })
    
    // 4. 发送验证邮件（可选）
    // await sendVerificationEmail(email)
    
    // 5. 创建会话或返回 JWT token
    // const token = generateJWT(user.id)
    
    console.log('✅ 用户注册成功:', { username, email })
    
    // 模拟10%的失败率（测试用）
    if (Math.random() < 0.1) {
      console.log('⚠️  模拟错误: 用户名已存在')
      return NextResponse.json(
        { error: '该用户名已被注册' },
        { status: 409 }
      )
    }
    
    // 成功响应
    return NextResponse.json(
      {
        success: true,
        message: '注册成功',
        user: {
          id: Date.now(),
          username,
          email,
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('❌ API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
