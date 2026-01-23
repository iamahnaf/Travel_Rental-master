require('dotenv').config();
const { createConnection } = require('mysql2/promise');

async function runMigration() {
  let connection;

  try {
    console.log('Connecting to MySQL...');
    
    // Connect without specifying database first
    connection = await createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'car_rental_booking';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database \`${dbName}\` created or already exists`);

    // Use the database
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`Using database \`${dbName}\``);

    // Create tables
    console.log('Creating tables...');
    
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Driving licenses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS driving_licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // NID cards table
    await connection.query(`
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
    `);

    // Vehicles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Drivers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Hotels table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Tour guides table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tour_guides (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Bookings table
    await connection.query(`
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
        pickup_lat DECIMAL(10, 8) NULL, -- For vehicle bookings
        pickup_lng DECIMAL(11, 8) NULL, -- For vehicle bookings
        pickup_address VARCHAR(500) NULL, -- For vehicle bookings
        total_price DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL,
        FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
        FOREIGN KEY (tour_guide_id) REFERENCES tour_guides(id) ON DELETE SET NULL,
        -- Ensure only one foreign key is set based on booking type
        INDEX idx_booking_dates (start_date, end_date),
        INDEX idx_vehicle_bookings (vehicle_id, start_date, end_date),
        INDEX idx_driver_bookings (driver_id, start_date, end_date),
        INDEX idx_hotel_bookings (hotel_id, start_date, end_date)
      );
    `);

    // Promo codes table
    await connection.query(`
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
    `);

    // Reviews table
    await connection.query(`
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
    `);

    // Admin users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    try { await connection.query('CREATE INDEX idx_users_email ON users(email);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_vehicles_available ON vehicles(available);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_drivers_available ON drivers(available);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_hotels_city ON hotels(city);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_bookings_user_id ON bookings(user_id);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_bookings_status ON bookings(status);'); } catch (e) {}
    try { await connection.query('CREATE INDEX idx_promo_codes_validity ON promo_codes(valid_until);'); } catch (e) {}

    console.log('All tables created successfully!');

    // Insert some sample promo codes
    const promoCodes = [
      { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_amount: 2000, description: '10% off on bookings above ৳2,000' },
      { code: 'SAVE500', discount_type: 'fixed', discount_value: 500, min_amount: 3000, description: '৳500 off on bookings above ৳3,000' },
      { code: 'SUMMER20', discount_type: 'percentage', discount_value: 20, min_amount: 5000, max_discount: 2000, description: '20% off (max ৳2,000) on bookings above ৳5,000' },
      { code: 'FIRST50', discount_type: 'fixed', discount_value: 50, min_amount: 500, description: '৳50 off on your first booking' },
      { code: 'WEEKEND15', discount_type: 'percentage', discount_value: 15, min_amount: 2500, description: '15% off on weekend bookings above ৳2,500' }
    ];

    for (const promo of promoCodes) {
      const [result] = await connection.query(
        'INSERT IGNORE INTO promo_codes (code, discount_type, discount_value, min_amount, max_discount, description) VALUES (?, ?, ?, ?, ?, ?)',
        [promo.code, promo.discount_type, promo.discount_value, promo.min_amount, promo.max_discount || null, promo.description]
      );
    }

    console.log('Sample promo codes inserted successfully!');

    // Insert sample data for testing
    // Sample vehicles
    await connection.query(`
      INSERT IGNORE INTO vehicles (id, brand, model, year, fuel_type, transmission, seats, price_per_day, with_driver_price, image_url, description, available, default_fuel_included) 
      VALUES 
      (1, 'Toyota', 'Axio', 2023, 'Petrol', 'Automatic', 5, 2200.00, 3200.00, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop&auto=format', 'Popular Japanese sedan, extremely reliable and fuel-efficient. Perfect for city driving in Dhaka.', 1, 1),
      (2, 'Toyota', 'Premio', 2022, 'Petrol', 'Automatic', 5, 2500.00, 3500.00, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&auto=format', 'Comfortable sedan with premium features, very popular in Bangladesh for business and family use.', 1, 1),
      (3, 'Honda', 'Fit', 2023, 'Petrol', 'Automatic', 5, 1800.00, 2800.00, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format', 'Compact and economical hatchback, perfect for navigating busy Dhaka streets.', 1, 1)
    `);

    // Sample drivers
    await connection.query(`
      INSERT IGNORE INTO drivers (id, name, photo_url, experience_years, rating, total_rides, languages, location, city, bio, available, price_per_day) 
      VALUES 
      (1, 'Abdul Karim', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format', 8, 4.8, 1250, '["Bengali", "English", "Hindi"]', 'Dhanmondi', 'Dhaka', 'Professional driver with 8 years of experience. Specializes in city driving and long-distance trips. Very punctual and safety-conscious.', 1, 1500.00),
      (2, 'Mohammad Hasan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format', 5, 4.6, 890, '["Bengali", "English"]', 'Gulshan', 'Dhaka', 'Young and energetic driver with excellent knowledge of Dhaka city. Great for airport transfers and city tours.', 1, 1300.00)
    `);

    // Sample hotels
    await connection.query(`
      INSERT IGNORE INTO hotels (id, name, location, city, price_per_night, image_urls, available_rooms, total_rooms, rating, amenities, description) 
      VALUES 
      (1, 'Grand Dhaka Hotel', '123 Dhanmondi Road', 'Dhaka', 3500.00, '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format"]', 12, 20, 4.5, '["WiFi", "AC", "Swimming Pool", "Restaurant", "24/7 Reception", "Parking"]', 'Luxurious hotel in the heart of Dhaka with modern amenities and excellent service.'),
      (2, 'Chittagong Bay Hotel', '456 Agrabad Commercial Area', 'Chittagong', 3200.00, '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&auto=format"]', 8, 15, 4.7, '["WiFi", "AC", "Breakfast", "Gym", "Business Center", "Room Service"]', 'Modern hotel with great facilities near the commercial area. Perfect for business travelers.')
    `);

    // Sample tour guides
    await connection.query(`
      INSERT IGNORE INTO tour_guides (id, name, photo_url, location, city, languages, specialties, experience_years, rating, total_tours, price_per_day, bio, available) 
      VALUES 
      (1, 'Ahmed Rahman', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format', 'Old Dhaka', 'Dhaka', '["Bengali", "English", "Hindi"]', '["Historical Tours", "Cultural Heritage", "Food Tours"]', 8, 4.8, 450, 2500.00, 'Passionate local guide with deep knowledge of Dhakas rich history and culture. Specializes in showing visitors the hidden gems of Old Dhaka.', 1),
      (2, 'Rashida Begum', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format', 'Gulshan', 'Dhaka', '["Bengali", "English"]', '["City Tours", "Shopping Tours", "Modern Dhaka"]', 5, 4.7, 320, 2200.00, 'Friendly and energetic guide specializing in modern Dhaka. Perfect for first-time visitors who want to explore the citys contemporary side.', 1)
    `);

    console.log('Sample data inserted successfully!');

    console.log('\nMigration completed successfully!');
    console.log(`Database: ${dbName}`);
    console.log('Tables created:');
    console.log('- users');
    console.log('- driving_licenses');
    console.log('- nid_cards');
    console.log('- vehicles');
    console.log('- drivers');
    console.log('- hotels');
    console.log('- tour_guides');
    console.log('- bookings');
    console.log('- promo_codes');
    console.log('- reviews');
    console.log('- admins');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };