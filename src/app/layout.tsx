import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './AuthProvider'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gymtec ERP - Sistema de Gestión Empresarial',
  description: 'Sistema de gestión empresarial completo para Gymtec. Gestiona clientes, contratos, inventario, tickets y más.',
  keywords: 'ERP, gestión empresarial, tickets, inventario, clientes, Gymtec',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 