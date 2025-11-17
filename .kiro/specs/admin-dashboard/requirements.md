# Admin Dashboard Requirements

## Introduction

This document outlines the requirements for a comprehensive admin dashboard that allows administrators to manage pricing settings and verify driver documents.

## Glossary

- **Admin Dashboard**: The web interface where administrators manage the platform
- **Pricing Management**: System to configure ride pricing parameters
- **Driver Verification**: Process where admin reviews and approves driver documents
- **Verification Request**: A driver's submission for document verification
- **Pricing Settings**: Configurable parameters for ride cost calculation

## Requirements

### Requirement 1: Pricing Management

**User Story:** As an admin, I want to manage pricing settings, so that I can control ride costs

#### Acceptance Criteria

1. THE Admin Dashboard SHALL display a pricing management interface with fields for petrol price, per km price, driver cost, and office time price
2. WHEN an admin updates a pricing field, THE Admin Dashboard SHALL validate the input is a positive number
3. WHEN an admin saves pricing settings, THE Admin Dashboard SHALL store the values in the database
4. THE Admin Dashboard SHALL display the current pricing settings
5. THE Admin Dashboard SHALL show the last updated timestamp for pricing settings

### Requirement 2: Driver Verification List

**User Story:** As an admin, I want to see all driver verification requests, so that I can review pending applications

#### Acceptance Criteria

1. THE Admin Dashboard SHALL display a list of all drivers with their verification status
2. THE Admin Dashboard SHALL show driver name, email, phone, and verification status
3. THE Admin Dashboard SHALL allow filtering by verification status (pending, verified, rejected)
4. WHEN an admin clicks on a driver, THE Admin Dashboard SHALL navigate to the driver detail page
5. THE Admin Dashboard SHALL display the count of pending verification requests

### Requirement 3: Driver Detail and Verification

**User Story:** As an admin, I want to view driver details and documents, so that I can verify their identity

#### Acceptance Criteria

1. THE Admin Dashboard SHALL display driver's name, email, phone, and gender
2. THE Admin Dashboard SHALL display all uploaded documents with preview capability
3. WHEN an admin clicks on a document, THE Admin Dashboard SHALL display the full-size document
4. THE Admin Dashboard SHALL provide "Approve" and "Reject" buttons
5. WHEN an admin approves a driver, THE Admin Dashboard SHALL update the profile_verified status to true
6. WHEN an admin rejects a driver, THE Admin Dashboard SHALL update the profile_verified status to false
7. THE Admin Dashboard SHALL display a success message after verification action

### Requirement 4: Verified Driver Visibility

**User Story:** As a system, I want to show only verified drivers to passengers, so that passengers can book safe rides

#### Acceptance Criteria

1. THE System SHALL only display drivers with profile_verified = true to passengers
2. THE Driver Dashboard SHALL display verification status to drivers
3. IF a driver is not verified, THEN THE Driver Dashboard SHALL show "Pending Verification" status
4. IF a driver is verified, THEN THE Driver Dashboard SHALL show "Verified" status

### Requirement 5: Admin Dashboard Navigation

**User Story:** As an admin, I want to navigate between different admin sections, so that I can manage the platform efficiently

#### Acceptance Criteria

1. THE Admin Dashboard SHALL provide navigation to Pricing Management
2. THE Admin Dashboard SHALL provide navigation to Driver Verification
3. THE Admin Dashboard SHALL display statistics (total drivers, pending verifications, verified drivers)
4. THE Admin Dashboard SHALL highlight the active section
