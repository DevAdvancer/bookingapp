'use client'

import type { DriverProfile, DocumentType } from '@/lib/types/driver'
import { DOCUMENT_LABELS } from '@/lib/types/driver'

interface DocumentStatusProps {
  profile: DriverProfile | null
}

export default function DocumentStatus({ profile }: DocumentStatusProps) {
  const documents: DocumentType[] = [
    'government_id',
    'selfie',
    'driving_license',
    'car_rc',
    'number_plate',
    'car_photos',
  ]

  const getDocumentStatus = (docType: DocumentType) => {
    if (!profile) return false

    if (docType === 'car_photos') {
      return profile.car_photos_urls && profile.car_photos_urls.length > 0
    }

    const urlField = `${docType}_url` as keyof DriverProfile
    return !!profile[urlField]
  }

  const uploadedCount = documents.filter((doc) => getDocumentStatus(doc)).length
  const totalCount = documents.length
  const percentage = Math.round((uploadedCount / totalCount) * 100)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Document Verification</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {uploadedCount}/{totalCount} documents uploaded
          </span>
          <span className="text-sm font-medium text-indigo-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Document Checklist */}
      <div className="space-y-3">
        {documents.map((docType) => {
          const isUploaded = getDocumentStatus(docType)
          return (
            <div
              key={docType}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isUploaded
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isUploaded ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {isUploaded ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isUploaded ? 'text-green-900' : 'text-gray-700'
                  }`}
                >
                  {DOCUMENT_LABELS[docType]}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  isUploaded ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                {isUploaded ? 'Uploaded' : 'Pending'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Completion Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        {profile?.documents_complete ? (
          <div className="flex items-center text-green-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">All documents uploaded!</span>
          </div>
        ) : (
          <div className="flex items-center text-amber-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">
              Please upload all required documents
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
