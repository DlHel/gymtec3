import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')
  
  // Limpiar la base de datos
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.partUsage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.knowledgeBaseEntry.deleteMany();
  await prisma.part.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.location.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.serviceLevelAgreement.deleteMany(); 
  await prisma.client.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  console.log('🧹 Base de datos limpiada...')

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gymtec.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const techPassword = await bcrypt.hash('tech123', 10)
  const techUser = await prisma.user.create({
    data: {
      email: 'tecnico@gymtec.com',
      name: 'Juan Técnico',
      password: techPassword,
      role: 'TECHNICIAN',
    },
  })

  console.log('✅ Usuarios creados (admin y técnico)')

  // Crear clientes
  const client1 = await prisma.client.create({
    data: {
      name: 'Gimnasio Central',
      rut: '12345678-9',
      email: 'contacto@gimnasiocentral.com',
      phone: '+56912345678',
      address: 'Av. Principal 123, Santiago',
    },
  })

  // Crear usuario para el cliente
  const clientPassword = await bcrypt.hash('cliente123', 10)
  const clientUser = await prisma.user.create({
    data: {
      email: 'cliente@gimnasiocentral.com',
      name: 'Usuario Gimnasio Central',
      password: clientPassword,
      role: 'CLIENT',
      clientId: client1.id, // Vinculando con el cliente
    },
  })
  
  console.log('✅ Usuario cliente creado y vinculado')

  const client2 = await prisma.client.create({
    data: {
      name: 'Fitness Plus',
      rut: '87654321-0',
      email: 'info@fitnessplus.com',
      phone: '+56987654321',
      address: 'Calle Secundaria 456, Valparaíso',
    },
  })

  console.log('✅ Clientes creados')

  // Crear ubicaciones
  const location1 = await prisma.location.create({
    data: {
      name: 'Sede Principal',
      address: 'Av. Principal 123, Santiago',
      phone: '+56912345678',
      clientId: client1.id,
    },
  })

  const location2 = await prisma.location.create({
    data: {
      name: 'Sucursal Norte',
      address: 'Calle Norte 789, Santiago',
      phone: '+56912345679',
      clientId: client1.id,
    },
  })

  const location3 = await prisma.location.create({
    data: {
      name: 'Sede Única',
      address: 'Calle Secundaria 456, Valparaíso',
      phone: '+56987654321',
      clientId: client2.id,
    },
  })

  console.log('✅ Ubicaciones creadas')

  // Crear equipos
  const equipment1 = await prisma.equipment.create({
    data: {
      model: 'Cinta Trotadora Pro X1',
      brand: 'Gymtec',
      serialNumber: 'CT-001-2024',
      locationId: location1.id,
    },
  })

  const equipment2 = await prisma.equipment.create({
    data: {
      model: 'Bicicleta Estática Elite',
      brand: 'Gymtec',
      serialNumber: 'BE-002-2024',
      locationId: location1.id,
    },
  })

  const equipment3 = await prisma.equipment.create({
    data: {
      model: 'Elíptica Advanced',
      brand: 'Gymtec',
      serialNumber: 'EL-003-2024',
      locationId: location2.id,
    },
  })

  console.log('✅ Equipos creados')

  // Crear SLA de prueba
  const standardSla = await prisma.serviceLevelAgreement.create({
    data: {
      name: 'SLA Estándar',
      description: 'Tiempo de respuesta de 8 horas, resolución en 48 horas.',
      responseTimeHours: 8,
      resolutionTimeHours: 48,
    },
  })

  console.log('✅ SLA creado')

  // Crear contratos
  await prisma.contract.create({
    data: {
      contractNumber: 'CTR-001',
      clientId: client1.id,
      type: 'FIXED_RATE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      slaId: standardSla.id,
    },
  })

  await prisma.contract.create({
    data: {
      contractNumber: 'CTR-002',
      clientId: client2.id,
      type: 'PER_VISIT',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      slaId: standardSla.id,
    },
  })

  console.log('✅ Contratos creados')

  // Crear Proveedor
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Proveedor de Repuestos Global',
    },
  })
  console.log('✅ Proveedor creado')

  // Crear repuestos
  const part1 = await prisma.part.create({
    data: {
      name: 'Correa de Transmisión',
      sku: 'CT-BELT-001',
      cost: 25000,
      stock: 15,
      minStock: 5,
      supplierId: supplier1.id,
    },
  })

  const part2 = await prisma.part.create({
    data: {
      name: 'Motor Eléctrico 2HP',
      sku: 'MOTOR-2HP-001',
      cost: 150000,
      stock: 3,
      minStock: 2,
      supplierId: supplier1.id,
    },
  })

  const part3 = await prisma.part.create({
    data: {
      name: 'Sensor de Velocidad',
      sku: 'SENSOR-VEL-001',
      cost: 35000,
      stock: 8,
      minStock: 3,
      supplierId: supplier1.id,
    },
  })

  console.log('✅ Repuestos creados y vinculados a proveedor')

  // Crear tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Mantenimiento Preventivo Cinta Trotadora',
      description: 'Realizar mantenimiento preventivo mensual según protocolo',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      clientId: client1.id,
      equipmentId: equipment1.id,
      assignedToId: techUser.id,
      createdById: adminUser.id,
    },
  })

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Reparación Bicicleta Estática - Ruido Extraño',
      description: 'Cliente reporta ruido extraño en la bicicleta estática durante el uso',
      status: 'OPEN',
      priority: 'HIGH',
      clientId: client1.id,
      equipmentId: equipment2.id,
      assignedToId: techUser.id,
      createdById: adminUser.id,
    },
  })

  console.log('✅ Tickets creados')

  // Crear uso de repuestos
  await prisma.partUsage.create({
    data: {
      ticketId: ticket1.id,
      partId: part1.id,
      quantity: 1,
    },
  })

  console.log('✅ Uso de repuestos creado')

  // Crear entradas de tiempo
  await prisma.timeEntry.create({
    data: {
      userId: techUser.id,
      ticketId: ticket1.id,
      hours: 4,
      description: "Mantenimiento preventivo equipos sede principal",
    },
  })

  console.log('✅ Entradas de tiempo creadas')

  // Crear Base de Conocimiento
  const kbEntry = await prisma.knowledgeBaseEntry.create({
    data: {
        modelName: 'Cinta Trotadora Pro X1',
        description: 'Manuales y checklists para la cinta trotadora modelo Pro X1 de Gymtec.'
    }
  })

  await prisma.checklist.create({
    data: {
        name: 'Mantenimiento Preventivo Mensual',
        knowledgeBaseId: kbEntry.id,
        tasks: JSON.stringify([
            { id: "task-1", text: "Verificar y ajustar la tensión de la banda." },
            { id: "task-2", text: "Limpiar la superficie de la banda y el área del motor." },
            { id: "task-3", text: "Lubricar la plataforma debajo de la banda según especificaciones." },
            { id: "task-4", text: "Inspeccionar el cable de alimentación y el enchufe." },
            { id: "task-5", text: "Calibrar la velocidad y la inclinación." },
            { id: "task-6", text: "Revisar y apretar todos los pernos y tornillos." },
        ])
    }
  })

  console.log('✅ Base de conocimiento creada')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 