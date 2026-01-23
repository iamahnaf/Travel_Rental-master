const mysql = require('mysql2/promise');
require('dotenv').config();

async function addVehicles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_rental_booking'
  });

  try {
    const vehicles = [
      ['Honda', 'Fit', 2023, 'Petrol', 'Automatic', 5, 1800, 2800, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format', 'Compact and economical hatchback, perfect for navigating busy Dhaka streets.', 1, 1],
      ['Toyota', 'Corolla', 2023, 'Petrol', 'Automatic', 5, 2600, 3600, 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&h=600&fit=crop&auto=format', 'World\'s best-selling car, extremely reliable and comfortable for long journeys.', 1, 1],
      ['Toyota', 'Hiace', 2023, 'Diesel', 'Manual', 15, 4500, 5500, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format', 'Large passenger van perfect for group tours, weddings, and family trips across Bangladesh.', 1, 1],
      ['Nissan', 'X-Trail', 2023, 'Petrol', 'Automatic', 7, 3500, 4500, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format', 'Premium SUV with 7 seats, perfect for comfortable family trips and rough roads.', 1, 1],
      ['Mitsubishi', 'Pajero', 2023, 'Diesel', 'Automatic', 7, 4000, 5000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format', 'Powerful 4WD SUV, excellent for Chittagong Hill Tracts and Cox\'s Bazar trips.', 1, 1],
      ['Honda', 'Vezel', 2023, 'Petrol', 'Automatic', 5, 2800, 3800, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&auto=format', 'Stylish compact SUV, very popular among young professionals in Bangladesh.', 1, 1],
      ['Toyota', 'Noah', 2022, 'Hybrid', 'Automatic', 8, 3800, 4800, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&auto=format', '8-seater hybrid MPV, spacious and fuel-efficient for family trips.', 1, 1],
      ['Suzuki', 'Swift', 2023, 'Petrol', 'Manual', 5, 1600, 2600, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format', 'Sporty compact car, very fuel-efficient and easy to drive in city traffic.', 1, 1]
    ];

    const query = `
      INSERT INTO vehicles (brand, model, year, fuel_type, transmission, seats, price_per_day, with_driver_price, image_url, description, available, default_fuel_included) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const vehicle of vehicles) {
      await connection.execute(query, vehicle);
      console.log(`✓ Added ${vehicle[0]} ${vehicle[1]}`);
    }

    console.log('\n✓ All vehicles added successfully!');

    // Show all vehicles
    const [rows] = await connection.execute('SELECT id, brand, model, year FROM vehicles ORDER BY id');
    console.log('\nVehicles in database:');
    console.table(rows);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

addVehicles();
