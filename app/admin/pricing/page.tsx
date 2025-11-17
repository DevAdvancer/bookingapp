import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPricingSettings } from './actions'
import PricingManagementClient from './pricing-client'

export default async function PricingManagementPage() {
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

  // Get current pricing settings
  const pricingSettings = await getPricingSettings()

  return <PricingManagementClient user={user} initialSettings={pricingSettings} />
}
