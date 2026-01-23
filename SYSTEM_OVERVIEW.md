# 🎯 Complete System Overview - B2B + B2C Marketplace

## 🚀 **SYSTEM IS NOW RUNNING!**

### 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Database**: phpMyAdmin at http://localhost/phpmyadmin (port 3307)

---

## 📊 **DATABASE STATUS** ✅

### Connected Tables (All Active)
| Table | Count | Purpose |
|-------|-------|---------|
| users | 3 | All user accounts |
| hotels | 2 | Hotel listings |
| vehicles | 3 | Vehicle listings |
| drivers | 2 | Driver profiles |
| tour_guides | 2 | Tour guide profiles |
| hotel_rooms | 0 | Room inventory (ready) |
| bookings | - | All booking requests |

**Database**: `car_rental_booking` on MySQL port 3307

---

## 👥 **USER ROLES & COMPLETE WORKFLOWS**

### 🧳 **TRAVELER (Customer)**

**Registration Flow:**
1. Go to `/register` → Select "Traveler"
2. Fill: Name, Email, Password, Phone
3. Account created → Redirected to login
4. **Database**: New row in `users` table with `role='traveler'`

**Booking Flow:**
1. Browse services: `/hotels`, `/vehicles`, `/drivers`, `/tour-guides`
2. Click on service card → View details page
3. Select dates, enter booking details
4. **Vehicles only**: Enter pickup & destination addresses
5. **Hotels/Drivers/Tour Guides**: Date-based booking only
6. Click "Book Now"
7. **Database**: New row in `bookings` table with `status='pending'`

**Dashboard Features:**
- View all bookings (pending, confirmed, completed)
- Cancel bookings with reason
- **Database**: Updates `bookings` table, sets `status='cancelled'`, stores `cancellation_reason`

---

### 🏨 **HOTEL OWNER (Business Partner)**

**Registration Flow:**
1. Go to `/register` → Select "Business" → "Hotel Owner"
2. Fill form:
   - Personal: Name, Email, Password
   - Business: Hotel Name, City, Address
3. Click Register
4. **Database Actions** (Automatic):
   - Row in `users` table: `role='hotel_owner'`
   - Row in `hotels` table: Linked via `user_id`, instant listing

**Dashboard Features** (`/dashboard/hotel-owner`):

**1. Add New Property:**
- Click "Add Property" button
- Fill: Hotel Name, City, Address, Base Price, Total Rooms, Amenities, Description
- Submit → **Database**: New row in `hotels` table

**2. Manage Rooms:**
- Click "Manage Rooms" on any hotel
- View all rooms for that hotel
- **Add Room**:
  - Room Type: Standard/Deluxe/Suite
  - Room Number, Hourly Rate, Daily Rate, Max Occupancy
  - **Database**: New row in `hotel_rooms` table with `hotel_id`

**3. Incoming Requests:**
- Real-time display of booking requests
- Shows: Traveler name, dates, price, status
- **Accept Booking**:
  - Click "Accept" → **Database**: `bookings.status = 'confirmed'`
- **Reject Booking**:
  - Click "Reject" → Enter feedback reason → Submit
  - **Database**: `bookings.status = 'cancelled'`, stores `cancellation_reason`

**How Travelers See Hotels:**
1. Hotel owner adds hotel → Appears in database
2. Travelers browse `/hotels` → Frontend fetches from `hotels` table
3. Hotel cards shown with: name, city, rating, price, available rooms
4. Click hotel → Detail page → Can book

---

### 🚗 **CAR OWNER (Business Partner)**

**Registration Flow:**
1. Go to `/register` → Select "Business" → "Car Owner"
2. Fill form:
   - Personal: Name, Email, Password
   - Business: Car Brand, Model, Year
3. Click Register
4. **Database Actions** (Automatic):
   - Row in `users` table: `role='car_owner'`
   - Row in `vehicles` table: Linked via `owner_id`, instant listing

**Dashboard Features** (`/dashboard/car-owner`):

**1. Add New Vehicle:**
- Click "Add Vehicle" button
- Fill form:
  - Brand, Model, Year, Seats
  - Fuel Type (Petrol/Diesel/Electric/Hybrid)
  - Transmission (Manual/Automatic)
  - Price per Day, With Driver Price
  - Image URL, Description
- Submit → **Database**: New row in `vehicles` table with `owner_id`

**2. View Vehicle Inventory:**
- Grid view of all owned vehicles
- Shows: Brand/Model, Year, Price, Availability status
- Each vehicle displays image, specs, booking status

**3. Incoming Requests:**
- Real-time rental requests from travelers
- Shows: Traveler name, dates, pickup/destination (vehicles only), price
- **Accept/Reject** with same flow as hotel owners
- **Database**: Updates `bookings` table

**How Travelers See Vehicles:**
1. Car owner adds vehicle → Appears in database
2. Travelers browse `/vehicles` → Fetches from `vehicles` table
3. Vehicle cards shown with ratings, price, features
4. Click vehicle → Detail page with pickup/destination fields → Book

---

### 🚕 **DRIVER (Business Partner)**

**Registration Flow:**
1. Go to `/register` → Select "Business" → "Driver"
2. Fill form:
   - Personal: Name, Email, Password
   - Business: Experience Years, City
3. Click Register
4. **Database Actions** (Automatic):
   - Row in `users` table: `role='driver'`
   - Row in `drivers` table: Linked via `user_id`, instant profile

**Dashboard Features** (`/dashboard/driver`):

**1. Edit Profile:**
- Click "Edit Profile" button
- Update: Name, City, Experience, Price per Day, Bio
- Submit → **Database**: Updates `drivers` table

**2. View Stats:**
- Total Earnings (calculated)
- Total Trips (from `drivers.total_rides`)
- Rating (from `drivers.rating`)
- Upcoming Trips

**3. Incoming Requests:**
- Shows booking requests for driver services
- Traveler info, dates, price
- **Accept/Reject** with feedback
- **Database**: Updates `bookings` table

**How Travelers See Drivers:**
1. Driver registers → Profile in `drivers` table
2. Travelers browse `/drivers` → Fetches all drivers
3. Driver cards show: photo, name, city, rating, experience, languages
4. Click driver → Detail page (NO pickup/destination) → Date-based booking

---

### 🗺️ **TOUR GUIDE (Business Partner)**

**Registration Flow:**
1. Go to `/register` → Select "Business" → "Tour Guide"
2. Fill form:
   - Personal: Name, Email, Password
   - Business: City, Specialties (comma-separated)
3. Click Register
4. **Database Actions** (Automatic):
   - Row in `users` table: `role='tour_guide'`
   - Row in `tour_guides` table: Linked via `user_id`, instant profile

**Dashboard Features** (`/dashboard/tour-guide`):

**1. Edit Profile:**
- Click "Edit Profile"
- Update: Name, City, Experience, Price per Day, Specialties, Bio
- Submit → **Database**: Updates `tour_guides` table

**2. View Stats:**
- Total Earnings
- Total Tours (from `tour_guides.total_tours`)
- Rating
- Upcoming Tours

**3. Incoming Requests:**
- Tour booking requests from travelers
- **Accept/Reject** with feedback
- **Database**: Updates `bookings` table

**How Travelers See Tour Guides:**
1. Guide registers → Profile in `tour_guides` table
2. Travelers browse `/tour-guides` → Fetches all guides
3. Cards show: photo, name, rating, specialties, experience
4. Click guide → Detail page (NO pickup/destination) → Date-based booking

---

## 🔄 **COMPLETE DATA FLOW**

### Example: Hotel Booking End-to-End

1. **Hotel Owner Registers:**
   ```
   Frontend Form → POST /api/auth/register
   Backend → Transaction: INSERT users + INSERT hotels
   Database → users.id=5, hotels.id=3, hotels.user_id=5
   ```

2. **Hotel Owner Adds Room:**
   ```
   Dashboard → Click "Add Room" → Fill form
   Frontend → POST /api/hotels/3/rooms
   Backend → Verifies ownership → INSERT hotel_rooms
   Database → hotel_rooms.id=1, hotel_rooms.hotel_id=3
   ```

3. **Traveler Browses Hotels:**
   ```
   Frontend → GET /api/hotels
   Backend → SELECT * FROM hotels WHERE available_rooms > 0
   Response → [{id: 3, name: "Grand Hotel", ...}]
   Frontend → Displays hotel card
   ```

4. **Traveler Books Hotel:**
   ```
   Hotel Detail Page → Select dates → Click "Book Now"
   Frontend → POST /api/bookings
   Body: {booking_type: 'hotel', hotel_id: 3, start_date, end_date, total_price}
   Backend → Checks role (must be traveler) → INSERT bookings
   Database → bookings.id=10, bookings.status='pending', bookings.hotel_id=3
   ```

5. **Hotel Owner Sees Request:**
   ```
   Owner Dashboard → GET /api/bookings/business/requests
   Backend → Joins bookings + hotels + users WHERE hotels.user_id = current_user
   Response → Shows pending booking
   Frontend → Displays in "Incoming Requests" section
   ```

6. **Hotel Owner Accepts:**
   ```
   Dashboard → Click "Accept"
   Frontend → POST /api/bookings/accept/10
   Backend → Verifies ownership → UPDATE bookings SET status='confirmed'
   Database → bookings.status='confirmed'
   Frontend → Updates UI, traveler sees "Confirmed" in their dashboard
   ```

---

## 🎨 **KEY FEATURES IMPLEMENTED**

### ✅ **Real-Time Registration**
- Business entities created **instantly** during registration
- No manual approval needed
- Appear in public listings immediately

### ✅ **Role-Based Access Control**
- **Travelers**: Can only book, cannot add listings
- **Business**: Can only manage inventory, cannot book
- Enforced at both frontend (UI) and backend (API)

### ✅ **Pickup/Destination Logic**
- **Vehicles ONLY**: Pickup address + Destination address required
- **Hotels, Drivers, Tour Guides**: Date-based booking, NO pickup/destination

### ✅ **Incoming Requests System**
- Unified component for all business dashboards
- Real-time display of pending bookings
- Accept/Reject with mandatory feedback on rejection

### ✅ **Database Persistence**
- All data saves to MySQL (phpMyAdmin)
- Registration → Instant database insert
- Bookings → Real-time table updates
- Profile edits → Immediate database sync

### ✅ **Account Separation**
- Business accounts see "Cannot book" message on detail pages
- Traveler accounts cannot access business dashboards
- Clean separation prevents confusion

---

## 🔗 **API ENDPOINT REFERENCE**

### Authentication (`/api/auth`)
- `POST /register` - Create account (all roles)
- `POST /login` - Login (returns JWT token)

### Hotels (`/api/hotels`)
- `GET /` - List all hotels (public)
- `GET /:id` - Hotel details (public)
- `GET /owner/list` - Get owner's hotels (auth)
- `POST /` - Create hotel (auth, owner only)
- `PUT /:id` - Update hotel (auth, owner only)
- `GET /:hotelId/rooms` - Get hotel rooms (public)
- `POST /:hotelId/rooms` - Add room (auth, owner only)
- `PUT /rooms/:roomId` - Update room (auth, owner only)
- `DELETE /rooms/:roomId` - Delete room (auth, owner only)

### Vehicles (`/api/vehicles`)
- `GET /` - List all vehicles (public)
- `GET /:id` - Vehicle details (public)
- `GET /owner/list` - Get owner's vehicles (auth)
- `POST /` - Add vehicle (auth, owner only)
- `PUT /:id` - Update vehicle (auth, owner only)

### Drivers (`/api/drivers`)
- `GET /` - List all drivers (public)
- `GET /:id` - Driver details (public)
- `GET /profile/me` - Get own profile (auth, driver only)
- `PUT /profile/update` - Update profile (auth, driver only)

### Tour Guides (`/api/tour-guides`)
- `GET /` - List all guides (public)
- `GET /:id` - Guide details (public)
- `GET /profile/me` - Get own profile (auth, guide only)
- `PUT /profile/update` - Update profile (auth, guide only)

### Bookings (`/api/bookings`)
- `POST /` - Create booking (auth, traveler only)
- `GET /user` - Get user's bookings (auth, traveler only)
- `PUT /:id/cancel` - Cancel booking (auth, traveler only)
- `GET /business/requests` - Get incoming requests (auth, business only)
- `POST /accept/:id` - Accept booking (auth, business only)
- `POST /reject/:id` - Reject with feedback (auth, business only)

---

## 🧪 **TESTING CHECKLIST**

### Test 1: Hotel Owner Flow
- [ ] Register as hotel owner with details
- [ ] Check phpMyAdmin: `hotels` table has new row
- [ ] Login to dashboard
- [ ] Add a room (Deluxe, #201, $50/hr, $300/day)
- [ ] Check phpMyAdmin: `hotel_rooms` table has new row
- [ ] Logout

### Test 2: Traveler Booking Flow
- [ ] Register as traveler
- [ ] Browse hotels page
- [ ] See hotel from Test 1
- [ ] Click hotel → View details
- [ ] Select dates, book hotel
- [ ] Check phpMyAdmin: `bookings` table has new row with `status='pending'`
- [ ] View dashboard → See booking as "pending"

### Test 3: Business Request Management
- [ ] Login as hotel owner
- [ ] Dashboard shows incoming request
- [ ] Click "Accept"
- [ ] Check phpMyAdmin: `bookings.status='confirmed'`
- [ ] Logout, login as traveler
- [ ] Dashboard shows booking as "confirmed"

### Test 4: Vehicle Booking (with Pickup/Destination)
- [ ] Register as car owner
- [ ] Add vehicle
- [ ] Check phpMyAdmin: `vehicles` table
- [ ] Register new traveler
- [ ] Browse vehicles, book one
- [ ] **Verify**: Pickup + Destination fields present
- [ ] Submit booking
- [ ] Check `bookings` table has `pickup_address` and `destination_address`

### Test 5: Driver Booking (NO Pickup/Destination)
- [ ] Register as driver
- [ ] Browse as traveler → `/drivers`
- [ ] Book driver
- [ ] **Verify**: NO pickup/destination fields
- [ ] Only date selection present

---

## 📱 **FRONTEND PAGES**

| URL | Purpose | Accessible By |
|-----|---------|---------------|
| `/` | Homepage with featured listings | Everyone |
| `/register` | Registration (Traveler/Business) | Guest |
| `/login` | Login | Guest |
| `/dashboard` | Main dashboard (role-based redirect) | Authenticated |
| `/dashboard/hotel-owner` | Hotel management | Hotel Owners |
| `/dashboard/car-owner` | Vehicle management | Car Owners |
| `/dashboard/driver` | Driver profile & requests | Drivers |
| `/dashboard/tour-guide` | Guide profile & requests | Tour Guides |
| `/hotels` | Browse all hotels | Everyone |
| `/hotels/[id]` | Hotel details & booking | Everyone |
| `/vehicles` | Browse all vehicles | Everyone |
| `/vehicles/[id]` | Vehicle details & booking | Everyone |
| `/drivers` | Browse all drivers | Everyone |
| `/drivers/[id]` | Driver details & booking | Everyone |
| `/tour-guides` | Browse all tour guides | Everyone |
| `/tour-guides/[id]` | Guide details & booking | Everyone |

---

## 🎯 **WHAT'S WORKING RIGHT NOW**

✅ **Backend Server**: Running on port 5001
✅ **Frontend Server**: Running on port 3000
✅ **Database Connection**: MySQL on port 3307
✅ **User Registration**: All 5 roles
✅ **Auto-Creation**: Hotels/Vehicles/Drivers/Guides created on registration
✅ **Public Listings**: All services visible on browse pages
✅ **Booking System**: Travelers can book all services
✅ **Request Management**: Business dashboards show incoming requests
✅ **Accept/Reject Flow**: With feedback on rejection
✅ **Pickup/Destination**: Only on vehicle bookings
✅ **Database Sync**: All actions persist to phpMyAdmin
✅ **Real-Time Updates**: Changes reflect immediately

---

## 🚀 **NEXT: START USING THE SYSTEM**

1. **Open Browser**: http://localhost:3000
2. **Register Test Accounts**: Create one account for each role
3. **Add Listings**: As business users, add hotels/vehicles/profiles
4. **Make Bookings**: As traveler, book services
5. **Manage Requests**: As business users, accept/reject bookings
6. **Verify Data**: Check phpMyAdmin after each action

**Your system is FULLY OPERATIONAL!** 🎉
