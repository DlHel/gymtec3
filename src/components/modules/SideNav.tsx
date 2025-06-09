"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Users, Wrench, Package, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: BarChart, label: "Dashboard" },
  { href: "/dashboard/clients", icon: Users, label: "Clientes" },
  // { href: "/dashboard/tickets", icon: Wrench, label: "Tickets" }, // Comentado temporalmente
  { href: "/dashboard/inventory", icon: Package, label: "Inventario" },
  { href: "/dashboard/knowledge-base", icon: BrainCircuit, label: "Base de Conocimiento" },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Gymtec ERP</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="px-4 py-2">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center p-2 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
} 