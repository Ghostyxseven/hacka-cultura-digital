import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
