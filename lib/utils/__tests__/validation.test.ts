import { describe, it, expect } from '@jest/globals'
import {
  validateFileType,
  validateFileSize,
  validateFileExtension,
  validatePhoneNumber,
  validateFile,
} from '../validation'

describe('File Validation', () => {
  describe('validateFileType', () => {
    it('should accept JPEG files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFileType(file)
      expect(result.valid).toBe(true)
    })

    it('should accept PNG files', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      const result = validateFileType(file)
      expect(result.valid).toBe(true)
    })

    it('should accept PDF files', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      const result = validateFileType(file)
      expect(result.valid).toBe(true)
    })

    it('should reject unsupported file types', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const result = validateFileType(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateFileSize', () => {
    it('should accept files under 10MB', () => {
      const file = new File(['x'.repeat(5 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFileSize(file)
      expect(result.valid).toBe(true)
    })

    it('should reject files over 10MB', () => {
      const file = new File(['x'.repeat(11 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFileSize(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should accept files exactly 10MB', () => {
      const file = new File(['x'.repeat(10 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFileSize(file)
      expect(result.valid).toBe(true)
    })
  })

  describe('validateFileExtension', () => {
    it('should accept .jpg extension', () => {
      const result = validateFileExtension('test.jpg')
      expect(result.valid).toBe(true)
    })

    it('should accept .jpeg extension', () => {
      const result = validateFileExtension('test.jpeg')
      expect(result.valid).toBe(true)
    })

    it('should accept .png extension', () => {
      const result = validateFileExtension('test.png')
      expect(result.valid).toBe(true)
    })

    it('should accept .pdf extension', () => {
      const result = validateFileExtension('test.pdf')
      expect(result.valid).toBe(true)
    })

    it('should reject unsupported extensions', () => {
      const result = validateFileExtension('test.txt')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should be case insensitive', () => {
      const result = validateFileExtension('test.JPG')
      expect(result.valid).toBe(true)
    })
  })

  describe('validatePhoneNumber', () => {
    it('should accept valid phone numbers with country code', () => {
      const result = validatePhoneNumber('+1234567890')
      expect(result.valid).toBe(true)
    })

    it('should accept valid phone numbers without country code', () => {
      const result = validatePhoneNumber('1234567890')
      expect(result.valid).toBe(true)
    })

    it('should accept phone numbers with spaces', () => {
      const result = validatePhoneNumber('+1 234 567 890')
      expect(result.valid).toBe(true)
    })

    it('should accept phone numbers with dashes', () => {
      const result = validatePhoneNumber('+1-234-567-890')
      expect(result.valid).toBe(true)
    })

    it('should accept phone numbers with parentheses', () => {
      const result = validatePhoneNumber('+1 (234) 567-890')
      expect(result.valid).toBe(true)
    })

    it('should reject phone numbers that are too short', () => {
      const result = validatePhoneNumber('123456')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject phone numbers that are too long', () => {
      const result = validatePhoneNumber('12345678901234567')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject phone numbers starting with 0', () => {
      const result = validatePhoneNumber('0234567890')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject phone numbers with letters', () => {
      const result = validatePhoneNumber('123abc7890')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateFile', () => {
    it('should accept valid files', () => {
      const file = new File(['x'.repeat(1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject files with invalid type', () => {
      const file = new File(['x'.repeat(1024)], 'test.txt', {
        type: 'text/plain',
      })
      const result = validateFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject files that are too large', () => {
      const file = new File(['x'.repeat(11 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      const result = validateFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject files with invalid extension', () => {
      const file = new File(['x'.repeat(1024)], 'test.txt', {
        type: 'image/jpeg',
      })
      const result = validateFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
