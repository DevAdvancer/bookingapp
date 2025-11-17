'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { DriverWithProfile } from '@/lib/types/admin'
import type { DocumentType } from '@/lib/types/driver'
import { DOCUMENT_LABELS } from '@/lib/types/driver'
import { approveDriver, rejectDriver } from '../actions'
import { getDocumentUrl } from '@/app/driver/actions'

interface DriverDetailClientProps {
  driver: DriverWithProfile
  adminId: string
}

export default function DriverDetailClient({ driver, adminId }: DriverDetailClientProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<{
    type: DocumentType
    url: string
  } | null>(null)
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({})

  // Load signed URLs for all documents
  useEffect(() => {
    async function loadDocumentUrls() {
      const urls: Record<string, string> = {}
      const profile = driver.driver_profile

      const documents: Array<{ type: DocumentType; path: string | null }> = [
        { type: 'government_id', path: profile.government_id_url || null },
        { type: 'selfie', path: profile.selfie_url || null },
        { type: 'driving_license', path: profile.driving_license_url || null },
        { type: 'car_rc', path: profile.car_rc_url || null },
        { type: 'number_plate', path: profile.number_plate_url || null },
        { type: 'car_photos', path: profile.car_photos_urls?.[0] || null },
      ]

      for (const doc of documents) {
        if (doc.path) {
          const signedUrl = await getDocumentUrl(doc.path)
          if (signedUrl) {
            urls[doc.type] = signedUrl
          }
        }
      }

      setDocumentUrls(urls)
    }

    loadDocumentUrls()
  }, [driver])

  const handleApprove = async () => {
    setError(null)
    setSuccess(null)
    setProcessing(true)

    try {
      const result = await approveDriver(driver.user_id, adminId)

      if (result.success) {
        setSuccess('Driver approved successfully!')
        setTimeout(() => {
          router.push('/admin/drivers')
          router.refresh()
        }, 2000)
      } else {
        setError(result.error || 'Failed to approve driver')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Approve error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this driver?')) {
      return
    }

    setError(null)
    setSuccess(null)
    setProcessing(true)

    try {
      const result = await rejectDriver(driver.user_id, adminId)

      if (result.success) {
        setSuccess('Driver rejected')
        setTimeout(() => {
          router.push('/admin/drivers')
          router.refresh()
        }, 2000)
      } else {
        setError(result.error || 'Failed to reject driver')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Reject error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const documents: DocumentType[] = [
    'government_id',
    'selfie',
    'driving_license',
    'car_rc',
    'number_plate',
    'car_photos',
  ]

  const getDocumentPath = (docType: DocumentType): string | null => {
    const profile = driver.driver_profile
    if (docType === 'car_photos') {
      return profile.car_photos_urls?.[0] || null
    }
    const urlField = `${docType}_url` as keyof typeof profile
    return (profile[urlField] as string) || null
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not uploaded'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <button
            onClick={() => router.push('/admin/drivers')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Drivers
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Driver Verification Details</h1>
              <p className="text-gray-600 mt-2">Review driver information and documents</p>
            </div>
            <div>
              {driver.driver_profile.profile_verified ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  ⏳ Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Driver Info */}
          <div className="space-y-8">
            {/* Driver Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Driver Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="text-base font-medium text-gray-900 mt-1">{driver.email}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="text-base font-medium text-gray-900 mt-1">
                    {driver.driver_profile.phone || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Gender</label>
                  <div className="text-base font-medium text-pink-600 mt-1">
                    {driver.driver_profile.gender.charAt(0).toUpperCase() +
                      driver.driver_profile.gender.slice(1)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Documents Status</label>
                  <div className="mt-1">
                    {driver.driver_profile.documents_complete ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Incomplete
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Registered</label>
                  <div className="text-base font-medium text-gray-900 mt-1">
                    {formatDate(driver.driver_profile.created_at)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!driver.driver_profile.profile_verified && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Verification Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={processing || !driver.driver_profile.documents_complete}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : '✓ Approve Driver'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="w-full px-6 py-3 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : '✗ Reject Driver'}
                  </button>
                </div>
                {!driver.driver_profile.documents_complete && (
                  <p className="text-xs text-amber-600 mt-3">
                    ⚠️ Driver must upload all documents before approval
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Documents */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Documents</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {documents.map((docType) => {
                  const documentPath = getDocumentPath(docType)
                  const signedUrl = documentUrls[docType]
                  const uploadedAtField = `${docType}_uploaded_at` as keyof typeof driver.driver_profile
                  const uploadedAt = driver.driver_profile[uploadedAtField] as string | null

                  return (
                    <div key={docType} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        {DOCUMENT_LABELS[docType]}
                      </h3>

                      {documentPath && signedUrl ? (
                        <div>
                          <div
                            className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative mb-3"
                            onClick={() => setSelectedDocument({ type: docType, url: signedUrl })}
                          >
                            {documentPath.toLowerCase().endsWith('.pdf') ? (
                              <div className="flex flex-col items-center justify-center h-full">
                                <svg
                                  className="w-16 h-16 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p className="text-sm text-gray-600 mt-2">PDF Document</p>
                              </div>
                            ) : (
                              <Image
                                src={signedUrl}
                                alt={DOCUMENT_LABELS[docType]}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Uploaded: {formatDate(uploadedAt)}</span>
                            <button
                              onClick={() => setSelectedDocument({ type: docType, url: signedUrl })}
                              className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              View Full
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
                            <p className="text-sm text-gray-500">Not uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {DOCUMENT_LABELS[selectedDocument.type]}
              </h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {getDocumentPath(selectedDocument.type)?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-[70vh]"
                  title={DOCUMENT_LABELS[selectedDocument.type]}
                />
              ) : (
                <div className="relative w-full h-auto">
                  <Image
                    src={selectedDocument.url}
                    alt={DOCUMENT_LABELS[selectedDocument.type]}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
