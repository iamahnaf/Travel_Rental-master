const { pool } = require('../config/db');

const hotelImages = [
  {
    id: 1,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ]
  },
  {
    id: 2,
    images: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'
    ]
  },
  {
    id: 3,
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539ce?w=800'
    ]
  }
];

async function addHotelImages() {
  try {
    console.log('Adding multiple images to hotels...\n');
    
    // Get all hotels
    const [hotels] = await pool.execute('SELECT id, name FROM hotels');
    console.log(`Found ${hotels.length} hotels\n`);

    for (const hotel of hotels) {
      // Find matching image set or use default
      const imageSet = hotelImages.find(h => h.id === hotel.id) || hotelImages[0];
      const imageJson = JSON.stringify(imageSet.images);

      await pool.execute(
        'UPDATE hotels SET image_urls = ? WHERE id = ?',
        [imageJson, hotel.id]
      );

      console.log(`✓ Updated "${hotel.name}" (ID: ${hotel.id}) with ${imageSet.images.length} images`);
    }

    console.log('\n✅ All hotels updated successfully!');
    
    // Verify the update
    console.log('\n--- Verification ---');
    const [updated] = await pool.execute('SELECT id, name, image_urls FROM hotels LIMIT 3');
    updated.forEach(h => {
      const images = JSON.parse(h.image_urls || '[]');
      console.log(`${h.name}: ${images.length} images`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

addHotelImages();
