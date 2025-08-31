const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ABC Bus API is running',
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings',
      buses: '/api/buses',
      routes: '/api/routes',
      tracker: '/api/tracker'
    }
  });
});

// API Routes
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    message: 'Bookings endpoint - Demo mode',
    data: []
  });
});

app.post('/api/bookings', (req, res) => {
  const booking = {
    id: 'BK-' + Date.now(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date()
  };
  res.json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
});

app.get('/api/buses', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, busNumber: 'ABC-001', route: 'Manila → Baguio', status: 'active' },
      { id: 2, busNumber: 'ABC-002', route: 'Manila → Vigan', status: 'active' },
      { id: 3, busNumber: 'CEB-001', route: 'Cebu → Dumaguete', status: 'active' }
    ]
  });
});

app.get('/api/routes', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Manila → Baguio', distance: '245km', duration: '5-6 hours' },
      { id: 2, name: 'Manila → Vigan', distance: '400km', duration: '8 hours' },
      { id: 3, name: 'Cebu → Dumaguete', distance: '165km', duration: '3.5 hours' }
    ]
  });
});

app.get('/api/tracker/:busId', (req, res) => {
  const { busId } = req.params;
  res.json({
    success: true,
    data: {
      busId,
      currentLocation: { lat: 14.5995, lng: 120.9842 },
      speed: 65,
      eta: '2 hours',
      nextStop: 'Tarlac Terminal'
    }
  });
});

// Socket.io for real-time tracking
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('track-bus', (busId) => {
    console.log(`Tracking bus ${busId} for client ${socket.id}`);
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      socket.emit('bus-location-update', {
        busId,
        location: {
          lat: 14.5995 + (Math.random() - 0.5) * 0.1,
          lng: 120.9842 + (Math.random() - 0.5) * 0.1
        },
        speed: 60 + Math.random() * 20,
        timestamp: new Date()
      });
    }, 5000);
    
    socket.on('stop-tracking', () => {
      clearInterval(interval);
    });
    
    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected:', socket.id);
    });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});