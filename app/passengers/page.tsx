import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPassengerRides } from './actions'
import PassengerDashboardClient from './passenger-client'

export default async function PassengersPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Verify user has passenger role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !roleData) {
    redirect('/')
  }

  // Redirect to correct page if wrong role
  if (roleData.role !== 'passenger') {
    if (roleData.role === 'driver') {
      redirect('/driver')
    } else if (roleData.role === 'admin') {
      redirect('/admin')
    }
  }

  // Get passenger's rides
  const rides = await getPassengerRides(user.id)

  return <PassengerDashboardClient user={user} initialRides={rides} />
}
