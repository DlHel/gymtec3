'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  Warehouse,
  Wrench,
  DollarSign,
  FileText,
  Truck,
  Book,
  Settings,
  LucideIcon,
} from 'lucide-react'

interface NavLink {
  title: string
  href: string
  icon: LucideIcon
}

interface NavGroup {
  title: string
  icon: LucideIcon
  links: NavLink[]
}

const navGroups: NavGroup[] = [
  {
    title: 'General',
    icon: LayoutDashboard,
    links: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Gestión',
    icon: ClipboardList,
    links: [
      {
        title: 'Tickets',
        href: '/dashboard/tickets',
        icon: ClipboardList,
      },
      {
        title: 'Clientes',
        href: '/dashboard/clients',
        icon: Users,
      },
       {
        title: 'Calendario',
        href: '/dashboard/scheduler',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Inventario',
    icon: Warehouse,
    links: [
      {
        title: 'Equipos',
        href: '/dashboard/inventory/equipment',
        icon: Wrench,
      },
      {
        title: 'Repuestos',
        href: '/dashboard/inventory/parts',
        icon: Warehouse,
      },
    ],
  },
  {
    title: 'Finanzas',
    icon: DollarSign,
    links: [
      {
        title: 'Cotizaciones',
        href: '/dashboard/finance/quotes',
        icon: FileText,
      },
      {
        title: 'Órdenes de Compra',
        href: '/dashboard/finance/purchase-orders',
        icon: Truck,
      },
       {
        title: 'Proveedores',
        href: '/dashboard/finance/suppliers',
        icon: Users,
      },
    ],
  },
  {
    title: 'Administración',
    icon: Settings,
    links: [
      {
        title: 'Base de Conocimiento',
        href: '/dashboard/knowledge-base',
        icon: Book,
      },
      {
        title: 'Configuración SLA',
        href: '/dashboard/settings/sla',
        icon: Settings,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-primary border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <Wrench className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">GymTec</h1>
        </Link>
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h2 className="px-4 text-lg font-semibold tracking-tight mb-2">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn(
                    'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
                  )}
                >
                  <div className="flex items-center flex-1">
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.title}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

 