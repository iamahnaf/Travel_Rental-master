const { pool } = require('../config/db');

// High-quality car images showing different angles (front, side, back, interior, seats)
const vehicleImages = {
  // Toyota Camry - Sedan
  'Toyota Camry': [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', // Front view
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', // Side view
    'https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800', // Back view
    'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800', // Interior
    'https://images.unsplash.com/photo-1619405399571-7e5c6f9c5fb3?w=800'  // Seats
  ],
  
  // Honda Civic - Compact
  'Honda Civic': [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', // Front
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', // Side
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800', // Back
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800', // Interior
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'  // Dashboard
  ],
  
  // BMW X5 - SUV
  'BMW X5': [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', // Front
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', // Side
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800', // Back
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', // Interior
    'https://images.unsplash.com/photo-1606016159991-f90d7c8f5fd0?w=800'  // Seats
  ],
  
  // Ford Mustang - Sports
  'Ford Mustang': [
    'https://images.unsplash.com/photo-1584345604476-8ec5f5e0b16e?w=800', // Front
    'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800', // Side
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', // Back
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', // Interior
    'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800'  // Dashboard
  ],
  
  // Mercedes-Benz E-Class
  'Mercedes-Benz E-Class': [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', // Front
    'https://images.unsplash.com/photo-1617531653520-bd788689d32f?w=800', // Side
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', // Back
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800', // Interior
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800'  // Seats
  ],
  
  // Default car images (general sedan)
  'default': [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', // Front
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', // Side
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', // Back
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800', // Interior
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800'  // Seats
  ]
};

async function updateVehicleImages() {
  try {
    console.log('Updating vehicle images with front, side, back, and interior views...\n');
    
    // Get all vehicles
    const [vehicles] = await pool.execute('SELECT id, brand, model FROM vehicles');
    console.log(`Found ${vehicles.length} vehicles\n`);

    for (const vehicle of vehicles) {
      const fullName = `${vehicle.brand} ${vehicle.model}`;
      
      // Find matching image set or use default
      let imageSet = vehicleImages[fullName] || vehicleImages[vehicle.brand] || vehicleImages.default;
      const imageJson = JSON.stringify(imageSet);

      await pool.execute(
        'UPDATE vehicles SET images = ? WHERE id = ?',
        [imageJson, vehicle.id]
      );

      console.log(`✓ Updated "${fullName}" (ID: ${vehicle.id}) with ${imageSet.length} images`);
      console.log(`  Images: Front, Side, Back, Interior, Seats/Dashboard`);
    }

    console.log('\n✅ All vehicles updated successfully!');
    
    // Verify the update
    console.log('\n--- Verification ---');
    const [updated] = await pool.execute('SELECT id, brand, model, images FROM vehicles LIMIT 5');
    updated.forEach(v => {
      try {
        const images = JSON.parse(v.images || '[]');
        console.log(`${v.brand} ${v.model}: ${images.length} images`);
      } catch (e) {
        console.log(`${v.brand} ${v.model}: Error parsing images`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

updateVehicleImages();
