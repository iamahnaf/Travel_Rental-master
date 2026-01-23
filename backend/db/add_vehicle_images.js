const mysql = require('mysql2/promise');
require('dotenv').config();

async function addVehicleImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_rental_booking'
  });

  try {
    // Add images column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE vehicles ADD COLUMN images JSON DEFAULT NULL');
      console.log('✓ Added images column to vehicles table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Images column already exists');
      } else {
        throw error;
      }
    }

    // Update vehicles with multiple images
    const vehicleImages = [
      {
        id: 1,
        images: [
          'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 2,
        images: [
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 3,
        images: [
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 4,
        images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 5,
        images: [
          'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 6,
        images: [
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 7,
        images: [
          'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 8,
        images: [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 9,
        images: [
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 10,
        images: [
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format'
        ]
      },
      {
        id: 11,
        images: [
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&auto=format'
        ]
      }
    ];

    for (const vehicle of vehicleImages) {
      await connection.execute(
        'UPDATE vehicles SET images = ? WHERE id = ?',
        [JSON.stringify(vehicle.images), vehicle.id]
      );
      console.log(`✓ Updated vehicle ${vehicle.id} with ${vehicle.images.length} images`);
    }

    console.log('\n✓ All vehicle images updated successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

addVehicleImages();
