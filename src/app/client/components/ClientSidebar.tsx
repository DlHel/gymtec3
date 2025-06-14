'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
  {
    href: '/client/dashboard',
    label: 'Mis Tickets',
    icon: Home,
  },
  {
    href: '/client/locations',
    label: 'Ubicaciones y Equipos',
    icon: MapPin,
  },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-primary">
      <div className="px-3 py-2 flex-1">
        <Link href="/client/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Portal Cliente</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                pathname === route.href ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 