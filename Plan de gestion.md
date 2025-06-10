Página/Vista 2: Detalle del Ticket

Función: Espacio de trabajo para un ticket específico.

Componentes: Panel de información, cronología de comentarios, panel de acciones, sección para completar el "Checklist de Trabajo", y sección para registrar "Repuestos Utilizados" (descontando automáticamente del inventario).

Lógica: 
Al crear un ticket, el sistema aplicará automáticamente el SLA del contrato del cliente, iniciando los temporizadores.
El código del ticket (`ticketNumber`) se generará automáticamente con el formato `LLLL-DDYY-CCCC`, donde `LLLL` son los últimos 4 caracteres del ID del cliente, `DDYY` son el día y los dos últimos dígitos del año, y `CCCC` es un número correlativo que se reinicia diariamente.

Página/Vista 3: Planificador de Servicios (Scheduler)

Función: Vista visual (Calendario/Gantt) para que el administrador asigne y programe los trabajos de los técnicos. 