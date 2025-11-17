import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDriverById } from '../actions'
import DriverDetailClient from './driver-detail-client'

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Verify user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !roleData || roleData.role !== 'admin') {
    redirect('/')
  }

  // Get driver details
  const driver = await getDriverById(id)

  if (!driver) {
    redirect('/admin/drivers')
  }

  return <DriverDetailClient driver={driver} adminId={user.id} />
}
