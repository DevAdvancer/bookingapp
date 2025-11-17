# Passenger Ride Booking Requirements

## Introduction

This document outlines the requirements for a passenger ride booking system with real-time maps, distance calculation, dynamic pricing, and verified driver selection with concurrent booking prevention.

## Glossary

- **Passenger Dashboard**: The interface where passengers can book rides
- **Ride Request**: A booking request from a passenger to a driver
- **Verified Driver**: A driver with profile_verified = true
- **Distance Calculation**: Computing the distance between pickup and drop-off locations
- **Dynamic Pricing**: Calculating ride cost based on distance, time, and pricing settings
- **Concurrent Booking**: When multiple passengers try to book the same driver simultaneously
- **Real-time Map**: Interactive map showing pickup, drop-off, and route

## Requirements

### Requirement 1: Map Integration and Location Selection

**User Story:** As a passenger, I want to select pickup and drop-off locations on a map with current location support and place search, so that I can easily specify my ride route

#### Acceptance Criteria

1. THE Passenger Dashboard SHALL display an interactive map
2. THE Passenger Dashboard SHALL provide a "Use Current Location" button for both pickup and drop-off locations
3. WHEN a passenger clicks "Use Current Location", THE Passenger Dashboard SHALL request geolocation permission and set the location to the user's current position
4. THE Passenger Dashboard SHALL display the current location with a marker on the map
5. THE Passenger Dashboard SHALL provide a search input field for pickup and drop-off locations
6. WHEN a passenger types in the search field, THE Passenger Dashboard SHALL display place name suggestions (not latitude/longitude coordinates)
7. THE Passenger Dashboard SHALL use a geocoding service to convert place names to coordinates
8. THE Passenger Dashboard SHALL allow passengers to set locations by clicking on the map
9. WHEN both locations are set, THE Passenger Dashboard SHALL display the route on the map
10. THE Passenger Dashboard SHALL calculate and display the distance in kilometers

### Requirement 2: Geolocation and Place Search

**User Story:** As a passenger, I want to use my current location and search for places by name, so that I can quickly set my pickup and drop-off points without manually entering coordinates

#### Acceptance Criteria

1. WHEN a passenger clicks "Use Current Location", THE Passenger Dashboard SHALL request browser geolocation permission
2. IF geolocation permission is granted, THEN THE Passenger Dashboard SHALL retrieve the user's current latitude and longitude
3. THE Passenger Dashboard SHALL display the current location marker on the map
4. THE Passenger Dashboard SHALL reverse geocode the coordinates to display a human-readable address
5. WHEN a passenger types in the location search field, THE Passenger Dashboard SHALL query a geocoding service for matching places
6. THE Passenger Dashboard SHALL display autocomplete suggestions showing place names and addresses
7. THE Passenger Dashboard SHALL NOT display raw latitude/longitude coordinates in the search results
8. WHEN a passenger selects a place from suggestions, THE Passenger Dashboard SHALL set the location and update the map marker
9. IF geolocation permission is denied, THEN THE Passenger Dashboard SHALL display an error message and fall back to manual location selection
10. THE Passenger Dashboard SHALL handle geolocation errors gracefully (timeout, unavailable, etc.)

### Requirement 3: Distance and Cost Calculation

**User Story:** As a passenger, I want to see the estimated cost before booking, so that I can decide if I want to proceed

#### Acceptance Criteria

1. WHEN pickup and drop-off locations are set, THE Passenger Dashboard SHALL calculate the distance in kilometers
2. THE Passenger Dashboard SHALL fetch current pricing settings from the database
3. THE Passenger Dashboard SHALL calculate the ride cost using the formula: (Distance × Price per KM) + Driver Cost + (Office Time Multiplier if applicable)
4. THE Passenger Dashboard SHALL display the distance and estimated cost to the passenger
5. THE Passenger Dashboard SHALL update the cost if locations are changed

### Requirement 4: Verified Driver Display

**User Story:** As a passenger, I want to see only verified drivers, so that I can book safe rides

#### Acceptance Criteria

1. THE Passenger Dashboard SHALL fetch only drivers where profile_verified = true
2. THE Passenger Dashboard SHALL display driver information (name, phone, rating)
3. THE Passenger Dashboard SHALL show driver availability status
4. THE Passenger Dashboard SHALL allow passengers to select a driver
5. IF no verified drivers are available, THEN THE Passenger Dashboard SHALL display a message

### Requirement 5: Ride Booking with Concurrent Prevention

**User Story:** As a passenger, I want to book a driver, so that I can get a ride

#### Acceptance Criteria

1. WHEN a passenger clicks "Book Ride", THE Passenger Dashboard SHALL create a ride request
2. THE Passenger Dashboard SHALL check if the selected driver is still available
3. IF the driver is already booked by another passenger, THEN THE Passenger Dashboard SHALL show an error and suggest selecting another driver
4. IF the driver is available, THEN THE Passenger Dashboard SHALL create the booking and mark the driver as busy
5. THE Passenger Dashboard SHALL use database transactions to prevent concurrent bookings

### Requirement 6: Ride Request Management

**User Story:** As a passenger, I want to see my ride requests, so that I can track my bookings

#### Acceptance Criteria

1. THE Passenger Dashboard SHALL display a list of the passenger's ride requests
2. THE Passenger Dashboard SHALL show ride status (pending, accepted, in-progress, completed, cancelled)
3. THE Passenger Dashboard SHALL allow passengers to cancel pending requests
4. THE Passenger Dashboard SHALL display ride details (pickup, drop-off, distance, cost, driver)
5. THE Passenger Dashboard SHALL update in real-time when ride status changes

### Requirement 6: Office Hours Pricing

**User Story:** As a system, I want to apply office hours pricing, so that rides during peak hours cost more

#### Acceptance Criteria

1. THE System SHALL determine if the current time is during office hours (9 AM - 6 PM, Monday-Friday)
2. IF the ride is during office hours, THEN THE System SHALL apply the office time price multiplier
3. THE Passenger Dashboard SHALL display whether office hours pricing is applied
4. THE Passenger Dashboard SHALL show the breakdown of the cost calculation
