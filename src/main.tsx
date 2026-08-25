import "./i18n";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback'

// Clear the auto-reload flag on successful app boot
sessionStorage.removeItem('chunk_reload');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
