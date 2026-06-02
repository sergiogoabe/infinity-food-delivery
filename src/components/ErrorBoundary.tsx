"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-secondary mb-2">Ops! Algo deu errado</h1>
              <p className="text-gray-500 mb-6">Tente recarregar a página</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Recarregar
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
