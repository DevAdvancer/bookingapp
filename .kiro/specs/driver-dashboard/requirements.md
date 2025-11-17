# Requirements Document

## Introduction

This document outlines the requirements for a functional driver dashboard that allows female drivers to upload and manage their verification documents. The system will store driver documents in Supabase with RLS policies disabled for direct database access.

## Glossary

- **Driver Dashboard**: The web interface where drivers can view their profile and manage documents
- **Document Management System**: The component that handles document uploads, storage, and verification
- **Supabase Storage**: The backend storage service for document files
- **Driver Profile**: The database record containing driver information and document references
- **Verification Document**: A required document that drivers must upload (Government ID, Selfie, Driving License, Car RC, Number Plate Photo, Car Photos)
- **Gender Verification**: The system requirement that only female drivers can register

## Requirements

### Requirement 1

**User Story:** As a female driver, I want to upload my verification documents, so that I can complete my registration and start accepting rides

#### Acceptance Criteria

1. THE Driver Dashboard SHALL display a document upload interface with sections for Government ID, Selfie, Driving License, Car RC, Number Plate Photo, and Car Photos
2. WHEN a driver selects a document file, THE Driver Dashboard SHALL validate the file type is an image format (JPEG, PNG, or PDF)
3. WHEN a driver uploads a document, THE Driver Dashboard SHALL store the file in Supabase Storage and save the reference in the database
4. THE Driver Dashboard SHALL display the upload status for each document type
5. WHEN all required documents are uploaded, THE Driver Dashboard SHALL update the driver profile status to indicate completion

### Requirement 2

**User Story:** As a female driver, I want to view my uploaded documents, so that I can verify what I have submitted

#### Acceptance Criteria

1. THE Driver Dashboard SHALL display thumbnails or previews of uploaded documents
2. WHEN a driver clicks on a document thumbnail, THE Driver Dashboard SHALL display the full-size document
3. THE Driver Dashboard SHALL indicate which documents have been uploaded and which are pending
4. THE Driver Dashboard SHALL allow drivers to download their uploaded documents

### Requirement 3

**User Story:** As a female driver, I want to update my documents if needed, so that I can keep my information current

#### Acceptance Criteria

1. THE Driver Dashboard SHALL provide a replace or re-upload option for each document type
2. WHEN a driver uploads a new version of a document, THE Driver Dashboard SHALL replace the previous version in storage
3. THE Driver Dashboard SHALL maintain a record of the most recent document upload date

### Requirement 4

**User Story:** As a female driver, I want to provide my phone number, so that passengers and the system can contact me

#### Acceptance Criteria

1. THE Driver Dashboard SHALL display a phone number input field
2. WHEN a driver enters a phone number, THE Driver Dashboard SHALL validate the format
3. THE Driver Dashboard SHALL save the phone number to the driver profile in the database
4. THE Driver Dashboard SHALL display the saved phone number in the profile section

### Requirement 5

**User Story:** As a system, I want to enforce gender verification, so that only female drivers can register

#### Acceptance Criteria

1. THE Driver Dashboard SHALL include a gender field in the driver profile
2. THE Driver Dashboard SHALL verify that the gender is set to female during registration
3. IF the gender is not female, THEN THE Driver Dashboard SHALL prevent profile completion
4. THE Driver Dashboard SHALL display the gender information in the profile section

### Requirement 6

**User Story:** As a driver, I want to see my profile information, so that I can verify my account details

#### Acceptance Criteria

1. THE Driver Dashboard SHALL display the driver's email address
2. THE Driver Dashboard SHALL display the driver's phone number
3. THE Driver Dashboard SHALL display the driver's gender
4. THE Driver Dashboard SHALL display the document upload status
5. THE Driver Dashboard SHALL display the account verification status
