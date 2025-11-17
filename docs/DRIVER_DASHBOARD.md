# Driver Dashboard Documentation

## Overview

The Driver Dashboard is a comprehensive document management system that allows female drivers to upload, view, and manage their verification documents. The system uses Supabase for backend storage and database management with RLS policies disabled for direct access.

## Features

### 1. Docuent
- Upload verification documents (Government ID, Selfie, Driving License, Car RC, Number Plate, Car Photos)
- View uploaded documents with preview and full-size modal
- Replace existing documents
- Download documents
- Track upload timestamps

### 2. Profile Management
- Add/update phone number
- View gender verification (female only)
- Track document completion status
- View profile verification status

### 3. Document Status Tracking
- Visual progress bar showing completion percentage
- Checklist of all required documents
- Real-time status updates

## Database Schema

### driver_profiles Table

```sql
CREATE TABLE driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender = 'female'),

  -- Document URLs
  government_id_url TEXT,
  selfie_url TEXT,
  driving_license_url TEXT,
  car_rc_url TEXT,
  number_plate_url TEXT,
  car_photos_urls TEXT[],

  -- Document upload timestamps
  government_id_uploaded_at TIMESTAMPTZ,
  selfie_uploaded_at TIMESTAMPTZ,
  driving_license_uploaded_at TIMESTAMPTZ,
  car_rc_uploaded_at TIMESTAMPTZ,
  number_plate_uploaded_at TIMESTAMPTZ,
  car_photos_uploaded_at TIMESTAMPTZ,

  -- Profile status
  documents_complete BOOLEAN DEFAULT FALSE,
  profile_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Note:** RLS is disabled on this table as requested.

## Storage

### driver-documents Bucket

- **Type:** Private bucket
- **File Size Limit:** 10MB per file
- **Allowed MIME Types:** image/jpeg, image/png, image/jpg, application/pdf
- **Access:** Signed URLs with 1-hour expiration

### File Organization

```
driver-documents/
  ├── {user_id}/
  │   ├── government-id.{ext}
  │   ├── selfie.{ext}
  │   ├── driving-license.{ext}
  │   ├── car-rc.{ext}
  │   ├── number-plate.{ext}
  │   └── car-photos/
  │       ├── photo-{timestamp}.{ext}
  │       └── ...
```

## Components

### 1. DocumentUpload (`components/driver/document-upload.tsx`)
- Drag-and-drop file upload
- Client-side validation (file type, size)
- Upload progress indicator
- Error handling and user feedback

### 2. DocumentPreview (`components/driver/document-preview.tsx`)
- Thumbnail display with Next.js Image optimization
- Full-size modal view
- Download functionality
- Upload timestamp display
- PDF preview support

### 3. DocumentStatus (`components/driver/document-status.tsx`)
- Progress bar with percentage
- Document checklist with status indicators
- Completion status message

### 4. ProfileForm (`components/driver/profile-form.tsx`)
- Phone number input with validation
- Gender display (read-only)
- Profile status indicator
- Save functionality with feedback

### 5. DriverDashboardClient (`app/driver/dashboard-client.tsx`)
- Main dashboard layout
- Document grid display
- Profile and status sections
- Real-time updates after uploads

## Server Actions

### getDriverProfile(userId: string)
Fetches driver profile from database.

### upsertDriverProfile(userId: string, data: Partial<DriverProfile>)
Creates or updates driver profile with validation.

### uploadDocument(userId: string, documentType: DocumentType, formData: FormData)
Uploads document to storage and updates database.

### deleteDocument(userId: string, documentType: DocumentType, filePath?: string)
Removes document from storage and clears database reference.

### getDocumentUrl(filePath: string)
Generates signed URL for private document viewing (1-hour expiration).

## Validation

### File Validation
- **Allowed Types:** JPEG, PNG, PDF
- **Max Size:** 10MB
- **Extensions:** .jpg, .jpeg, .png, .pdf

### Phone Number Validation
- **Format:** 10-15 digits with optional + prefix
- **Accepts:** Spaces, dashes, parentheses (cleaned before validation)

### Gender Validation
- **Required:** Must be 'female'
- **Enforced:** Database constraint and application logic

## Usage

### For Drivers

1. **Sign in** with driver credentials
2. **Complete profile** by adding phone number
3. **Upload documents** one by one or use drag-and-drop
4. **View progress** in the Document Status section
5. **Replace documents** if needed by clicking on uploaded documents
6. **Track completion** - all 6 documents required for verification

### Document Requirements

1. **Government ID** - Valid government-issued identification
2. **Selfie** - Clear photo of driver's face
3. **Driving License** - Valid driving license
4. **Car RC** - Car registration certificate
5. **Number Plate Photo** - Clear photo of car's number plate
6. **Car Photos** - Multiple photos of the car (exterior/interior)

## Security

### Storage Security
- Private bucket (not publicly accessible)
- Signed URLs with time expiration
- User-specific folder structure
- File type and size restrictions

### Database Security
- Foreign key constraints to auth.users
- Gender check constraint (must be 'female')
- Cascade delete on user deletion
- RLS disabled for direct access (as requested)

### Input Validation
- Server-side file validation
- Phone number format validation
- Sanitized file names
- Path traversal prevention

## Error Handling

### Client-Side
- File type validation before upload
- File size validation before upload
- Phone number format validation
- User-friendly error messages

### Server-Side
- Database connection error handling
- Storage upload failure handling
- Authentication error handling
- Comprehensive error logging

## Testing

### Validation Tests
Located in `lib/utils/__tests__/validation.test.ts`:
- File type validation
- File size validation
- File extension validation
- Phone number format validation

### Manual Testing Checklist
- [ ] Upload each document type
- [ ] Replace existing documents
- [ ] View uploaded documents in modal
- [ ] Download documents
- [ ] Update phone number
- [ ] Verify gender enforcement
- [ ] Test with various file types and sizes
- [ ] Test error scenarios (network failure, invalid files)

## API Reference

### Types

```typescript
type DocumentType =
  | 'government_id'
  | 'selfie'
  | 'driving_license'
  | 'car_rc'
  | 'number_plate'
  | 'car_photos'

interface DriverProfile {
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
  // ... timestamps and status fields
}

interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}
```

## Troubleshooting

### Upload Fails
- Check file size (must be < 10MB)
- Verify file type (JPEG, PNG, or PDF only)
- Ensure stable internet connection
- Check browser console for errors

### Documents Not Displaying
- Verify document was uploaded successfully
- Check if signed URL has expired (refresh page)
- Ensure storage bucket permissions are correct

### Profile Not Saving
- Verify phone number format
- Check network connection
- Ensure user is authenticated
- Check browser console for errors

## Future Enhancements

- Document verification status (admin review)
- OCR for automatic data extraction
- Real-time upload progress with percentage
- Bulk photo upload for car photos
- Document expiration tracking
- Push notifications for verification status
- Image compression before upload
- Thumbnail generation for faster loading
