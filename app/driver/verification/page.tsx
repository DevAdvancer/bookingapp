import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDriverProfile } from '../actions'
import DriverVerificationClient from './verification-client'

export default async function DriverVerificationPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Verify user has driver role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !roleData) {
    redirect('/')
  }

  // Redirect to correct page if wrong role
  if (roleData.role !== 'driver') {
    if (roleData.role === 'passenger') {
      redirect('/passengers')
    } else if (roleData.role === 'admin') {
      redirect('/admin')
    }
  }

  // Get driver profile
  const profile = await getDriverProfile(user.id)

  return <DriverVerificationClient user={user} profile={profile} />
}
