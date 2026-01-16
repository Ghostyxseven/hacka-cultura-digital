import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundaryWrapper } from '@/components'

export const metadata: Metadata = {
  title: 'Hacka Cultura Digital - Sistema de Materiais Didáticos',
  description: 'Sistema inteligente para geração de materiais didáticos de Cultura Digital alinhados à BNCC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        <ErrorBoundaryWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundaryWrapper>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
