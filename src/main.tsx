import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.tsx'
import { I18nProvider } from './i18n'
import { apolloClient } from './lib/apolloClient'
import { SocketProvider } from './providers/SocketProvider'
import './index.css'

type RuntimeErrorPayload = {
  message: string
  stack?: string
  source?: 'render' | 'error' | 'promise'
}

type RuntimeGuardState = {
  error: RuntimeErrorPayload | null
}

class RuntimeGuard extends React.Component<React.PropsWithChildren, RuntimeGuardState> {
  state: RuntimeGuardState = {
    error: null,
  }

  private handleWindowError = (event: ErrorEvent) => {
    this.setState({
      error: {
        message: event.message || 'Unknown runtime error',
        stack: event.error?.stack,
        source: 'error',
      },
    })
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : JSON.stringify(reason)

    this.setState({
      error: {
        message: message || 'Unhandled promise rejection',
        stack: reason instanceof Error ? reason.stack : undefined,
        source: 'promise',
      },
    })
  }

  override componentDidCatch(error: Error) {
    this.setState({
      error: {
        message: error.message,
        stack: error.stack,
        source: 'render',
      },
    })
  }

  override componentDidMount() {
    if (!import.meta.env.DEV) {
      return
    }

    window.addEventListener('error', this.handleWindowError)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  override componentWillUnmount() {
    if (!import.meta.env.DEV) {
      return
    }

    window.removeEventListener('error', this.handleWindowError)
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  override render() {
    const { error } = this.state

    if (import.meta.env.DEV && error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '24px',
            background: '#fff7ed',
            color: '#7c2d12',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              border: '1px solid rgba(194, 65, 12, 0.18)',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 18px 48px -28px rgba(124, 45, 18, 0.45)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: '#ffedd5',
                borderBottom: '1px solid rgba(194, 65, 12, 0.15)',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Runtime error detected in development
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Source:</strong> {error.source}
              </p>
              <p style={{ margin: '12px 0 0', fontSize: '15px', lineHeight: 1.6 }}>
                {error.message}
              </p>
              {error.stack ? (
                <pre
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '14px',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    background: '#1c1917',
                    color: '#fed7aa',
                    fontSize: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  {error.stack}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <RuntimeGuard>
    <I18nProvider>
      <ApolloProvider client={apolloClient}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ApolloProvider>
    </I18nProvider>
  </RuntimeGuard>,
)
