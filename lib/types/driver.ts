// Document types
export type DocumentType =
  | 'government_id'
  | 'selfie'
  | 'driving_license'
  | 'car_rc'
  | 'number_plate'
  | 'car_photos'

// Driver profile
export interface DriverProfile {
  id: string
  user_id: string
  phone: string
  gender: 'female'

  government_id_url?: string | null
  selfie_url?: string | null
  driving_license_url?: string | null
  car_rc_url?: string | null
  number_plate_url?: string | null
  car_photos_urls?: string[] | null

  government_id_uploaded_at?: string | null
  selfie_uploaded_at?: string | null
  driving_license_uploaded_at?: string | null
  car_rc_uploaded_at?: string | null
  number_plate_uploaded_at?: string | null
  car_photos_uploaded_at?: string | null

  documents_complete: boolean
  profile_verified: boolean

  created_at: string
  updated_at: string
}

// Upload response
export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

// Document status
export interface DocumentStatus {
  type: DocumentType
  label: string
  uploaded: boolean
  url?: string | null
  uploadedAt?: string | null
}

// Document metadata
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  government_id: 'Government ID',
  selfie: 'Selfie',
  driving_license: 'Driving License',
  car_rc: 'Car RC',
  number_plate: 'Number Plate Photo',
  car_photos: 'Car Photos',
}

// Validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
