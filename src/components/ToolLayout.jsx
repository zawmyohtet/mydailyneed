import { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SEO from './SEO'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} className="text-red-600 dark:text-red-400 text-xl" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200">Something went wrong</h3>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function ToolLayout({ title, icon, description, path, keywords, children }) {
  return (
    <ErrorBoundary>
      <SEO
        title={title}
        description={description}
        keywords={keywords?.join(', ')}
        path={path}
      />
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          {icon && <FontAwesomeIcon icon={icon} className="text-2xl text-primary-600" />}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
        {children}
      </div>
    </ErrorBoundary>
  )
}
