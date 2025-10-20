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

      const ErrorContent: React.FC<{ error?: Error; onRetry: () => void }> = ({ error, onRetry }) => {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="p-8 max-w-md w-full text-center">
              <div className="mb-6">
                <Icon name="alert-triangle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Please try again.
                </p>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>• Check your internet connection</p>
                  <p>• Try again in a few moments</p>
                  <p>• Contact support if the problem persists</p>
                </div>
                {process.env.NODE_ENV === 'development' && error && (
                  <details className="text-left text-sm text-gray-500 mb-4">
                    <summary className="cursor-pointer">Error Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                      {error.message}
                    </pre>
                  </details>
                )}
              </div>

              <div className="space-y-3">
                <Button onClick={onRetry} className="w-full">
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="w-full"
                >
                  Refresh Page
                </Button>
              </div>
            </Card>
          </div>
        )
      }

      return <ErrorContent error={this.state.error} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}
