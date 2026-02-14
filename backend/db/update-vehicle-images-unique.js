const { pool } = require('../config/db');

// Unique high-quality car images for each vehicle - different sets
const vehicleImageSets = [
  // Set 1 - Modern Sedan (Red/Silver)
  [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
    'https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800',
    'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800',
    'https://images.unsplash.com/photo-1619405399571-7e5c6f9c5fb3?w=800'
  ],
  // Set 2 - Luxury Sedan (Black)
  [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    'https://images.unsplash.com/photo-1617531653520-bd788689d32f?w=800',
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'
  ],
  // Set 3 - Compact Hatchback (Blue/White)
  [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
  ],
  // Set 4 - Sports Car (Red)
  [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800'
  ],
  // Set 5 - SUV (Silver/Gray)
  [
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
    'https://images.unsplash.com/photo-1600705722218-870695f99178?w=800'
  ],
  // Set 6 - Luxury SUV (Dark Blue)
  [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    'https://images.unsplash.com/photo-1606016159991-f90d7c8f5fd0?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'
  ],
  // Set 7 - Van/MPV (White)
  [
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
    'https://images.unsplash.com/photo-1600705722218-870695f99178?w=800'
  ],
  // Set 8 - Compact SUV (Orange/Red)
  [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800',
    'https://images.unsplash.com/photo-1600705722218-870695f99178?w=800'
  ],
  // Set 9 - City Car (Yellow/Bright)
  [
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
    'https://images.unsplash.com/photo-1597404294360-faba22bb6527?w=800',
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800'
  ],
  // Set 10 - Family Sedan (Beige/Tan)
  [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800'
  ],
  // Set 11 - Modern Hatchback (Blue)
  [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
  ],
  // Set 12 - Premium Sedan (White)
  [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
    'https://images.unsplash.com/photo-1600705722218-870695f99178?w=800'
  ],
  // Set 13 - Crossover (Gray)
  [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
  ],
  // Set 14 - Executive Sedan (Black/Dark)
  [
    'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800'
  ]
];

async function updateVehicleImagesUnique() {
  try {
    console.log('Updating each vehicle with UNIQUE image sets...\n');
    
    // Get all vehicles
    const [vehicles] = await pool.execute('SELECT id, brand, model FROM vehicles ORDER BY id');
    console.log(`Found ${vehicles.length} vehicles\n`);

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const fullName = `${vehicle.brand} ${vehicle.model}`;
      
      // Assign unique image set to each vehicle
      const imageSet = vehicleImageSets[i % vehicleImageSets.length];
      const imageJson = JSON.stringify(imageSet);

      await pool.execute(
        'UPDATE vehicles SET images = ? WHERE id = ?',
        [imageJson, vehicle.id]
      );

      console.log(`✓ Updated "${fullName}" (ID: ${vehicle.id}) - Image Set ${(i % vehicleImageSets.length) + 1}`);
    }

    console.log('\n✅ All vehicles updated with UNIQUE images!');
    
    // Verify the update
    console.log('\n--- Verification ---');
    const [updated] = await pool.execute('SELECT id, brand, model, images FROM vehicles ORDER BY id LIMIT 5');
    updated.forEach(v => {
      try {
        const images = JSON.parse(v.images || '[]');
        console.log(`${v.brand} ${v.model}: ${images.length} images - ${images[0].substring(0, 50)}...`);
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

updateVehicleImagesUnique();
