# Admin Dashboard Design Document

## Overview

The admin dashboard provides comprehensive platform management capabilities including pricing configuration and driver verification workflows.

## Database Schema

### New Table: pricing_settings

```sql
CREATE TABLE pricing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  petrol_price_per_liter DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_per_km DECIMAL(10,2) NOT NULL DEFAULT 0,
  driver_cost_per_ride DECIMAL(10,2) NOT NULL DEFAULT 0,
  office_time_price_multiplier DECIMAL(10,2) NOT NULL DEFAULT 1.0,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE pricing_settings DISABLE ROW LEVEL SECURITY;

-- Insert default pricing
INSERT INTO pricing_settings (petrol_price_per_liter, price_per_km, driver_cost_per_ride, office_time_price_multiplier)
VALUES (1.50, 2.00, 5.00, 1.5);
```

## Components

### 1. Admin Dashboard Main (`app/admin/page.tsx`)
- Overview statistics
- Navigation to sub-sections
- Quick actions

### 2. Pricing Management (`app/admin/pricing/page.tsx`)
- Form to update pricing settings
- Display current settings
- Save functionality

### 3. Driver Verification List (`app/admin/drivers/page.tsx`)
- Table of all drivers
- Filter by status
- Click to view details

### 4. Driver Detail Page (`app/admin/drivers/[id]/page.tsx`)
- Driver information
- Document previews
- Approve/Reject buttons

## API Routes and Server Actions

### Pricing Actions (`app/admin/pricing/actions.ts`)

```typescript
// Get current pricing settings
async function getPricingSettings(): Promise<PricingSettings | null>

// Update pricing settings
async function updatePricingSettings(data: Partial<PricingSettings>): Promise<{ success: boolean; error?: string }>
```

### Driver Verification Actions (`app/admin/drivers/actions.ts`)

```typescript
// Get all drivers with profiles
async function getAllDrivers(): Promise<DriverWithProfile[]>

// Get driver by ID with profile
async function getDriverById(userId: string): Promise<DriverWithProfile | null>

// Approve driver
async function approveDriver(userId: string, adminId: string): Promise<{ success: boolean; error?: string }>

// Reject driver
async function rejectDriver(userId: string, adminId: string): Promise<{ success: boolean; error?: string }>
```

## UI Layout

### Admin Dashboard Main
```
┌─────────────────────────────────────────┐
│  Admin Dashboard              [Sign Out]│
├─────────────────────────────────────────┤
│  Stats: Total Drivers | Pending | Verified│
├─────────────────────────────────────────┤
│  [Pricing Management] [Driver Verification]│
└─────────────────────────────────────────┘
```

### Pricing Management
```
┌─────────────────────────────────────────┐
│  ← Back to Dashboard                     │
│  Pricing Management                      │
├─────────────────────────────────────────┤
│  Petrol Price: [____] per liter         │
│  Price per KM: [____]                    │
│  Driver Cost: [____] per ride            │
│  Office Time Multiplier: [____]          │
│                                          │
│  [Save Settings]                         │
└─────────────────────────────────────────┘
```

### Driver Verification List
```
┌─────────────────────────────────────────┐
│  ← Back to Dashboard                     │
│  Driver Verification                     │
├─────────────────────────────────────────┤
│  Filter: [All] [Pending] [Verified]     │
├─────────────────────────────────────────┤
│  Name     | Email    | Phone | Status   │
│  ─────────────────────────────────────  │
│  Jane Doe | jane@... | +123  | Pending  │
│  Mary Sue | mary@... | +456  | Verified │
└─────────────────────────────────────────┘
```

### Driver Detail Page
```
┌─────────────────────────────────────────┐
│  ← Back to Drivers                       │
│  Driver Verification Details             │
├─────────────────────────────────────────┤
│  Name: Jane Doe                          │
│  Email: jane@example.com                 │
│  Phone: +1234567890                      │
│  Gender: Female                          │
├─────────────────────────────────────────┤
│  Documents:                              │
│  [Gov ID] [Selfie] [License]            │
│  [Car RC] [Plate] [Car Photos]          │
├─────────────────────────────────────────┤
│  [Approve Driver] [Reject Driver]        │
└─────────────────────────────────────────┘
```

## Data Models

```typescript
interface PricingSettings {
  id: string
  petrol_price_per_liter: number
  price_per_km: number
  driver_cost_per_ride: number
  office_time_price_multiplier: number
  updated_by?: string
  created_at: string
  updated_at: string
}

interface DriverWithProfile {
  user_id: string
  email: string
  driver_profile: DriverProfile
}
```

## Security

- Only users with admin role can access admin routes
- All pricing updates logged with admin ID
- Driver verification actions logged
- RLS disabled on pricing_settings table
