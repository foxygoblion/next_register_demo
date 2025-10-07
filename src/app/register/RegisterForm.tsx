// ============================================
// 3. 注册表单（客户端组件）
// 路径: src/app/register/RegisterForm.tsx
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface RegisterFormProps {
  suggestedUsername: string
  serverTime: string
}

export default function RegisterForm({ 
  suggestedUsername, 
  serverTime 
}: RegisterFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    username: suggestedUsername,
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  
  const [isHydrated, setIsHydrated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // 水合过程
  useEffect(() => {
    console.log('💧 客户端水合完成')
    console.log('📦 接收到的服务器数据:', { 
      suggestedUsername, 
      serverTime: new Date(serverTime).toLocaleString() 
    })
    setIsHydrated(true)
  }, [suggestedUsername, serverTime])

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符'
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '请同意用户协议'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitResult(null)
    console.log('📤 发送注册请求到 /api/register')
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })
      
      const data = await response.json()
      console.log('✅ 服务器响应:', data)
      
      if (response.ok) {
        setSubmitResult({
          type: 'success',
          message: '注册成功！即将跳转...'
        })
        
        // 2秒后跳转到首页
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setSubmitResult({
          type: 'error',
          message: data.error || '注册失败，请重试'
        })
      }
    } catch (error) {
      console.error('❌ 请求失败:', error)
      setSubmitResult({
        type: 'error',
        message: '网络错误，请检查连接后重试'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div>
      {/* 水合状态指示器 */}
      <div className={`mb-4 p-3 rounded-lg border transition-all ${
        isHydrated 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            isHydrated ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}></div>
          <span className={`font-medium ${
            isHydrated ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {isHydrated ? '✅ 客户端已激活（可交互）' : '⏳ 等待 JavaScript 加载...'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* 用户名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            用户名
            <span className="text-xs text-blue-600 ml-2">
              (服务器端随机生成)
            </span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isHydrated}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } ${!isHydrated ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            placeholder="请输入用户名"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱地址
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isHydrated}
            placeholder="your@email.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } ${!isHydrated ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* 密码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={!isHydrated}
            placeholder="至少6个字符"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } ${!isHydrated ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* 确认密码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            确认密码
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={!isHydrated}
            placeholder="再次输入密码"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } ${!isHydrated ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 用户协议 */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={!isHydrated}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              我已阅读并同意
              <a href="#" className="text-blue-600 hover:underline mx-1">用户协议</a>
              和
              <a href="#" className="text-blue-600 hover:underline ml-1">隐私政策</a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-red-500 text-xs mt-1 ml-6">{errors.agreeTerms}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!isHydrated || isSubmitting}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            !isHydrated || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              注册中...
            </span>
          ) : '立即注册'}
        </button>

        {/* 提交结果提示 */}
        {submitResult && (
          <div className={`p-4 rounded-lg border ${
            submitResult.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <p className="text-sm font-medium">{submitResult.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
