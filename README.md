# 🚌 ABC Bus - Advanced Bus Booking System Demo

A modern bus booking system with 3D visualization, real-time tracking, and AI-powered business assistant for the Philippines market.

## ✨ Features

- **🎫 Bus Booking System**
  - Search routes and schedules
  - Interactive seat selection (bus layout)
  - Real-time seat availability
  - Multiple route options

- **💳 Payment Processing (Philippines)**
  - GCash integration
  - PayMaya support
  - GrabPay option
  - Online banking (BPI, BDO, etc.)
  - Credit/Debit cards
  - 7-Eleven over-the-counter payment
  - All amounts in PHP (Philippine Peso)

- **📱 QR Code Tickets**
  - Generated after successful payment
  - Secure QR codes with booking details
  - Mobile-friendly ticket display
  - Easy boarding process

- **📍 GPS Bus Tracking**
  - Real-time bus location tracking
  - Interactive map with live updates
  - Bus status monitoring
  - Passenger count tracking
  - ETA calculations

- **📅 Schedule Management**
  - Multiple daily schedules
  - Route management
  - Capacity monitoring
  - Status updates

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **Socket.io** for real-time tracking
- **QRCode** generation
- **JWT** authentication
- **bcrypt** for password security

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **React Leaflet** for maps
- **Socket.io Client** for real-time updates
- **Axios** for API calls
- **React Toastify** for notifications

### Payment Integration
- **PayMongo** for Philippine payments
- **Stripe** for additional payment options
- Support for local payment methods

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd "ABC BUS"
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - React frontend on http://localhost:3000

5. **Access the application**
   - Open your browser and go to http://localhost:3000
   - Create an account or login
   - Start booking your journey!

## 📱 How to Use

### For Passengers

1. **Register/Login**
   - Create account with email and mobile number
   - Secure login with JWT tokens

2. **Search & Book**
   - Select origin and destination
   - Choose travel date
   - View available schedules
   - Select preferred seats

3. **Payment**
   - Choose from multiple PHP payment methods
   - Secure payment processing
   - Instant confirmation

4. **Get QR Ticket**
   - Download/view QR code ticket
   - Show at boarding for verification
   - All trip details included

5. **Track Your Bus**
   - Real-time GPS tracking
   - See bus location on map
   - Get status updates
   - Monitor ETA

### Sample Routes & Fares

- **Manila ↔ Baguio** - ₱500 (6 hours)
- **Manila ↔ Cebu** - ₱1,200 (1.5 hours flight simulation)
- **Manila ↔ Davao** - ₱2,500 (2 hours flight simulation)
- **Quezon City ↔ Tagaytay** - ₱150 (2 hours)

## 🎨 Features Demo

### Booking Flow
1. Search routes → Select schedule → Choose seats → Payment → QR ticket

### Payment Methods
- **Digital Wallets**: GCash, PayMaya, GrabPay
- **Banking**: BPI, BDO, Metrobank online banking
- **Cards**: Visa, Mastercard, JCB
- **Over-the-Counter**: 7-Eleven CLiQQ

### Bus Tracking
- Live GPS locations
- Interactive maps
- Status indicators (En Route, Boarding, Maintenance)
- Passenger count monitoring

## 🛡️ Security Features

- **Password Hashing**: bcrypt encryption
- **JWT Tokens**: Secure authentication
- **Payment Security**: PCI-compliant processing
- **Data Protection**: SQL injection prevention
- **CORS**: Cross-origin security

## 📊 Database Schema

- **Users**: Account management
- **Routes**: Origin/destination pairs with fares
- **Buses**: Vehicle information and capacity
- **Schedules**: Timetables and availability
- **Bookings**: Reservations with payment status

## 🌟 Demo Highlights

This demo showcases:
- **Philippine Market Focus**: PHP currency, local payment methods
- **Mobile-First Design**: Responsive across all devices
- **Real-Time Features**: Live tracking and updates
- **Complete User Journey**: From search to boarding
- **Production-Ready**: Security, error handling, validation

## 📞 Support

For demo purposes:
- **Contact**: demo@abcbus.ph
- **Phone**: 0917-ABC-BUSS
- **Support Hours**: 24/7 demonstration

## 🚀 Deployment Ready

The application is configured for easy deployment to:
- **Vercel** (frontend)
- **Heroku** (backend)
- **Railway** (full-stack)
- **DigitalOcean** (VPS)

## 📝 License

This is a demonstration project created for showcasing modern web development practices in the Philippine transportation sector.

---

**ABC Bus** - Your reliable travel partner in the Philippines 🇵🇭

*Safe travels, comfortable journeys*