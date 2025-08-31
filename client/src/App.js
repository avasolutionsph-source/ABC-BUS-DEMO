import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminBusManagement from './components/AdminBusManagement';
import AdminBookings from './components/AdminBookings';
import AdminReports from './components/AdminReports';
import BookingPage from './components/BookingPage';
import PaymentPage from './components/PaymentPage';
import MyBookings from './components/MyBookings';
import BusTracker from './components/BusTracker';
import Ticket3D from './components/Ticket3D';
import BusScanner3D from './components/BusScanner3D';
import AIAssistant from './components/AIAssistant';

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Demo user for the application
  const demoUser = {
    id: 1,
    username: isAdminView ? 'Admin User' : 'Demo User',
    email: isAdminView ? 'admin@abcbus.com' : 'demo@abcbus.com',
    role: isAdminView ? 'admin' : 'customer'
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo-section">
                <div className="logo">AB</div>
                <div className="logo-text">ABC Bus</div>
              </div>
              <nav className="nav">
                {isAdminView ? (
                  <>
                    <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/admin/buses" className="nav-link">Bus Management</Link>
                    <Link to="/admin/bookings" className="nav-link">All Bookings</Link>
                    <Link to="/admin/reports" className="nav-link">Reports</Link>
                    <Link to="/tracker" className="nav-link">Live Tracking</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/book" className="nav-link">Book a Trip</Link>
                    <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                    <Link to="/tracker" className="nav-link">Live Tracking</Link>
                    <Link to="/3d-ticket" className="nav-link">3D Terminal</Link>
                    <Link to="/bus-scanner" className="nav-link">3D Bus</Link>
                  </>
                )}
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginLeft: '24px',
                  paddingLeft: '24px',
                  borderLeft: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  {isAdminView && (
                    <Link to="/admin/ai-assistant" className="nav-link" style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '500'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                        <path d="M8 8l8 8m0-8l-8 8" opacity="0.3"/>
                      </svg>
                      AI Assistant
                    </Link>
                  )}
                  
                  <div className="view-toggle">
                    <button
                      onClick={() => setIsAdminView(false)}
                      className={!isAdminView ? 'active' : ''}
                    >
                      Client
                    </button>
                    <button
                      onClick={() => setIsAdminView(true)}
                      className={isAdminView ? 'active' : ''}
                    >
                      Admin
                    </button>
                  </div>
                  
                  <div className="user-badge">
                    <div className="user-avatar">
                      {isAdminView ? 'AU' : 'DU'}
                    </div>
                    <span>{demoUser.username}</span>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={<AdminDashboard user={demoUser} />} 
              />
              <Route 
                path="/admin/buses" 
                element={<AdminBusManagement />} 
              />
              <Route 
                path="/admin/bookings" 
                element={<AdminBookings />} 
              />
              <Route 
                path="/admin/reports" 
                element={<AdminReports />} 
              />
              <Route 
                path="/admin/ai-assistant" 
                element={<AIAssistant />} 
              />
              
              {/* Client Routes */}
              <Route 
                path="/dashboard" 
                element={<Dashboard user={demoUser} />} 
              />
              <Route 
                path="/book" 
                element={<BookingPage />} 
              />
              <Route 
                path="/payment/:bookingId" 
                element={<PaymentPage />} 
              />
              <Route 
                path="/my-bookings" 
                element={<MyBookings />} 
              />
              <Route 
                path="/tracker" 
                element={<BusTracker isAdmin={isAdminView} />} 
              />
              <Route 
                path="/3d-ticket" 
                element={<Ticket3D />} 
              />
              <Route 
                path="/bus-scanner" 
                element={<BusScanner3D />} 
              />
              <Route 
                path="/" 
                element={isAdminView ? <AdminDashboard user={demoUser} /> : <Dashboard user={demoUser} />} 
              />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>About ABC Bus</h3>
                <p style={{ marginBottom: '12px' }}>
                  Leading bus transportation service in the Philippines since 1985.
                </p>
                <p>Serving millions of passengers with safety and comfort.</p>
              </div>
              <div className="footer-section">
                <h3>Quick Links</h3>
                <div className="footer-links">
                  <Link to="/book">Book a Trip</Link>
                  <Link to="/my-bookings">My Bookings</Link>
                  <Link to="/tracker">Live Tracking</Link>
                  <a href="#terms">Terms & Conditions</a>
                </div>
              </div>
              <div className="footer-section">
                <h3>Popular Routes</h3>
                <div className="footer-links">
                  <a href="#manila-baguio">Manila to Baguio</a>
                  <a href="#manila-vigan">Manila to Vigan</a>
                  <a href="#cebu-dumaguete">Cebu to Dumaguete</a>
                  <a href="#davao-cdo">Davao to CDO</a>
                </div>
              </div>
              <div className="footer-section">
                <h3>Contact Us</h3>
                <p>24/7 Customer Support</p>
                <p style={{ color: '#a1a1a6' }}>+63 2 8888 2222</p>
                <p style={{ color: '#a1a1a6' }}>support@abcbus.ph</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <a href="#facebook" style={{ color: '#a1a1a6', fontSize: '12px' }}>Facebook</a>
                  <a href="#twitter" style={{ color: '#a1a1a6', fontSize: '12px' }}>Twitter</a>
                  <a href="#instagram" style={{ color: '#a1a1a6', fontSize: '12px' }}>Instagram</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 ABC Bus Lines, Inc. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>

        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;