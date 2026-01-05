/**
 * Error boundary that catches React render errors and renders a fallback UI.
 * Keeps the app running instead of crashing on unhandled errors.
 */
"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--background))] p-5">
      <div className="max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">Something went wrong</h2>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-[rgb(var(--muted))]">Error details</summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-[rgba(var(--muted),0.1)] p-3 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="mt-4 rounded-full bg-[rgb(var(--foreground))] px-4 py-2 text-sm font-semibold text-[rgb(var(--background))] transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/**
 * Error Boundary class component
 * 
 * Note: Error boundaries must be class components in React
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    
    // In production, you might want to send to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

