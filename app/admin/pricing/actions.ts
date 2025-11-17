'use server'

import { createClient } from '@/lib/supabase/server'
import type { PricingSettings } from '@/lib/types/admin'

/**
 * Get current pricing settings
 */
export async function getPricingSettings(): Promise<PricingSettings | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('pricing_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching pricing settings:', error)
      return null
    }

    return data as PricingSettings
  } catch (error) {
    console.error('Error in getPricingSettings:', error)
    return null
  }
}

/**
 * Update pricing settings
 */
export async function updatePricingSettings(
  adminId: string,
  data: Partial<PricingSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Validate inputs
    if (data.petrol_price_per_liter !== undefined && data.petrol_price_per_liter < 0) {
      return { success: false, error: 'Petrol price must be positive' }
    }
    if (data.price_per_km !== undefined && data.price_per_km < 0) {
      return { success: false, error: 'Price per km must be positive' }
    }
    if (data.driver_cost_per_ride !== undefined && data.driver_cost_per_ride < 0) {
      return { success: false, error: 'Driver cost must be positive' }
    }
    if (data.office_time_price_multiplier !== undefined && data.office_time_price_multiplier < 0) {
      return { success: false, error: 'Office time multiplier must be positive' }
    }

    // Get current settings
    const { data: currentSettings } = await supabase
      .from('pricing_settings')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!currentSettings) {
      return { success: false, error: 'No pricing settings found' }
    }

    // Update settings
    const { error } = await supabase
      .from('pricing_settings')
      .update({
        ...data,
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentSettings.id)

    if (error) {
      console.error('Error updating pricing settings:', error)
      return { success: false, error: 'Failed to update pricing settings' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updatePricingSettings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
