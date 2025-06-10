import { Ticket, Contract, SLA } from "@prisma/client";

type TicketWithSlaData = Ticket & {
  contract: (Contract & { sla: SLA | null }) | null;
};

export const getSlaStatus = (ticket: TicketWithSlaData) => {
  if (!ticket.contract?.sla || ['CLOSED', 'PENDING_APPROVAL'].includes(ticket.status)) {
    return { status: 'N/A', message: 'El ticket está cerrado o no tiene un SLA aplicable.' };
  }

  const sla = ticket.contract.sla;
  const createdAt = new Date(ticket.createdAt);
  const now = new Date();
  
  const resolutionTimeMillis = sla.resolutionTimeHours * 60 * 60 * 1000;
  const timeElapsed = now.getTime() - createdAt.getTime();

  const deadline = new Date(createdAt.getTime() + resolutionTimeMillis);
  const timeLeft = deadline.getTime() - now.getTime();
  const hoursLeft = (timeLeft / (1000 * 60 * 60)).toFixed(1);

  if (timeElapsed > resolutionTimeMillis) {
    return { status: 'BREACHED', message: `SLA incumplido. Tiempo de resolución excedido.` };
  }

  const riskThreshold = resolutionTimeMillis * 0.75;
  if (timeElapsed > riskThreshold) {
    return { status: 'AT_RISK', message: `SLA en riesgo. Quedan menos de ${hoursLeft} horas para resolver.` };
  }

  return { status: 'OK', message: `SLA cumplido. Quedan ${hoursLeft} horas.` };
}; 