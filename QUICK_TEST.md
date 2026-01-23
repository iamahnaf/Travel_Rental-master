# ⚡ QUICK TEST GUIDE

## 🎯 **5-Minute System Test**

Your system is **RUNNING NOW**:
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:5001
- 💾 Database: phpMyAdmin (port 3307)

---

## 🧪 **Test Scenario: Complete Booking Flow**

### Step 1: Create Hotel Owner (2 min)

1. Open http://localhost:3000/register
2. Select **"Business"** → **"Hotel Owner"**
3. Fill in:
   - Name: `Test Hotel Owner`
   - Email: `hotel@test.com`
   - Password: `test123`
   - Hotel Name: `Grand Test Hotel`
   - City: `Dhaka`
   - Address: `123 Test Street`
4. Click **"Register"**
5. ✅ **Verify in phpMyAdmin**:
   - Open phpMyAdmin → `car_rental_booking` database
   - Check `users` table → New row with `role='hotel_owner'`
   - Check `hotels` table → New hotel with name "Grand Test Hotel"

---

### Step 2: Add Hotel Room (1 min)

1. Login with `hotel@test.com` / `test123`
2. Dashboard automatically opens
3. Click **"Add Room"** button
4. Fill in:
   - Room Type: `Deluxe`
   - Room Number: `201`
   - Hourly Rate: `50`
   - Daily Rate: `300`
   - Max Occupancy: `2`
5. Click **"Add Room"**
6. ✅ **Verify in phpMyAdmin**:
   - Check `hotel_rooms` table → New room with `room_number='201'`

---

### Step 3: Create Traveler Account (1 min)

1. Logout (top right)
2. Go to Register → Select **"Traveler"**
3. Fill in:
   - Name: `Test Traveler`
   - Email: `traveler@test.com`
   - Password: `test123`
4. Click **"Register"**
5. ✅ **Verify in phpMyAdmin**:
   - Check `users` table → New row with `role='traveler'`

---

### Step 4: Book the Hotel (1 min)

1. Login with `traveler@test.com` / `test123`
2. Click **"Hotels"** in navigation
3. You should see **"Grand Test Hotel"** card
4. Click on the hotel card
5. Select dates:
   - Check-in: Tomorrow
   - Check-out: Day after tomorrow
6. Click **"Book Now"**
7. Click **"Submit"** (NID upload can be skipped for testing)
8. ✅ **Verify in phpMyAdmin**:
   - Check `bookings` table → New row with:
     - `booking_type = 'hotel'`
     - `status = 'pending'`
     - `total_price` calculated

---

### Step 5: Accept Booking Request (1 min)

1. Logout
2. Login as hotel owner: `hotel@test.com` / `test123`
3. Dashboard shows **"Incoming Requests"** section
4. You should see the booking request with traveler name
5. Click **"Accept"** button
6. ✅ **Verify in phpMyAdmin**:
   - Check `bookings` table → `status` changed to `'confirmed'`
7. **Verify in Traveler Dashboard**:
   - Logout, login as traveler
   - Dashboard shows booking as **"Confirmed"**

---

## 🚗 **Quick Test: Vehicle with Pickup/Destination**

### Register Car Owner
1. Register → Business → Car Owner
2. Email: `car@test.com`, Password: `test123`
3. Car Brand: `Toyota`, Model: `Corolla`, Year: `2023`
4. ✅ Check `vehicles` table in phpMyAdmin

### Add Another Vehicle
1. Login as car owner
2. Dashboard → Click **"Add Vehicle"**
3. Fill: Brand, Model, Year, Price per Day
4. ✅ Check `vehicles` table

### Book as Traveler (Verify Pickup/Destination)
1. Login as traveler
2. Browse Vehicles → Click a vehicle
3. ✅ **IMPORTANT**: Verify form has:
   - Pickup Address field ✅
   - Destination Address field ✅
4. Fill dates + addresses → Book
5. ✅ Check `bookings` table → Should have `pickup_address` AND `destination_address`

---

## 👨‍✈️ **Quick Test: Driver (NO Pickup/Destination)**

### Register Driver
1. Register → Business → Driver
2. Email: `driver@test.com`, Password: `test123`
3. Experience: `5`, City: `Dhaka`
4. ✅ Check `drivers` table

### Book Driver (Verify NO Location Fields)
1. Login as traveler
2. Browse Drivers → Click driver
3. ✅ **IMPORTANT**: Verify form has:
   - Start Date ✅
   - End Date ✅
   - NO Pickup Address ❌
   - NO Destination Address ❌
4. Book with dates only
5. ✅ Check `bookings` table → `pickup_address` and `destination_address` should be `NULL`

---

## 🗺️ **Quick Test: Tour Guide (NO Pickup/Destination)**

### Register Tour Guide
1. Register → Business → Tour Guide
2. Email: `guide@test.com`, Password: `test123`
3. City: `Dhaka`, Specialties: `Historical Tours, Food Tours`
4. ✅ Check `tour_guides` table

### Edit Profile
1. Login as tour guide
2. Dashboard → Click **"Edit Profile"**
3. Update Bio, Price
4. Click **"Save Changes"**
5. ✅ Check `tour_guides` table → Updates reflected

### Book Guide (Verify NO Location Fields)
1. Login as traveler
2. Browse Tour Guides → Click guide
3. ✅ Verify: Only dates, NO pickup/destination
4. Book → Check `bookings` table

---

## ✅ **VERIFICATION CHECKLIST**

After completing tests above, verify:

### Database Tables Should Have:
- [ ] `users`: At least 5 accounts (1 per role)
- [ ] `hotels`: At least 1 hotel
- [ ] `hotel_rooms`: At least 1 room
- [ ] `vehicles`: At least 1 vehicle
- [ ] `drivers`: At least 1 driver
- [ ] `tour_guides`: At least 1 tour guide
- [ ] `bookings`: Multiple bookings with different `booking_type`

### Bookings Table Should Show:
- [ ] Hotel booking: `pickup_address` = NULL, `destination_address` = NULL
- [ ] Vehicle booking: `pickup_address` = "...", `destination_address` = "..."
- [ ] Driver booking: `pickup_address` = NULL, `destination_address` = NULL
- [ ] Tour guide booking: `pickup_address` = NULL, `destination_address` = NULL

### UI Should Show:
- [ ] Hotel owner dashboard: Incoming requests, Add Property, Manage Rooms
- [ ] Car owner dashboard: Vehicle list, Add Vehicle, Incoming requests
- [ ] Driver dashboard: Edit Profile, Stats, Incoming requests
- [ ] Tour guide dashboard: Edit Profile, Specialties, Incoming requests
- [ ] Traveler dashboard: All bookings with status (pending/confirmed/cancelled)

---

## 🐛 **If Something Doesn't Work**

### Backend Not Responding?
```bash
# Check if backend is running
curl http://localhost:5001/health

# If not running, restart:
cd backend
npm start
```

### Frontend Not Loading?
```bash
# Check if frontend is running
curl http://localhost:3000

# If not running, restart:
cd frontend
npm run dev
```

### Database Not Connecting?
1. Open XAMPP Control Panel
2. Ensure MySQL is running on port 3307
3. Open phpMyAdmin
4. Verify database `car_rental_booking` exists
5. Check backend console for "Database connected successfully"

### Data Not Saving?
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try the action again
4. Check if API calls show errors
5. Look at Console tab for JavaScript errors

---

## 🎉 **SUCCESS INDICATORS**

You'll know everything is working when:

✅ You can create accounts and see them in phpMyAdmin `users` table
✅ Business registration creates entity in corresponding table (hotels/vehicles/drivers/tour_guides)
✅ Entities appear on public browse pages immediately
✅ Travelers can book services
✅ Bookings appear in phpMyAdmin `bookings` table
✅ Business dashboards show incoming requests
✅ Accept/Reject updates database in real-time
✅ Pickup/Destination fields ONLY on vehicle bookings
✅ Profile edits save to database

**If all above work → Your system is FULLY OPERATIONAL!** 🚀
