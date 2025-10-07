// ============================================
// 2. 注册页面（服务器组件）
// 路径: src/app/register/page.tsx
// ============================================

import RegisterForm from './RegisterForm'
import Link from 'next/link'

// 服务器端生成随机用户名
async function generateRandomUsername() {
  const adjectives = ['快乐的', '聪明的', '勇敢的', '友善的', '活泼的', '可爱的']
  const nouns = ['熊猫', '老虎', '狮子', '大象', '海豚', '企鹅']
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 9999)
  
  return `${adj}${noun}${number}`
}

export default async function RegisterPage() {
  // 服务器端执行
  const suggestedUsername = await generateRandomUsername()
  const serverTime = new Date().toISOString()
  
  // 服务器日志（在终端可见）
  console.log('🖥️  服务器端渲染注册页面:', { 
    suggestedUsername, 
    time: new Date(serverTime).toLocaleString() 
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* 返回主页链接 */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← 返回首页
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            创建新账号
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            服务器渲染时间: {new Date(serverTime).toLocaleString('zh-CN')}
          </p>
          
          {/* 将服务器数据传递给客户端组件 */}
          <RegisterForm 
            suggestedUsername={suggestedUsername}
            serverTime={serverTime}
          />
          
          <p className="text-center text-sm text-gray-600 mt-6">
            已有账号？
            <Link href="/login" className="text-blue-600 hover:underline ml-1">
              立即登录
            </Link>
          </p>
        </div>
        
        {/* 水合过程说明 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">
            💧 水合过程观察
          </h3>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>✅ 服务器已生成 HTML（包含随机用户名）</li>
            <li>⏳ JavaScript 正在加载...</li>
            <li>💧 React 将接管并激活表单交互</li>
            <li>🎯 完成后表单即可输入和提交</li>
          </ol>
        </div>
      </div>
    </div>
  )
}