"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, CircuitBoard } from "lucide-react"

const inventoryNav = [
    { href: "/dashboard/inventory/parts", label: "Repuestos", icon: Package },
    { href: "/dashboard/inventory/equipment", label: "Equipos", icon: CircuitBoard },
]

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>
            <div className="flex border-b mb-6">
                {inventoryNav.map(item => (
                    <Link key={item.href} href={item.href} passHref>
                        <div className={cn(
                            "flex items-center px-4 py-2 text-lg font-medium cursor-pointer",
                            pathname === item.href 
                                ? "border-b-2 border-blue-500 text-blue-600" 
                                : "text-gray-500 hover:text-gray-700"
                        )}>
                            <item.icon className="mr-2 h-5 w-5" />
                            {item.label}
                        </div>
                    </Link>
                ))}
            </div>
            {children}
        </div>
    )
} 