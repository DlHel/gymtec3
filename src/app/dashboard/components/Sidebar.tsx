'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Ticket, Users, Package, BookOpen, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLinkProps {
    href: string
    label: string
    icon: React.ElementType
}

const DashboardLink: React.FC<DashboardLinkProps> = ({ href, label, icon: Icon }) => {
    const pathname = usePathname()
    const isActive = pathname.startsWith(href)

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "text-primary bg-muted"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}

export function Sidebar() {
    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard/dashboard" className="flex items-center gap-2 font-semibold">
                    <span>Gymtec</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <DashboardLink href="/dashboard/dashboard" label="Dashboard" icon={Home} />
                    <DashboardLink href="/dashboard/tickets" label="Tickets" icon={Ticket} />
                    <DashboardLink href="/dashboard/(dashboard)/clients" label="Clientes" icon={Users} />
                    <DashboardLink href="/dashboard/inventory/equipment" label="Inventario" icon={Package} />
                    <DashboardLink href="/dashboard/knowledge-base" label="Base de Conocimiento" icon={BookOpen} />
                    <DashboardLink href="/dashboard/finance" label="Finanzas" icon={DollarSign} />
                </nav>
            </div>
        </div>
    )
} 