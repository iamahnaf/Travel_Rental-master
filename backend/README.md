# Car Rental & Hotel Booking - Backend API

A complete backend REST API for the Car Rental & Hotel Booking Platform built with Node.js, Express, and MySQL.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **mysql2** - MySQL client for Node.js
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcryptjs** - Password hashing
- **Dotenv** - Environment variables

## Features Implemented

### Authentication System
- User registration and login
- JWT-based authentication with httpOnly cookies
- Protected routes for authenticated users only

### User Management
- Registration with name, email, password, phone
- Login with email and password
- Profile management
- JWT token generation and validation

### License Management
- Driving license upload with image
- License status tracking (pending/approved/rejected)
- Admin approval/rejection endpoints
- Get user's driving license status

### NID Card Management
- NID card upload with image and number
- NID card validation (10, 13, or 17 digits)
- Status tracking (pending/approved/rejected)
- Admin approval/rejection endpoints

### Vehicle Management
- Get all vehicles
- Get vehicle by ID
- Get available vehicles for specific dates
- Check for overlapping bookings

### Driver Management
- Get all drivers
- Get driver by ID
- Get available drivers for specific dates
- Check for overlapping bookings

### Hotel Management
- Get all hotels
- Get hotel by ID
- Get available hotels for specific dates
- City-based filtering
- Room availability checks

### Tour Guide Management
- Get all tour guides
- Get tour guide by ID
- Get available tour guides for specific dates
- Check for overlapping bookings

### Booking System
- Create bookings for vehicles, hotels, drivers, and tour guides
- MySQL transaction support for data integrity
- Date overlap prevention
- Pickup location for vehicle bookings
- Driving license validation for "without driver" bookings
- Room availability check for hotels
- Get user's bookings
- Cancel bookings (with room availability restoration)

### Promo Codes
- Get all active promo codes
- Validate promo codes with subtotal
- Calculate discounts based on percentage/fixed amounts
- Minimum amount requirements
- Usage tracking

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Register a new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile (protected)
PUT    /api/auth/profile      - Update user profile (protected)
```

### Licenses
```
POST   /api/licenses/upload        - Upload driving license (protected)
GET    /api/licenses/my-license    - Get user's driving license (protected)
PUT    /api/licenses/:licenseId/status  - Admin: Update license status (protected)
GET    /api/licenses/pending       - Admin: Get pending licenses (protected)
```

### NID Cards
```
POST   /api/nids/upload        - Upload NID card (protected)
GET    /api/nids/my-nid        - Get user's NID card (protected)
PUT    /api/nids/:nidId/status  - Admin: Update NID status (protected)
GET    /api/nids/pending       - Admin: Get pending NIDs (protected)
```

### Vehicles
```
GET    /api/vehicles/           - Get all vehicles
GET    /api/vehicles/:id        - Get vehicle by ID
GET    /api/vehicles/available  - Get available vehicles for dates
```

### Drivers
```
GET    /api/drivers/            - Get all drivers
GET    /api/drivers/:id         - Get driver by ID
GET    /api/drivers/available   - Get available drivers for dates
```

### Hotels
```
GET    /api/hotels/             - Get all hotels
GET    /api/hotels/:id          - Get hotel by ID
GET    /api/hotels/available    - Get available hotels for dates
```

### Tour Guides
```
GET    /api/tour-guides/        - Get all tour guides
GET    /api/tour-guides/:id     - Get tour guide by ID
GET    /api/tour-guides/available - Get available tour guides for dates
```

### Bookings
```
POST   /api/bookings/           - Create a new booking (protected)
GET    /api/bookings/           - Get user's bookings (protected)
GET    /api/bookings/:id        - Get specific booking (protected)
PUT    /api/bookings/:id/cancel - Cancel booking (protected)
```

### Promo Codes
```
GET    /api/promos/             - Get all active promo codes
POST   /api/promos/validate     - Validate promo code with subtotal
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_booking

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Database Schema

The database schema is defined in `db/schemas.sql` and includes tables for:
- Users
- Driving licenses
- NID cards
- Vehicles
- Drivers
- Hotels
- Tour guides
- Bookings
- Promo codes
- Reviews
- Admin users

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up your MySQL database and run the schema from `db/schemas.sql`

3. Create a `.env` file with your environment variables

4. Start the server:
```bash
npm run dev  # for development
npm start    # for production
```

## Key Features

- **Transaction Support**: All booking operations use MySQL transactions for data integrity
- **Date Overlap Prevention**: Prevents double-booking of resources
- **License Validation**: Checks for approved driving license when booking without driver
- **File Uploads**: Secure image upload handling for licenses and NIDs
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Centralized error handling middleware

## Security Features

- Password hashing with bcrypt
- JWT token validation
- Input sanitization and validation
- SQL injection prevention with prepared statements
- Helmet.js for security headers
- CORS configuration
- File upload validation

## Frontend Integration

This backend is designed to work seamlessly with the existing frontend, supporting all the required flows:
- User authentication and dashboard access
- NID card requirement for hotel bookings
- Sticky image galleries on detail pages
- Complete booking workflow with driver selection and pickup location
- Promo code integration
- Driving license validation