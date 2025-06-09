"use client"

import { Part } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LowStockPartsProps {
    parts: Part[];
}

export default function LowStockParts({ parts }: LowStockPartsProps) {
    if (parts.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No hay repuestos con bajo stock.</p>
                </CardContent>
            </Card>
        )
    }
    return (
        <Card>
            <CardContent className="p-4 space-y-3">
                {parts.map(part => (
                    <div key={part.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                        <div>
                            <Link href={`/dashboard/inventory/parts/edit/${part.id}`} className="font-semibold text-blue-600 hover:underline">
                                {part.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                SKU: {part.sku || 'N/A'}
                            </p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-red-500">{part.stock}</p>
                           <p className="text-xs text-muted-foreground">Min: {part.minStock}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
} 