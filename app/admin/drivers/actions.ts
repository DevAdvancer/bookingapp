'use server'

import { createClient } from '@/lib/supabase/server'
import type { DriverWithProfile } from '@/lib/types/admin'

/**
 * Get all drivers with their profiles
 */
export async function getAllDrivers(): Promise<DriverWithProfile[]> {
  try {
    const supabase = await createClient()

    // Use the view that includes email
    const { data: profiles, error: profilesError } = await supabase
      .from('driver_profiles_with_email')
      .select('*')

    if (profilesError) {
      console.error('Error fetching driver profiles:', profilesError)
      return []
    }

    if (!profiles || profiles.length === 0) {
      return []
    }

    // Map to DriverWithProfile format
    const drivers: DriverWithProfile[] = profiles.map((profile: any) => ({
      user_id: profile.user_id,
      email: profile.email || 'No email',
      driver_profile: {
        id: profile.id,
        user_id: profile.user_id,
        phone: profile.phone,
        gender: profile.gender,
        government_id_url: profile.government_id_url,
        selfie_url: profile.selfie_url,
        driving_license_url: profile.driving_license_url,
        car_rc_url: profile.car_rc_url,
        number_plate_url: profile.number_plate_url,
        car_photos_urls: profile.car_photos_urls,
        government_id_uploaded_at: profile.government_id_uploaded_at,
        selfie_uploaded_at: profile.selfie_uploaded_at,
        driving_license_uploaded_at: profile.driving_license_uploaded_at,
        car_rc_uploaded_at: profile.car_rc_uploaded_at,
        number_plate_uploaded_at: profile.number_plate_uploaded_at,
        car_photos_uploaded_at: profile.car_photos_uploaded_at,
        documents_complete: profile.documents_complete,
        profile_verified: profile.profile_verified,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    }))

    return drivers
  } catch (error) {
    console.error('Error in getAllDrivers:', error)
    return []
  }
}

/**
 * Get driver by ID with profile
 */
export async function getDriverById(userId: string): Promise<DriverWithProfile | null> {
  try {
    const supabase = await createClient()

    console.log('Fetching driver with ID:', userId)

    // Use the view that includes email
    const { data: profile, error: profileError } = await supabase
      .from('driver_profiles_with_email')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching driver profile:', profileError)
      console.error('Error details:', JSON.stringify(profileError, null, 2))
      return null
    }

    if (!profile) {
      console.error('No profile found for user:', userId)
      return null
    }

    console.log('Profile found:', profile.email)

    return {
      user_id: profile.user_id,
      email: profile.email || 'No email',
      driver_profile: {
        id: profile.id,
        user_id: profile.user_id,
        phone: profile.phone,
        gender: profile.gender,
        government_id_url: profile.government_id_url,
        selfie_url: profile.selfie_url,
        driving_license_url: profile.driving_license_url,
        car_rc_url: profile.car_rc_url,
        number_plate_url: profile.number_plate_url,
        car_photos_urls: profile.car_photos_urls,
        government_id_uploaded_at: profile.government_id_uploaded_at,
        selfie_uploaded_at: profile.selfie_uploaded_at,
        driving_license_uploaded_at: profile.driving_license_uploaded_at,
        car_rc_uploaded_at: profile.car_rc_uploaded_at,
        number_plate_uploaded_at: profile.number_plate_uploaded_at,
        car_photos_uploaded_at: profile.car_photos_uploaded_at,
        documents_complete: profile.documents_complete,
        profile_verified: profile.profile_verified,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    }
  } catch (error) {
    console.error('Error in getDriverById:', error)
    return null
  }
}

/**
 * Approve driver
 */
export async function approveDriver(
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('driver_profiles')
      .update({
        profile_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error approving driver:', error)
      return { success: false, error: 'Failed to approve driver' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in approveDriver:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Reject driver
 */
export async function rejectDriver(
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('driver_profiles')
      .update({
        profile_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error rejecting driver:', error)
      return { success: false, error: 'Failed to reject driver' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in rejectDriver:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
