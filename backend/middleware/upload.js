const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get the base directory (where server.js is located)
const baseDir = path.resolve(__dirname, '..');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path from base directory
    const uploadPath = path.join(baseDir, 'public', 'uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middleware for different field names
const uploadPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export different configurations for different field names
module.exports = {
  singlePhoto: uploadPhoto.single('photo'),
  singleLicense: uploadPhoto.single('license'),
  single: uploadPhoto.single
};
