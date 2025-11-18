// Ride status
export type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

// Location
export interface Location {
  address: string
  lat: number
  lng: number
}

// Ride
export interface Ride {
  id: string
  passenger_id: string
  driver_id?: string | null

  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  dropoff_address: string
  dropoff_lat: number
  dropoff_lng: number

  distance_km: number
  estimated_cost: number
  final_cost?: number | null
  office_hours_applied: boolean

  status: RideStatus

  // Scheduling fields
  is_scheduled: boolean
  scheduled_date?: string | null
  scheduled_time?: string | null

  requested_at: string
  accepted_at?: string | null
  started_at?: string | null
  completed_at?: string | null
  cancelled_at?: string | null

  created_at: string
  updated_at: string
}

// Driver with availability
export interface AvailableDriver {
  user_id: string
  email: string
  phone: string
  is_available: boolean
  current_ride_id?: string | null
}

// Ride calculation
export interface RideCalculation {
  distance_km: number
  base_cost: number
  driver_cost: number
  office_hours_multiplier: number
  office_hours_applied: boolean
  total_cost: number
}

// Booking request
export interface BookingRequest {
  pickup: Location
  dropoff: Location
  driver_id: string
  distance_km: number
  estimated_cost: number
  office_hours_applied: boolean
  is_scheduled?: boolean
  scheduled_date?: string
  scheduled_time?: string
}
