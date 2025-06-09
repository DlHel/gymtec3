import { Contract } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ContractsTabProps {
  contracts: Contract[]
}

export default function ContractsTab({ contracts }: ContractsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratos y SLAs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button>Añadir Contrato</Button>
        </div>
        {contracts.length > 0 ? (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {contract.type.replace("_", " ").toLowerCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {contract.id}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    Activo
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                  <p>
                    <strong>Inicio:</strong>{" "}
                    {format(new Date(contract.startDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  <p>
                    <strong>Fin:</strong>{" "}
                    {contract.endDate 
                      ? format(new Date(contract.endDate), "d 'de' MMMM 'de' yyyy", { locale: es })
                      : "Indefinido"}
                  </p>
                </div>
                {contract.sla && (
                   <div className="mt-2 text-sm">
                     <p className="font-semibold">SLA:</p>
                     <pre className="mt-1 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
                       {JSON.stringify(JSON.parse(contract.sla), null, 2)}
                     </pre>
                   </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay contratos registrados para este cliente.</p>
        )}
      </CardContent>
    </Card>
  )
} 