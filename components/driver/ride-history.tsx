'use client'

import type { Ride } from '@/lib/types/ride'

interface RideHistoryProps {
  rides: Ride[]
}

export default function RideHistory({ rides }: RideHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const completedRides = rides.filter(r => r.status === 'completed')
  const cancelledRides = rides.filter(r => r.status === 'cancelled')
  const allHistoryRides = rides.filter(r => r.status === 'completed' || r.status === 'cancelled')

  const totalRevenue = completedRides.reduce((sum, ride) => sum + (ride.final_cost || ride.estimated_cost), 0)
  const totalDistance = completedRides.reduce((sum, ride) => sum + ride.distance_km, 0)

  if (allHistoryRides.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ride History</h3>
        <p className="text-gray-600">Your completed and cancelled rides will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-green-700">Total Earnings</div>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-green-900">₹{totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-green-600 mt-1">{completedRides.length} completed rides</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-blue-700">Total Distance</div>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-900">{totalDistance.toFixed(1)} km</div>
          <div className="text-sm text-blue-600 mt-1">Total traveled</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-purple-700">Average Fare</div>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            ₹{completedRides.length > 0 ? (totalRevenue / completedRides.length).toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-purple-600 mt-1">Per ride</div>
        </div>
      </div>

      {/* Ride History List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ride History</h2>
        <div className="space-y-4">
          {allHistoryRides.map((ride) => (
            <div
              key={ride.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        ride.status
                      )}`}
                    >
                      {ride.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
                    </span>
                    {ride.is_scheduled && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        📅 Scheduled
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {ride.completed_at
                        ? formatDate(ride.completed_at)
                        : ride.cancelled_at
                        ? formatDate(ride.cancelled_at)
                        : formatDate(ride.requested_at)}
                    </span>
                  </div>

                  {ride.is_scheduled && ride.scheduled_date && ride.scheduled_time && (
                    <div className="mb-2 p-2 bg-purple-50 rounded text-sm text-purple-900">
                      <strong>Was scheduled for:</strong> {new Date(ride.scheduled_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {ride.scheduled_time}
                    </div>
                  )}

                  <div className="space-y-1 text-sm">
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                      <span className="text-gray-900">{ride.pickup_address}</span>
                    </div>
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-900">{ride.dropoff_address}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  {ride.status === 'completed' ? (
                    <>
                      <div className="text-lg font-bold text-green-600">
                        ₹{(ride.final_cost || ride.estimated_cost).toFixed(2)}
                      </div>
                      {ride.final_cost && ride.final_cost !== ride.estimated_cost && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{ride.estimated_cost.toFixed(2)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-lg font-bold text-gray-500">
                      ₹{ride.estimated_cost.toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">{ride.distance_km} km</div>
                  {ride.office_hours_applied && (
                    <div className="text-xs text-amber-600 mt-1">Office hours</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {cancelledRides.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-amber-800">
              <strong>{cancelledRides.length}</strong> ride{cancelledRides.length !== 1 ? 's' : ''} cancelled
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
