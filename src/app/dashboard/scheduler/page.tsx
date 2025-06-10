'use client'

import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import { getTickets } from '../tickets/actions'
import { TicketWithRelations } from '../tickets/components/columns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Lunes
  getDay,
  locales,
})

interface TicketEvent extends Event {
  resource: TicketWithRelations
}

export default function SchedulerPage() {
  const [events, setEvents] = useState<TicketEvent[]>([])
  const router = useRouter()

  useEffect(() => {
    getTickets().then(tickets => {
      const ticketEvents = tickets.map(ticket => {
        const startDate = new Date(ticket.createdAt)
        let endDate = new Date(startDate)

        if (ticket.contract?.sla) {
          endDate.setHours(startDate.getHours() + ticket.contract.sla.resolutionTimeHours)
        } else {
          endDate.setHours(startDate.getHours() + 24) // Duración por defecto si no hay SLA
        }

        return {
          title: `${ticket.title} - ${ticket.client.name}`,
          start: startDate,
          end: endDate,
          resource: ticket,
        }
      })
      setEvents(ticketEvents)
    })
  }, [])

  const handleSelectEvent = (event: TicketEvent) => {
    router.push(`/dashboard/tickets/${event.resource.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Planificador de Servicios"
        description="Visualiza los tickets de servicio en un calendario."
      />
      <Separator />
      <div className="h-[75vh] bg-white p-4 rounded-md shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture='es'
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            showMore: total => `+ Ver más (${total})`
          }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  )
} 