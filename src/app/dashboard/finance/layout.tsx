"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navLinks = [
        { name: "Proveedores", href: "/dashboard/finance/suppliers" },
        { name: "Órdenes de Compra", href: "/dashboard/finance/purchase-orders" },
        { name: "Cotizaciones", href: "/dashboard/finance/quotes" },
    ];

    return (
        <div className="flex">
            <aside className="w-64 flex-shrink-0 border-r pr-6">
                <nav className="flex flex-col space-y-2">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                            <span className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                pathname === link.href ? "bg-accent" : "transparent"
                            )}>
                                {link.name}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}