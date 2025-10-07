import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          欢迎来到我的网站
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          开始您的旅程
        </p>
        
        <div className="flex gap-4 justify-center">
          {/* Next.js 路由跳转 - 使用 Link 组件 */}
          <Link 
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            立即注册
          </Link>
          
          <Link 
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            已有账号？登录
          </Link>
        </div>
      </div>
    </div>
  )
}
