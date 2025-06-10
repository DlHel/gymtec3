import { auth } from '@/lib/auth'
import { getClientDetails } from './actions'
import { ClientDetailsClient } from './components/client-details-client'

interface ClientIdPageProps {
  params: {
    clientId: string
  }
}

export default async function ClientIdPage({ params }: ClientIdPageProps) {
  const { client, equipment } = await getClientDetails(params.clientId)
  const session = await auth()

  // We can assume session is not null because of middleware protection
  const userRole = session!.user.role 

  return <ClientDetailsClient client={client} equipment={equipment} userRole={userRole} />
} 