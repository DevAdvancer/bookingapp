import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS } from '@/lib/types/driver'

/**
 * Validate file type
 */
export function validateFileType(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPEG, PNG, or PDF file',
    }
  }
  return { valid: true }
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 10MB',
    }
  }
  return { valid: true }
}

/**
 * Validate file extension
 */
export function validateFileExtension(fileName: string): { valid: boolean; error?: string } {
  const ext = '.' + fileName.split('.').pop()?.toLowerCase()
  if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'Please upload a file with .jpg, .jpeg, .png, or .pdf extension',
    }
  }
  return { valid: true }
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s-()]/g, '')

  // Basic phone validation: 10-15 digits, optional + prefix
  const phoneRegex = /^\+?[1-9]\d{9,14}$/

  if (!phoneRegex.test(cleanPhone)) {
    return {
      valid: false,
      error: 'Please enter a valid phone number (10-15 digits, optional + prefix)',
    }
  }

  return { valid: true }
}

/**
 * Validate complete file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const typeValidation = validateFileType(file)
  if (!typeValidation.valid) {
    return typeValidation
  }

  // Check file size
  const sizeValidation = validateFileSize(file)
  if (!sizeValidation.valid) {
    return sizeValidation
  }

  // Check file extension
  const extValidation = validateFileExtension(file.name)
  if (!extValidation.valid) {
    return extValidation
  }

  return { valid: true }
}
