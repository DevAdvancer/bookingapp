'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getDocumentUrl } from '@/app/driver/actions'
import type { DocumentType } from '@/lib/types/driver'
import { DOCUMENT_LABELS } from '@/lib/types/driver'

interface DocumentPreviewProps {
  documentUrl: string
  documentType: DocumentType
  uploadedAt?: string | null
  onDelete?: () => void
}

export default function DocumentPreview({
  documentUrl,
  documentType,
  uploadedAt,
  onDelete,
}: DocumentPreviewProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSignedUrl() {
      setLoading(true)
      const url = await getDocumentUrl(documentUrl)
      setSignedUrl(url)
      setLoading(false)
    }
    fetchSignedUrl()
  }, [documentUrl])

  const isPdf = documentUrl.toLowerCase().endsWith('.pdf')

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900">{DOCUMENT_LABELS[documentType]}</h4>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 text-sm"
              title="Delete document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {loading ? (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div
            className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
            onClick={() => setShowModal(true)}
          >
            {isPdf ? (
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
            ) : signedUrl ? (
              <Image
                src={signedUrl}
                alt={DOCUMENT_LABELS[documentType]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Failed to load
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Uploaded
          </div>
          {uploadedAt && (
            <span className="text-xs text-gray-500">{formatDate(uploadedAt)}</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            View
          </button>
          {signedUrl && (
            <a
              href={signedUrl}
              download
              className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Download
            </a>
          )}
        </div>
      </div>

      {/* Modal for full-size view */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{DOCUMENT_LABELS[documentType]}</h3>
              <button
                onClick={() => setShowModal(false)}
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
              {isPdf && signedUrl ? (
                <iframe
                  src={signedUrl}
                  className="w-full h-[70vh]"
                  title={DOCUMENT_LABELS[documentType]}
                />
              ) : signedUrl ? (
                <div className="relative w-full h-auto">
                  <Image
                    src={signedUrl}
                    alt={DOCUMENT_LABELS[documentType]}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Failed to load document</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
