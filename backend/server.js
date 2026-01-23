require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { testConnection } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/users');
const licenseRoutes = require('./routes/licenses');
const nidRoutes = require('./routes/nids');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const hotelRoutes = require('./routes/hotels');
const tourGuideRoutes = require('./routes/tourGuides');
const bookingRoutes = require('./routes/bookings');
const promoRoutes = require('./routes/promos');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);  // Alias for admin users API
app.use('/api/licenses', licenseRoutes);
app.use('/api/nids', nidRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tour-guides', tourGuideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
testConnection();

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});