# Quick Reference Guide

## 🚀 What's New

### For Passengers
- **Schedule Rides**: Book rides for future dates and times
- **Visual Indicators**: See scheduled rides with purple badges
- **Flexible Booking**: Choose immediate or scheduled rides

### For Drivers
- **Ride Requests Tab**: View and manage pending ride requests
- **Active Rides Tab**: Complete or cancel accepted rides
- **Badge Notifications**: See pending and active ride counts
- **Final Cost Adjustment**: Enter actual cost when completing rides

## 📱 Quick Actions

### Passenger Dashboard
```
1. Enter pickup location (or use current location)
2. Enter drop-off location
3. Toggle "Schedule for Later" if needed
4. Select date and time (if scheduling)
5. Click "Calculate Cost"
6. Select a driver
7. Click "Book Ride"
```

### Driver Dashboard - Ride Requests Tab
```
1. Review ride details
2. Check if scheduled (purple badge)
3. Click "Accept" to take the ride
   OR
   Click "Reject" to decline
```

### Driver Dashboard - Active Rides Tab
```
1. Click "Complete Ride"
2. Enter final cost
3. Click "Confirm Complete"
   OR
   Click "Cancel Ride" if needed
```

## 🎨 Visual Indicators

| Badge | Meaning |
|-------|---------|
| 🟡 Pending | Waiting for driver response |
| 🔵 Accepted | Driver accepted, ride confirmed |
| 🟣 Scheduled | Ride scheduled for future date/time |
| 🟢 Completed | Ride finished successfully |
| ⚫ Cancelled | Ride cancelled |

## 🔧 Technical Details

### New Database Fields
- `is_scheduled` - Boolean flag for scheduled rides
- `scheduled_date` - Date for scheduled ride
- `scheduled_time` - Time for scheduled ride

### New Components
- `components/driver/ride-requests.tsx` - Ride requests management
- `components/driver/accepted-rides.tsx` - Active rides management

### Updated Components
- `components/passengers/booking-form.tsx` - Added scheduling UI
- `components/passengers/ride-history.tsx` - Show scheduled rides
- `app/driver/dashboard-client.tsx` - Complete ride management
- `app/passengers/passenger-client.tsx` - Handle scheduling

### New API Actions
- `acceptRide()` - Accept ride request
- `rejectRide()` - Reject ride request
- `completeRide()` - Complete ride with final cost
- `cancelAcceptedRide()` - Cancel accepted ride
- `getDriverRides()` - Get driver's rides

## 📊 Status Flow

```
PENDING → ACCEPTED → COMPLETED
   ↓
CANCELLED
```

## 🔐 Permissions

### Passengers Can:
- Book immediate rides
- Schedule future rides
- Cancel pending rides
- View ride history

### Drivers Can:
- Accept ride requests
- Reject ride requests
- Complete accepted rides
- Cancel accepted rides
- View all assigned rides

## 💡 Tips

### For Passengers
- Schedule important rides in advance
- Double-check pickup/drop-off locations
- Cancel promptly if plans change
- Note the scheduled time when booking

### For Drivers
- Check scheduled rides regularly
- Only accept rides you can fulfill
- Update final cost accurately
- Complete rides promptly after drop-off

## 🐛 Troubleshooting

### Passenger Issues
**Can't see drivers?**
- Ensure drivers are verified
- Check if drivers are available (not busy)

**Scheduling not working?**
- Select a date (today or future)
- Select a time
- Both fields are required for scheduled rides

### Driver Issues
**Not seeing ride requests?**
- Ensure profile is verified
- Check if you're marked as available
- Refresh the page

**Can't complete ride?**
- Enter a valid final cost (greater than 0)
- Ensure ride is in accepted or in_progress status

## 📚 Documentation

- **Full Documentation**: `docs/RIDE_MANAGEMENT.md`
- **Feature Flow**: `docs/FEATURE_FLOW.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`

## 🎯 Next Steps

1. Test the booking flow as a passenger
2. Test accepting/completing rides as a driver
3. Try scheduling a ride for a future date
4. Verify badge counts update correctly
5. Test cancellation flows

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the feature flow diagram
3. Check browser console for errors
4. Verify database migration was applied
