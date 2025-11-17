# Implementation Plan

- [x] 1. Set up database schema and storage infrastructure
  - Create the driver_profiles table in Supabase with all required fields
  - Disable RLS policy on driver_profiles table
  - Create the driver-documents storage bucket with proper configuration
  - Set up indexes for performance optimization
  - _Requirements: 1.1, 4.3, 5.1, 5.2, 6.4_

- [x] 2. Create TypeScript types and interfaces
  - Define DocumentType, DriverProfile, UploadResponse, and DocumentStatus interfaces
  - Create type definitions file at `lib/types/driver.ts`
  - _Requirements: 1.1, 4.1, 5.1, 6.1_

- [x] 3. Implement server actions for driver profile management
  - [x] 3.1 Create `app/driver/actions.ts` with getDriverProfile function
    - Implement database query to fetch driver profile by user_id
    - Handle cases where profile doesn't exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.2 Implement upsertDriverProfile function
    - Create or update driver profile with phone and gender validation
    - Update the updated_at timestamp
    - Return the complete profile data
    - _Requirements: 4.3, 5.1, 5.2_

  - [x] 3.3 Implement uploadDocument function
    - Validate file type and size on server
    - Generate unique file path based on user_id and document type
    - Upload file to Supabase Storage
    - Update driver_profiles table with document URL and timestamp
    - Check if all documents are complete and update documents_complete flag
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [x] 3.4 Implement deleteDocument function
    - Remove file from Supabase Storage
    - Clear document URL and timestamp from database
    - Update documents_complete flag
    - _Requirements: 3.2_

  - [x] 3.5 Implement getDocumentUrl function
    - Generate signed URL for private document viewing
    - Set appropriate expiration time (1 hour)
    - _Requirements: 2.2, 2.4_

- [x] 4. Create document upload component
  - [x] 4.1 Build DocumentUpload component at `components/driver/document-upload.tsx`
    - Create file input with drag-and-drop support
    - Implement client-side file validation (type, size)
    - Show upload progress indicator
    - Display success/error messages
    - Call uploadDocument server action
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.2 Add support for multiple car photos
    - Allow selecting multiple files for car_photos document type
    - Upload each photo individually
    - Store array of URLs in database
    - _Requirements: 1.1, 1.3_

- [x] 5. Create document preview and status components
  - [x] 5.1 Build DocumentPreview component at `components/driver/document-preview.tsx`
    - Display document thumbnail using Next.js Image
    - Implement modal for full-size view
    - Add download functionality
    - Show upload timestamp
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 5.2 Build DocumentStatus component at `components/driver/document-status.tsx`
    - Create checklist of all required documents
    - Show upload status for each document
    - Calculate and display completion percentage
    - Highlight peg documents
    - _Requirements: 1.4, 2.3_

- [x] 6. Create profile form component
  - Build ProfileForm component at `components/driver/profile-form.tsx`
  - Add phone number input with validation
  - Display gender (read-only)
  - Show profile verification status
  - Implement save functionality using upsertDriverProfile action
  - _Requirements: 4.1, 4.2, 4.3, 5.4, 6.1, 6.2, 6.3, 6.5_

- [x] 7. Update driver dashboard page
  - [x] 7.1 Integrate document management section
    - Fetch driver profile on page load
    - Create or initialize profile if it doesn't exist
    - Render DocumentUpload components for each document type
    - Render DocumentPreview components for uploaded documents
    - Add DocumentStatus component to show progress
    - _Requirements: 1.1, 1.4, 2.1, 2.3_

  - [x] 7.2 Add profile information section
    - Integrate ProfileForm component
    - Display current phone number and gender
    - Show document completion status
    - Update account status based on documents_complete flag
    - _Requirements: 4.1, 4.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.3 Implement document replacement functionality
    - Add "Replace" button to uploaded documents
    - Allow re-uploading documents
    - Update timestamps when documents are replaced
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 8. Add error handling and validation
  - Implement comprehensive error messages for all failure scenarios
  - Add client-side validation for file types and sizes
  - Add server-side validation for all inputs
  - Handle network errors gracefully
  - Display user-friendly error messages
  - _Requirements: 1.2, 4.2, 5.3_

- [x] 9. Implement loading states and UI feedback
  - Add loading spinners during uploads
  - Show progress bars for file uploads
  - Display success toasts after successful operations
  - Add skeleton loaders for initial page load
  - Disable buttons during async operations
  - _Requirements: 1.3, 1.4_

- [x] 10. Add basic validation tests
  - [x] 10.1 Test file validation logic
    - Test file type validation
    - Test file size validation
    - Test phone number format validation
    - _Requirements: 1.2, 4.2_

  - [x] 10.2 Test document upload flow
    - Test successful upload
    - Test upload failure handling
    - Test document replacement
    - _Requirements: 1.3, 3.2_
