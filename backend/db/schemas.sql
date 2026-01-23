-- MySQL Database Schema for Car Rental & Hotel Booking Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('traveler', 'driver', 'tour_guide', 'car_owner', 'hotel_owner', 'admin') DEFAULT 'traveler',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Driving licenses table
CREATE TABLE IF NOT EXISTS driving_licenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NID cards table
CREATE TABLE IF NOT EXISTS nid_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    number VARCHAR(20) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid') NOT NULL,
    transmission ENUM('Manual', 'Automatic') NOT NULL,
    seats INT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    with_driver_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    default_fuel_included BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    experience_years INT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_rides INT DEFAULT 0,
    languages JSON, -- Stores array of languages spoken
    location VARCHAR(255),
    city VARCHAR(100),
    bio TEXT,
    available BOOLEAN DEFAULT TRUE,
    price_per_day DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    image_urls JSON, -- Stores array of image URLs
    available_rooms INT NOT NULL,
    total_rooms INT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    amenities JSON, -- Stores array of amenities
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tour guides table
CREATE TABLE IF NOT EXISTS tour_guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    location VARCHAR(255),
    city VARCHAR(100),
    languages JSON, -- Stores array of languages spoken
    specialties JSON, -- Stores array of specialties
    experience_years INT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_tours INT DEFAULT 0,
    price_per_day DECIMAL(10, 2) NOT NULL,
    bio TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_type ENUM('vehicle', 'hotel', 'driver', 'tour-guide') NOT NULL,
    vehicle_id INT NULL,
    hotel_id INT NULL,
    driver_id INT NULL,
    tour_guide_id INT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_lat DECIMAL(10, 8) NULL,
    pickup_lng DECIMAL(11, 8) NULL,
    pickup_address VARCHAR(500) NULL,
    destination_lat DECIMAL(10, 8) NULL,
    destination_lng DECIMAL(11, 8) NULL,
    destination_address VARCHAR(500) NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    cancellation_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    FOREIGN KEY (tour_guide_id) REFERENCES tour_guides(id) ON DELETE SET NULL,
    -- Ensure only one foreign key is set based on booking type
    CHECK (
        (booking_type = 'vehicle' AND vehicle_id IS NOT NULL) OR
        (booking_type = 'hotel' AND hotel_id IS NOT NULL) OR
        (booking_type = 'driver' AND driver_id IS NOT NULL) OR
        (booking_type = 'tour-guide' AND tour_guide_id IS NOT NULL)
    ),
    -- Prevent overlapping bookings for the same resource
    INDEX idx_booking_dates (start_date, end_date),
    INDEX idx_vehicle_bookings (vehicle_id, start_date, end_date),
    INDEX idx_driver_bookings (driver_id, start_date, end_date),
    INDEX idx_hotel_bookings (hotel_id, start_date, end_date)
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2) NULL,
    valid_until DATE NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_count INT DEFAULT 0,
    max_uses INT NULL -- NULL means unlimited
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reviewable_type ENUM('vehicle', 'hotel', 'driver', 'tour-guide') NOT NULL,
    reviewable_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- Indexes for efficient querying
    INDEX idx_reviewable (reviewable_type, reviewable_id),
    INDEX idx_user_reviews (user_id)
);

-- Admin users table (for approving licenses and NIDs)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vehicles_available ON vehicles(available);
CREATE INDEX idx_drivers_available ON drivers(available);
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_promo_codes_validity ON promo_codes(valid_until);