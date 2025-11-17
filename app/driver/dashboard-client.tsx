'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { DriverProfile } from '@/lib/types/driver'
import { getDriverProfile } from './actions'
import DocumentStatus from '@/components/driver/document-status'
import ProfileForm from '@/components/driver/profile-form'

interface DriverDashboardClientProps {
  user: User
  profile: DriverProfile | null
}

export default function DriverDashboardClient({
  user,
  profile: initialProfile,
}: DriverDashboardClientProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<DriverProfile | null>(initialProfile)

  const refreshProfile = async () => {
    const updatedProfile = await getDriverProfile(user.id)
    setProfile(updatedProfile)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your profile and documents
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats - 4 Sections */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Driver Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Driver Requests</div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500 mt-1">Active requests</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">₹0</div>
            <div className="text-xs text-gray-500 mt-1">Total earnings</div>
          </div>

          {/* Document Verification */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push('/driver/verification')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Documents</div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {profile?.documents_complete ? '✓' : '...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {profile?.documents_complete ? 'Complete' : 'Incomplete'}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Status</div>
              <div className={`w-10 h-10 bg-gradient-to-br ${
                profile?.profile_verified
                  ? 'from-green-500 to-emerald-600'
                  : 'from-amber-500 to-orange-600'
              } rounded-lg flex items-center justify-center`}>
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {profile?.profile_verified ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                profile?.profile_verified ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {profile?.profile_verified ? 'Verified' : 'Pending'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Account status</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push('/driver/verification')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Document Verification
            </h3>
            <p className="text-gray-600 mb-4">
              Upload and manage your verification documents
            </p>
            <button className="text-indigo-600 font-medium hover:text-indigo-700">
              Manage Documents →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ride Requests
            </h3>
            <p className="text-gray-600 mb-4">
              View and accept ride requests from passengers
            </p>
            <button className="text-gray-400 font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Earnings
            </h3>
            <p className="text-gray-600 mb-4">
              Track your income and payment history
            </p>
            <button className="text-gray-400 font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ProfileForm
            userId={user.id}
            initialData={profile}
            onSave={refreshProfile}
          />
          <DocumentStatus profile={profile} />
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Role</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Driver
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Phone Number</span>
              <span className="font-medium text-gray-900">
                {profile?.phone || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">Account Status</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.documents_complete
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {profile?.documents_complete ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
