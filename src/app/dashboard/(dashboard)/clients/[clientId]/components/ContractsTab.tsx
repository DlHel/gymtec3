import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Importamos todos los tipos de Prisma bajo un espacio de nombres
import * as PrismaClientTypes from '@prisma/client';
import { format } from 'date-fns';

// Definimos un tipo para el contrato que explícitamente incluye la relación 'sla'.
// Usamos un tipo de intersección (&) para combinar las propiedades de PrismaClientTypes.Contract
// con nuestra propiedad 'sla' opcional.
type ContractWithSla = PrismaClientTypes.Contract & {
  sla?: PrismaClientTypes.ServiceLevelAgreement | null; // La relación 'sla' puede o no estar presente
};

interface ContractsTabProps {
  contracts: ContractWithSla[]; // El componente espera un array de estos contratos enriquecidos
}

export function ContractsTab({ contracts }: ContractsTabProps) {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        Este cliente no tiene contratos registrados.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardHeader>
            <CardTitle>Contrato {contract.type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Inicio:</strong>{' '}
              {format(new Date(contract.startDate), 'dd/MM/yyyy')}
            </p>
            {contract.endDate && (
              <p className="text-sm">
                <strong>Fin:</strong>{' '}
                {format(new Date(contract.endDate), 'dd/MM/yyyy')}
              </p>
            )}
            <div className="space-y-1 pt-2">
              <h4 className="font-semibold">SLA</h4>
              <pre className="text-xs bg-muted p-2 rounded-md whitespace-pre-wrap">
                {contract.sla?.name || 'SLA no especificado'}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}