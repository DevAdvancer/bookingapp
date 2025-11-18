'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { User } from '@supabase/supabase-js'
import type { Ride, Location, RideCalculation, AvailableDriver } from '@/lib/types/ride'
import { createClient } from '@/lib/supabase/client'
import {
  calculateRideCost,
  getAvailableDrivers,
  bookRide,
  cancelRide,
  getPassengerRides,
} from './actions'
import BookingForm from '@/components/passengers/booking-form'
import RideHistory from '@/components/passengers/ride-history'

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/passengers/map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

interface PassengerDashboardClientProps {
  user: User
  initialRides: Ride[]
}

export default function PassengerDashboardClient({
  user,
  initialRides,
}: PassengerDashboardClientProps) {
  const router = useRouter()
  const [pickup, setPickup] = useState<Location | null>(null)
  const [dropoff, setDropoff] = useState<Location | null>(null)
  const [calculation, setCalculation] = useState<RideCalculation | null>(null)
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>([])
  const [rides, setRides] = useState<Ride[]>(initialRides)
  const [booking, setBooking] = useState(false)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)


  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCalculate = async (
    pickupLoc: Location,
    dropoffLoc: Location,
    distance: number
  ) => {
    setPickup(pickupLoc)
    setDropoff(dropoffLoc)
    setError(null)

    // Calculate cost
    const calc = await calculateRideCost(distance)
    if (!calc) {
      setError('Failed to calculate ride cost')
      return
    }
    setCalculation(calc)

    // Get available drivers
    const drivers = await getAvailableDrivers()
    setAvailableDrivers(drivers)
  }

  // Update map when locations change in booking form
  const handleLocationUpdate = (location: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setPickup(location)
    } else {
      setDropoff(location)
    }
  }

  const handleBook = async (driverId: string, isScheduled: boolean, scheduledDate?: string, scheduledTime?: string) => {
    if (!pickup || !dropoff || !calculation) {
      setError('Please calculate the ride cost first')
      return
    }

    setBooking(true)
    setError(null)
    setSuccess(null)

    const result = await bookRide(user.id, {
      pickup,
      dropoff,
      driver_id: driverId,
      distance_km: calculation.distance_km,
      estimated_cost: calculation.total_cost,
      office_hours_applied: calculation.office_hours_applied,
      is_scheduled: isScheduled,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
    })

    setBooking(false)

    if (result.success) {
      setSuccess(isScheduled ? 'Ride scheduled successfully!' : 'Ride booked successfully!')
      // Reset form
      setPickup(null)
      setDropoff(null)
      setCalculation(null)
      setAvailableDrivers([])
      // Refresh rides
      const updatedRides = await getPassengerRides(user.id)
      setRides(updatedRides)
      setTimeout(() => setSuccess(null), 5000)
    } else {
      setError(result.error || 'Failed to book ride')
    }
  }

  const handleCancel = async (rideId: string) => {
    setCancelling(rideId)
    setError(null)
    setSuccess(null)

    const result = await cancelRide(rideId, user.id)

    setCancelling(null)

    if (result.success) {
      setSuccess('Ride cancelled successfully')
      // Refresh rides
      const updatedRides = await getPassengerRides(user.id)
      setRides(updatedRides)
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to cancel ride')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Passenger Dashboard</h1>
              <p className="text-gray-600 mt-2">Book your ride with verified female drivers</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-900 font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-900 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Ride</h2>
              <BookingForm
                onCalculate={handleCalculate}
                onLocationUpdate={handleLocationUpdate}
                calculation={calculation}
                availableDrivers={availableDrivers}
                onBook={handleBook}
                booking={booking}
              />
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Map</h2>
              <MapComponent pickup={pickup} dropoff={dropoff} />
              {pickup && dropoff && calculation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Distance:</strong> {calculation.distance_km} km
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Distance calculated using OSRM routing. Map shows direct line for visualization.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Ride History */}
          <div>
            <RideHistory rides={rides} onCancel={handleCancel} cancelling={cancelling} />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">How to Book</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Search for your pickup location or use "Current Location" button</li>
                <li>Search for your drop-off location</li>
                <li>Click "Calculate Cost" to see the estimated fare</li>
                <li>Select an available verified driver</li>
                <li>Click "Book Ride" to confirm your booking</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                Tip: Start typing an address and select from the suggestions that appear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
