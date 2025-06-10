'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export async function getEquipmentDetails(equipmentId: string) {
  const session = await auth()
  const userRole = session?.user.role

  if (!userRole) {
    // Should be protected by middleware
    notFound()
  }

  const equipment = await prisma.equipment.findUnique({
    where: {
      id: equipmentId,
    },
    include: {
      location: {
        include: {
          client: true,
        },
      },
      tickets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!equipment) {
    notFound()
  }

  // Hide cost for non-admin users
  if (userRole !== 'ADMIN') {
    equipment.cost = null
  }

  return equipment
} 