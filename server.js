const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Configure CORS for production
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://abc-bus-demo.netlify.app'] 
  : ['http://localhost:3000'];

const io = socketIo(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'abc-bus-secret-key';

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./abc_bus.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Routes table
  db.run(`CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    fare REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Buses table
  db.run(`CREATE TABLE IF NOT EXISTS buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_number TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40,
    route_id INTEGER,
    current_lat REAL,
    current_lng REAL,
    status TEXT DEFAULT 'inactive',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id)
  )`);

  // Schedules table
  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER,
    bus_id INTEGER,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    departure_date DATE NOT NULL,
    available_seats INTEGER DEFAULT 40,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
  )`);

  // Bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    schedule_id INTEGER,
    seat_numbers TEXT NOT NULL,
    total_amount REAL NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    qr_code TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
  )`);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Wait for tables to be created before inserting data
  setTimeout(() => {
    // Insert demo user
    const hashedPassword = '$2b$10$demopasswordhash'; // Demo password hash
    db.run(`INSERT OR IGNORE INTO users (id, username, email, password, phone) VALUES (?, ?, ?, ?, ?)`, 
      [1, 'Demo User', 'demo@abcbus.com', hashedPassword, '09171234567']);

    // Comprehensive Philippine routes with major cities
    const routes = [
      // From Manila
      ['Manila', 'Baguio', 250, 360, 580.00],
      ['Manila', 'Cebu', 700, 90, 1450.00], // (flight time for reference)
      ['Manila', 'Davao', 1500, 120, 2650.00], // (flight time for reference)
      ['Manila', 'Iloilo', 584, 80, 1250.00],
      ['Manila', 'Bacolod', 600, 85, 1300.00],
      ['Manila', 'Cagayan de Oro', 1200, 110, 2200.00],
      ['Manila', 'Zamboanga', 1400, 130, 2500.00],
      ['Manila', 'Puerto Princesa', 580, 80, 1200.00],
      ['Manila', 'Legazpi', 350, 480, 620.00],
      ['Manila', 'Vigan', 480, 600, 850.00],
      ['Manila', 'Tuguegarao', 520, 660, 920.00],
      ['Manila', 'Laoag', 580, 720, 1050.00],
      
      // From Quezon City
      ['Quezon City', 'Tagaytay', 65, 120, 180.00],
      ['Quezon City', 'Baguio', 245, 350, 560.00],
      ['Quezon City', 'Subic', 120, 180, 320.00],
      ['Quezon City', 'Bataan', 140, 200, 380.00],
      ['Quezon City', 'Batangas', 110, 150, 300.00],
      ['Quezon City', 'Lucena', 140, 180, 350.00],
      
      // From Cebu
      ['Cebu', 'Tagbilaran', 70, 120, 280.00], // (with ferry)
      ['Cebu', 'Dumaguete', 180, 240, 420.00],
      ['Cebu', 'Ormoc', 150, 180, 380.00],
      ['Cebu', 'Tacloban', 200, 300, 480.00],
      ['Cebu', 'Cagayan de Oro', 280, 360, 650.00],
      ['Cebu', 'Butuan', 320, 420, 750.00],
      
      // From Davao
      ['Davao', 'Cagayan de Oro', 250, 300, 580.00],
      ['Davao', 'Butuan', 180, 240, 450.00],
      ['Davao', 'Surigao', 280, 360, 620.00],
      ['Davao', 'General Santos', 180, 240, 420.00],
      ['Davao', 'Zamboanga', 350, 480, 780.00],
      
      // Regional Routes - Luzon
      ['Baguio', 'Vigan', 280, 360, 520.00],
      ['Baguio', 'Laoag', 350, 450, 680.00],
      ['Baguio', 'Tuguegarao', 400, 540, 750.00],
      ['Baguio', 'San Fernando', 60, 90, 150.00],
      ['Baguio', 'Dagupan', 120, 180, 280.00],
      
      // Southern Luzon
      ['Batangas', 'Tagaytay', 45, 60, 120.00],
      ['Batangas', 'Puerto Princesa', 320, 420, 680.00], // (with ferry)
      ['Lucena', 'Naga', 180, 240, 420.00],
      ['Naga', 'Legazpi', 120, 180, 320.00],
      ['Legazpi', 'Sorsogon', 80, 120, 220.00],
      
      // Visayas Routes
      ['Iloilo', 'Bacolod', 120, 150, 320.00],
      ['Iloilo', 'Dumaguete', 200, 280, 480.00],
      ['Bacolod', 'Dumaguete', 150, 200, 380.00],
      ['Tacloban', 'Ormoc', 80, 120, 220.00],
      ['Catbalogan', 'Tacloban', 120, 180, 320.00],
      
      // Mindanao Routes
      ['Cagayan de Oro', 'Iligan', 60, 90, 180.00],
      ['Cagayan de Oro', 'Butuan', 120, 180, 320.00],
      ['Cagayan de Oro', 'Malaybalay', 80, 120, 220.00],
      ['General Santos', 'Koronadal', 45, 60, 150.00],
      ['General Santos', 'Kidapawan', 90, 120, 250.00],
      ['Zamboanga', 'Pagadian', 120, 180, 320.00],
      ['Zamboanga', 'Dipolog', 180, 240, 420.00],
      
      // Island Connections (includes ferry time)
      ['Manila', 'Caticlan', 380, 480, 750.00],
      ['Manila', 'Tagbilaran', 650, 720, 1350.00],
      ['Manila', 'Siquijor', 680, 780, 1450.00],
      ['Cebu', 'Puerto Princesa', 450, 540, 950.00],
      
      // Northern Routes
      ['Tuguegarao', 'Aparri', 80, 120, 220.00],
      ['Tuguegarao', 'Ilagan', 60, 90, 180.00],
      ['Laoag', 'Pagudpud', 45, 60, 150.00],
      ['Vigan', 'Candon', 30, 45, 120.00],
      
      // Mountain Province Routes
      ['Baguio', 'Sagada', 150, 240, 380.00],
      ['Baguio', 'Bontoc', 120, 180, 320.00],
      ['Baguio', 'Tabuk', 200, 300, 480.00]
    ];

    routes.forEach(route => {
      db.run(`INSERT OR IGNORE INTO routes (origin, destination, distance, duration, fare) VALUES (?, ?, ?, ?, ?)`, route);
    });

    // Comprehensive bus fleet
    const buses = [
      // Manila routes
      ['ABC-001', 40, 1], ['ABC-002', 40, 1], ['ABC-003', 40, 1],
      ['ABC-004', 40, 2], ['ABC-005', 40, 2], 
      ['ABC-006', 40, 3], ['ABC-007', 40, 3],
      ['ABC-008', 40, 4], ['ABC-009', 40, 5], ['ABC-010', 40, 6],
      ['ABC-011', 40, 7], ['ABC-012', 40, 8], ['ABC-013', 40, 9],
      ['ABC-014', 40, 10], ['ABC-015', 40, 11], ['ABC-016', 40, 12],
      
      // Quezon City routes  
      ['QC-001', 40, 13], ['QC-002', 40, 13], ['QC-003', 40, 14],
      ['QC-004', 40, 15], ['QC-005', 40, 16], ['QC-006', 40, 17],
      ['QC-007', 40, 18],
      
      // Cebu routes
      ['CEB-001', 40, 19], ['CEB-002', 40, 20], ['CEB-003', 40, 21],
      ['CEB-004', 40, 22], ['CEB-005', 40, 23], ['CEB-006', 40, 24],
      
      // Davao routes
      ['DVO-001', 40, 25], ['DVO-002', 40, 26], ['DVO-003', 40, 27],
      ['DVO-004', 40, 28], ['DVO-005', 40, 29],
      
      // Regional buses
      ['REG-001', 40, 30], ['REG-002', 40, 31], ['REG-003', 40, 32],
      ['REG-004', 40, 33], ['REG-005', 40, 34], ['REG-006', 40, 35],
      ['REG-007', 40, 36], ['REG-008', 40, 37], ['REG-009', 40, 38],
      ['REG-010', 40, 39], ['REG-011', 40, 40], ['REG-012', 40, 41]
    ];

    buses.forEach(bus => {
      db.run(`INSERT OR IGNORE INTO buses (bus_number, capacity, route_id) VALUES (?, ?, ?)`, bus);
    });

    // Generate comprehensive schedules for multiple days
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Popular departure times
    const morningTimes = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'];
    const afternoonTimes = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    const eveningTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
    const allTimes = [...morningTimes, ...afternoonTimes, ...eveningTimes];

    const schedules = [];
    
    // Generate schedules to ensure every route has multiple trips
    for (let routeId = 1; routeId <= 63; routeId++) { // We have 63 routes
      const dates = [today, tomorrow, dayAfter];
      
      dates.forEach(date => {
        // Each route gets 3-6 trips per day
        const tripsPerDay = Math.floor(Math.random() * 4) + 3; // 3-6 trips
        
        for (let trip = 0; trip < tripsPerDay; trip++) {
          const timeIndex = (routeId * tripsPerDay + trip) % allTimes.length;
          const departureTime = allTimes[timeIndex];
          
          // Find a bus for this route (some routes share buses)
          const busId = Math.min(routeId + Math.floor(Math.random() * 3), 53); // Max 53 buses
          
          // Calculate arrival time based on route (add 1-12 hours)
          const depHour = parseInt(departureTime.split(':')[0]);
          const depMin = parseInt(departureTime.split(':')[1]);
          const durationHours = Math.floor(Math.random() * 11) + 1; // 1-12 hours
          const durationMinutes = Math.floor(Math.random() * 60); // 0-59 minutes
          
          const totalMinutes = (depHour * 60 + depMin + durationHours * 60 + durationMinutes) % (24 * 60);
          const arrHour = Math.floor(totalMinutes / 60);
          const arrMin = totalMinutes % 60;
          const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;
          
          // Random available seats (realistic occupancy)
          const availableSeats = Math.floor(Math.random() * 35) + 5; // 5-40 seats
          
          schedules.push([routeId, busId, departureTime, arrivalTime, date, availableSeats]);
        }
      });
    }

    // Insert all schedules
    schedules.forEach(schedule => {
      db.run(`INSERT OR IGNORE INTO schedules (route_id, bus_id, departure_time, arrival_time, departure_date, available_seats) VALUES (?, ?, ?, ?, ?, ?)`, schedule);
    });
  }, 1000); // Wait 1 second for tables to be created
}

// Demo mode - no authentication required
const authenticateToken = (req, res, next) => {
  // Set demo user for all requests
  req.user = {
    userId: 1,
    username: 'Demo User'
  };
  next();
};

// API Routes
app.post('/api/register', async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, phone],
      function(err) {
        if (err) {
          res.status(400).json({ error: 'User already exists or invalid data' });
        } else {
          const token = jwt.sign({ userId: this.lastID, username }, JWT_SECRET);
          res.json({ message: 'User registered successfully', token, userId: this.lastID });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
      res.json({ message: 'Login successful', token, userId: user.id });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.get('/api/routes', (req, res) => {
  db.all(`SELECT * FROM routes`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/schedules', (req, res) => {
  const { origin, destination, date } = req.query;
  
  let query = `
    SELECT s.*, r.origin, r.destination, r.fare, b.bus_number, b.capacity
    FROM schedules s
    JOIN routes r ON s.route_id = r.id
    JOIN buses b ON s.bus_id = b.id
    WHERE s.status = 'scheduled' AND s.available_seats > 0
  `;
  
  const params = [];
  
  if (origin && destination) {
    query += ` AND r.origin = ? AND r.destination = ?`;
    params.push(origin, destination);
  }
  
  if (date) {
    query += ` AND s.departure_date = ?`;
    params.push(date);
  }
  
  query += ` ORDER BY s.departure_date, s.departure_time`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      // Demo mode: Always provide schedules for demonstration
      if (rows.length === 0 && origin && destination) {
        // Generate demo schedules for the requested route
        const demoSchedules = [
          {
            id: 999001,
            route_id: 1,
            bus_id: 1,
            departure_time: '08:00',
            arrival_time: '14:00',
            departure_date: date,
            available_seats: 25,
            status: 'scheduled',
            origin: origin,
            destination: destination,
            fare: 580.00,
            bus_number: 'ABC-DEMO1',
            capacity: 40
          },
          {
            id: 999002,
            route_id: 1,
            bus_id: 2,
            departure_time: '14:30',
            arrival_time: '20:30',
            departure_date: date,
            available_seats: 18,
            status: 'scheduled',
            origin: origin,
            destination: destination,
            fare: 580.00,
            bus_number: 'ABC-DEMO2',
            capacity: 40
          },
          {
            id: 999003,
            route_id: 1,
            bus_id: 3,
            departure_time: '21:00',
            arrival_time: '03:00',
            departure_date: date,
            available_seats: 32,
            status: 'scheduled',
            origin: origin,
            destination: destination,
            fare: 580.00,
            bus_number: 'ABC-DEMO3',
            capacity: 40
          }
        ];
        res.json(demoSchedules);
      } else {
        res.json(rows);
      }
    }
  });
});

app.get('/api/buses/:busId/location', (req, res) => {
  const { busId } = req.params;
  
  db.get(`SELECT current_lat, current_lng, status, bus_number FROM buses WHERE id = ?`, [busId], (err, bus) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else if (!bus) {
      res.status(404).json({ error: 'Bus not found' });
    } else {
      res.json(bus);
    }
  });
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { scheduleId, seatNumbers } = req.body;
  const userId = req.user.userId;
  const bookingReference = 'ABC' + Date.now().toString().slice(-8);

  try {
    // Check if this is a demo schedule (ID >= 999000)
    if (scheduleId >= 999000) {
      // Handle demo schedule booking
      const totalAmount = 580.00 * seatNumbers.length; // Demo fare
      
      // Create booking with pending payment (using a placeholder schedule_id)
      db.run(`
        INSERT INTO bookings (booking_reference, user_id, schedule_id, seat_numbers, total_amount, payment_status, status)
        VALUES (?, ?, ?, ?, ?, 'pending', 'pending')
      `, [bookingReference, userId, 1, JSON.stringify(seatNumbers), totalAmount], function(err) {
        if (err) {
          res.status(500).json({ error: 'Failed to create booking' });
        } else {
          res.json({
            bookingId: this.lastID,
            bookingReference,
            totalAmount,
            currency: 'PHP',
            message: 'Booking created. Please proceed to payment.',
            isDemo: true
          });
        }
      });
    } else {
      // Get schedule and fare information for regular schedules
      db.get(`
        SELECT s.*, r.fare 
        FROM schedules s 
        JOIN routes r ON s.route_id = r.id 
        WHERE s.id = ?
      `, [scheduleId], async (err, schedule) => {
        if (err || !schedule) {
          return res.status(404).json({ error: 'Schedule not found' });
        }

        if (schedule.available_seats < seatNumbers.length) {
          return res.status(400).json({ error: 'Not enough available seats' });
        }

        const totalAmount = schedule.fare * seatNumbers.length;

        // Create booking with pending payment
        db.run(`
          INSERT INTO bookings (booking_reference, user_id, schedule_id, seat_numbers, total_amount, payment_status, status)
          VALUES (?, ?, ?, ?, ?, 'pending', 'pending')
        `, [bookingReference, userId, scheduleId, JSON.stringify(seatNumbers), totalAmount], function(err) {
          if (err) {
            res.status(500).json({ error: 'Failed to create booking' });
          } else {
            res.json({
              bookingId: this.lastID,
              bookingReference,
              totalAmount,
              currency: 'PHP',
              message: 'Booking created. Please proceed to payment.'
            });
          }
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/payments/process', authenticateToken, async (req, res) => {
  const { bookingId, paymentMethod } = req.body;
  
  // Simulate payment processing (In production, integrate with PayMongo, GCash, etc.)
  const paymentReference = 'PAY' + Date.now().toString();
  
  // Update booking with payment information
  db.run(`
    UPDATE bookings 
    SET payment_status = 'completed', payment_method = ?, payment_reference = ?, status = 'confirmed'
    WHERE id = ? AND user_id = ?
  `, [paymentMethod, paymentReference, bookingId, req.user.userId], function(err) {
    if (err) {
      res.status(500).json({ error: 'Payment processing failed' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Booking not found' });
    } else {
      // Generate QR code after successful payment
      generateQRCodeForBooking(bookingId, (qrCode) => {
        res.json({
          message: 'Payment successful',
          paymentReference,
          qrCode
        });
      });
    }
  });
});

function generateQRCodeForBooking(bookingId, callback) {
  // Get booking details
  db.get(`
    SELECT b.*, s.departure_time, s.departure_date, r.origin, r.destination, bus.bus_number
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    JOIN buses bus ON s.bus_id = bus.id
    WHERE b.id = ?
  `, [bookingId], async (err, booking) => {
    if (err || !booking) {
      return callback(null);
    }

    const qrData = {
      company: 'ABC Bus Lines',
      bookingReference: booking.booking_reference,
      busNumber: booking.bus_number,
      route: `${booking.origin} → ${booking.destination}`,
      departure: `${booking.departure_date} ${booking.departure_time}`,
      seats: JSON.parse(booking.seat_numbers),
      amount: `₱${booking.total_amount}`,
      passenger: 'Demo User',
      status: 'CONFIRMED',
      validUntil: booking.departure_date,
      ticketId: `TKT-${booking.booking_reference}-${Date.now().toString().slice(-6)}`,
      instructions: 'Present this QR code to the conductor for boarding'
    };

    try {
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
      
      // Save QR code to database
      db.run(`UPDATE bookings SET qr_code = ? WHERE id = ?`, [qrCode, bookingId]);
      
      callback(qrCode);
    } catch (error) {
      callback(null);
    }
  });
}

app.get('/api/bookings', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.all(`
    SELECT b.*, s.departure_time, s.departure_date, s.arrival_time,
           r.origin, r.destination, bus.bus_number
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.id
    JOIN routes r ON s.route_id = r.id
    JOIN buses bus ON s.bus_id = bus.id
    WHERE b.user_id = ?
    ORDER BY s.departure_date DESC, s.departure_time DESC
  `, [userId], (err, bookings) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(bookings.map(booking => ({
        ...booking,
        seat_numbers: JSON.parse(booking.seat_numbers)
      })));
    }
  });
});

// Socket.io for real-time bus tracking
io.on('connection', (socket) => {
  console.log('Client connected for real-time tracking');
  
  socket.on('track-bus', (busId) => {
    // Simulate real-time bus location updates
    const interval = setInterval(() => {
      // In production, this would receive real GPS data
      const mockLocation = {
        lat: 14.5995 + (Math.random() - 0.5) * 0.01,
        lng: 120.9842 + (Math.random() - 0.5) * 0.01,
        timestamp: new Date()
      };
      
      socket.emit('bus-location-update', { busId, location: mockLocation });
    }, 5000);
    
    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ABC Bus Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${corsOrigins.join(', ')}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});