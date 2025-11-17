import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllDrivers } from './actions'
import DriversListClient from './drivers-client'

export default async function DriversListPage() {
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

  // Get all drivers
  const drivers = await getAllDrivers()

  return <DriversListClient drivers={drivers} />
}
