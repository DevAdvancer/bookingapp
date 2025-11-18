# Ride Management System

## Overview
This document describes the complete ride management system including scheduled rides, ride requests, and ride completion features.

## Features Implemented

### 1. Scheduled Rides (Passenger Side)

#### Database Schema
- Added `is_scheduled` (boolean) - Indicates if ride is scheduled for later
- Added `scheduled_date` (date) - Date for scheduled ride
- Added `scheduled_time` (time) - Time for scheduled ride

#### Passenger Booking Flow
1. **Select Locations**: Choose pickup and drop-off locations
2. **Schedule Option**: Toggle "Schedule for Later" checkbox
3. **Select Date & Time**: If scheduled, pick date (today or future) and time
4. **Calculate Cost**: Get estimated fare
5. **Select Driver**: Choose from available verified drivers
6. **Book Ride**: Confirm booking (immediate or scheduled)

#### UI Components
- **Scheduling Toggle**: Checkbox to enable/disable scheduling
- **Date Picker**: Select future date (minimum: today)
- **Time Picker**: Select specific time
- **Visual Indicators**: Purple "Scheduled" badges on ride cards

### 2. Driver Ride Requests

#### Features
- **Real-time Requests**: View all pending ride requests assigned to driver
- **Scheduled Ride Info**: Clear display of scheduled date/time
- **Accept/Reject Actions**: Quick action buttons for each request
- **Ride Details**: Full pickup/drop-off addresses, distance, and cost

#### Request Card Information
- Status badge (New Request)
- Scheduled indicator (if applicable)
- Scheduled date and time (if applicable)
- Pickup location with green pin icon
- Drop-off location with red pin icon
- Estimated cost and distance
- Office hours indicator
- Accept/Reject buttons

### 3. Active Rides Management

#### Features
- **Active Rides View**: Shows accepted and in-progress rides
- **Complete Ride**: Enter final cost and mark ride as completed
- **Cancel Ride**: Cancel accepted rides if needed
- **Cost Adjustment**: Modify final cost from estimated cost

#### Complete Ride Flow
1. Click "Complete Ride" button
2. Enter final cost (pre-filled with estimated cost)
3. Review and confirm
4. Ride marked as completed
5. Driver becomes available again

#### Cancel Ride Flow
1. Click "Cancel Ride" button
2. Ride status updated to cancelled
3. Driver becomes available again
4. Passenger notified

### 4. Driver Dashboard Tabs

#### Three Main Tabs
1. **Profile & Documents**: Manage profile and upload verification documents
2. **Ride Requests**: View and respond to pending ride requests (with badge count)
3. **Active Rides**: Manage accepted and in-progress rides (with badge count)

#### Statistics Cards
- **Ride Requests**: Count of pending requests (clickable)
- **Active Rides**: Count of accepted/in-progress rides (clickable)
- **Total Revenue**: Total earnings (coming soon)
- **Document Verification**: Status indicator
- **Verification Status**: Account verification status

## API Actions

### Passenger Actions (`app/passengers/actions.ts`)
- `calculateRideCost()` - Calculate ride fare
- `getAvailableDrivers()` - Get verified available drivers
- `bookRide()` - Book immediate or scheduled ride
- `getPassengerRides()` - Get passenger's ride history
- `cancelRide()` - Cancel pending ride

### Driver Actions (`app/driver/actions.ts`)
- `getDriverProfile()` - Get driver profile
- `getDriverRides()` - Get driver's assigned rides
- `acceptRide()` - Accept pending ride request
- `rejectRide()` - Reject ride request
- `completeRide()` - Complete ride with final cost
- `cancelAcceptedRide()` - Cancel accepted ride

## Database Updates

### Migration: `add_scheduled_ride_fields`
```sql
ALTER TABLE rides
ADD COLUMN IF NOT EXISTS scheduled_date DATE,
ADD COLUMN IF NOT EXISTS scheduled_time TIME,
ADD COLUMN IF NOT EXISTS is_scheduled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_rides_scheduled
ON rides(is_scheduled, scheduled_date, scheduled_time)
WHERE is_scheduled = TRUE;
```

## Type Definitions

### Updated Ride Interface
```typescript
interface Ride {
  // ... existing fields
  is_scheduled: boolean
  scheduled_date?: string | null
  scheduled_time?: string | null
}
```

### Updated BookingRequest Interface
```typescript
interface BookingRequest {
  // ... existing fields
  is_scheduled?: boolean
  scheduled_date?: string
  scheduled_time?: string
}
```

## User Experience

### Passenger Experience
1. **Immediate Booking**: Quick booking for immediate rides
2. **Scheduled Booking**: Plan rides in advance with specific date/time
3. **Visual Feedback**: Clear indicators for scheduled vs immediate rides
4. **Ride History**: View all rides with scheduling information
5. **Cancellation**: Cancel pending rides easily

### Driver Experience
1. **Request Management**: Accept or reject ride requests
2. **Scheduled Awareness**: See which rides are scheduled for later
3. **Active Ride Tracking**: Manage ongoing rides
4. **Flexible Completion**: Adjust final cost if needed
5. **Quick Actions**: Complete or cancel rides with one click

## Status Flow

### Ride Status Lifecycle
1. **pending** - Ride requested, waiting for driver action
2. **accepted** - Driver accepted, ride confirmed
3. **in_progress** - Ride started (optional status)
4. **completed** - Ride finished successfully
5. **cancelled** - Ride cancelled by passenger or driver

### Driver Availability
- **Available**: Can accept new rides
- **Busy**: Currently has an active ride
- Automatically updated when rides are accepted/completed/cancelled

## Best Practices

### For Passengers
- Schedule rides in advance for important trips
- Verify pickup/drop-off locations before booking
- Cancel rides promptly if plans change
- Check scheduled time before booking

### For Drivers
- Review scheduled rides regularly
- Accept rides you can fulfill
- Update final cost accurately
- Complete rides promptly after drop-off
- Cancel only when absolutely necessary

## Future Enhancements
- Push notifications for ride requests
- Real-time location tracking
- In-app messaging between driver and passenger
- Ride ratings and reviews
- Earnings dashboard
- Ride history filtering
- Recurring scheduled rides
- Multi-stop rides
