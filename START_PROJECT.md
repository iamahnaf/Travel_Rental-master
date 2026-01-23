# 🚀 Project Startup Guide

## Prerequisites
- Node.js installed
- MySQL/XAMPP running on port 3307
- Database `car_rental_booking` created

## Step 1: Start Backend Server

```bash
cd backend
npm install
npm start
```

Backend will run on: **http://localhost:5001**

## Step 2: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

## Step 3: Access Application

Open browser: **http://localhost:3000**

## 📊 Database Configuration

Your `.env` file is configured for:
- **Host**: localhost
- **Port**: 3307 (XAMPP MySQL)
- **Database**: car_rental_booking
- **User**: root
- **Password**: (empty)

## ✅ System Check

Run this to verify database connection:

```bash
cd backend
node -r dotenv/config -e "const { pool } = require('./config/db'); async function test() { const [result] = await pool.execute('SELECT COUNT(*) as count FROM users'); console.log('Database connected! Users:', result[0].count); process.exit(0); } test();"
```

## 🎯 User Roles & Workflows

### Traveler Account
1. Register as "Traveler"
2. Browse: Hotels, Vehicles, Drivers, Tour Guides
3. Book services
4. View bookings in dashboard
5. Cancel bookings with reason

### Hotel Owner Account
1. Register as "Hotel Owner" with hotel details
2. Hotel automatically created in database
3. Dashboard: Add hotels, manage rooms
4. View incoming booking requests
5. Accept/Reject bookings with feedback

### Car Owner Account
1. Register as "Car Owner" with vehicle details
2. Vehicle automatically created in database
3. Dashboard: Add more vehicles
4. View incoming rental requests
5. Accept/Reject requests with feedback

### Driver Account
1. Register as "Driver" with profile
2. Driver profile automatically created
3. Dashboard: Edit profile (bio, pricing, experience)
4. View incoming booking requests
5. Accept/Reject with feedback

### Tour Guide Account
1. Register as "Tour Guide" with specialties
2. Profile automatically created
3. Dashboard: Edit profile (specialties, pricing)
4. View incoming tour requests
5. Accept/Reject with feedback

## 🔗 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Hotels
- GET `/api/hotels` - Get all hotels
- GET `/api/hotels/:id` - Get hotel details
- POST `/api/hotels` - Create hotel (owner only)
- GET `/api/hotels/:hotelId/rooms` - Get hotel rooms
- POST `/api/hotels/:hotelId/rooms` - Add room (owner only)

### Vehicles
- GET `/api/vehicles` - Get all vehicles
- GET `/api/vehicles/:id` - Get vehicle details
- POST `/api/vehicles` - Add vehicle (owner only)
- GET `/api/vehicles/owner/list` - Get owner's vehicles

### Drivers
- GET `/api/drivers` - Get all drivers
- GET `/api/drivers/:id` - Get driver details
- GET `/api/drivers/profile/me` - Get own profile
- PUT `/api/drivers/profile/update` - Update profile

### Tour Guides
- GET `/api/tour-guides` - Get all tour guides
- GET `/api/tour-guides/:id` - Get guide details
- GET `/api/tour-guides/profile/me` - Get own profile
- PUT `/api/tour-guides/profile/update` - Update profile

### Bookings
- POST `/api/bookings` - Create booking (traveler only)
- GET `/api/bookings/user` - Get user's bookings
- PUT `/api/bookings/:id/cancel` - Cancel booking
- GET `/api/bookings/business/requests` - Get business requests
- POST `/api/bookings/accept/:id` - Accept booking
- POST `/api/bookings/reject/:id` - Reject with feedback

## 🎨 Key Features Implemented

✅ Real-time registration (business entities created instantly)
✅ Role-based dashboards
✅ Incoming requests system with feedback
✅ Account separation (business can't book, travelers can't list)
✅ Pickup/destination ONLY for vehicles
✅ Hotel room management with hourly/daily rates
✅ Profile editing for drivers & tour guides
✅ Rating display on all services
✅ Database persistence (all data saves to phpMyAdmin)

## 📱 Testing the System

1. **Register as Hotel Owner**
   - Go to Register → Business → Hotel Owner
   - Fill in hotel details
   - Check phpMyAdmin - hotel appears in `hotels` table

2. **Register as Traveler**
   - Go to Register → Traveler
   - Login with traveler account
   - Browse hotels page - see the hotel you created
   - Book it - check `bookings` table in phpMyAdmin

3. **Check Dashboard (Hotel Owner)**
   - Login as hotel owner
   - See incoming booking in dashboard
   - Accept/Reject with feedback

## 🐛 Troubleshooting

**Backend won't start?**
- Check MySQL is running (XAMPP)
- Verify port 3307 is correct
- Run: `npm install` in backend folder

**Frontend won't start?**
- Run: `npm install` in frontend folder
- Check port 3000 is available

**Database not connecting?**
- Open phpMyAdmin
- Verify database `car_rental_booking` exists
- Check port in `.env` file (3307 for XAMPP)

**Data not saving?**
- Check browser console for errors
- Verify backend is running on port 5001
- Check network tab in browser dev tools

## 🎯 Next Steps

After starting the project, you can:
1. Create test accounts for each role
2. Upload hotels/vehicles/profiles
3. Make test bookings as traveler
4. Manage requests as business users
5. Verify all data in phpMyAdmin
