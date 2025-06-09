import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Bienvenido a Gymtec ERP
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema de gestión empresarial completo para Gymtec. 
            Gestiona clientes, contratos, inventario, tickets y mucho más.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Gestión de Clientes</h3>
              <p className="text-gray-600 mb-4">
                Administra información de clientes, contratos y ubicaciones
              </p>
              <Link href="/dashboard/clients">
                <Button className="w-full">Ver Clientes</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Sistema de Tickets</h3>
              <p className="text-gray-600 mb-4">
                Gestiona solicitudes de servicio y seguimiento de trabajos
              </p>
              <Link href="/dashboard/tickets">
                <Button className="w-full">Ver Tickets</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Inventario</h3>
              <p className="text-gray-600 mb-4">
                Control de repuestos, stock y gestión de inventario
              </p>
              <Link href="/dashboard/inventory">
                <Button className="w-full">Ver Inventario</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-3">
                Acceder al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 