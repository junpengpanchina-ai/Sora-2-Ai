'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Icon } from './Icon'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <Icon name="alert-triangle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                出了点问题
              </h2>
              <p className="text-gray-600 mb-4">
                我们遇到了意外错误。请重试。
              </p>
              <div className="text-sm text-gray-500 mb-4 space-y-1">
                <p>• 检查您的互联网连接</p>
                <p>• 稍后再试</p>
                <p>• 如果问题仍然存在，请联系支持人员</p>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-sm text-gray-500 mb-4">
                  <summary className="cursor-pointer">错误详细信息</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full">
                再试一次
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="w-full"
              >
                刷新页面
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
