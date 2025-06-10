'use client'
import { Ticket, Contract, SLA } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSlaStatus } from "@/lib/sla";

type TicketWithSlaData = Ticket & {
  contract: (Contract & { sla: SLA | null }) | null;
};

export const SlaIndicator = ({ ticket }: { ticket: TicketWithSlaData }) => {
  const { status, message } = getSlaStatus(ticket);

  const colorMap = {
    'OK': 'bg-green-500',
    'AT_RISK': 'bg-yellow-500',
    'BREACHED': 'bg-red-500',
    'N/A': 'bg-gray-300'
  };

  const colorClass = colorMap[status as keyof typeof colorMap];

  if (status === 'N/A') {
    return <span className="text-gray-500">N/A</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`h-3 w-3 rounded-full ${colorClass}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 