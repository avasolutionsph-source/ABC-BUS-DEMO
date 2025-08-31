import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Icon } from './Icons';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    todaySchedules: 0,
    loyaltyPoints: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPopularRoutes();
    fetchTodaySchedules();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulated data for demo
      setStats({
        totalBookings: 28,
        upcomingTrips: 3,
        todaySchedules: 12,
        loyaltyPoints: 2340
      });

      // Simulated recent bookings
      setRecentBookings([
        {
          id: 1,
          booking_reference: 'ABC-2024-001',
          origin: 'Manila',
          destination: 'Baguio',
          departure_date: '2024-12-25',
          departure_time: '06:00 AM',
          total_amount: 850,
          payment_status: 'completed',
          status: 'confirmed'
        },
        {
          id: 2,
          booking_reference: 'ABC-2024-002',
          origin: 'Quezon City',
          destination: 'Tagaytay',
          departure_date: '2024-12-28',
          departure_time: '08:00 AM',
          total_amount: 450,
          payment_status: 'completed',
          status: 'confirmed'
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchTodaySchedules = async () => {
    // Today's bus schedules
    setTodaySchedules([
      {
        id: 1,
        busNumber: 'ABC-001',
        route: 'Manila → Baguio',
        departure: '06:00 AM',
        arrival: '12:00 PM',
        status: 'On Time',
        availableSeats: 5,
        driver: 'Roberto Cruz'
      },
      {
        id: 2,
        busNumber: 'ABC-002',
        route: 'Manila → Vigan',
        departure: '07:30 AM',
        arrival: '03:30 PM',
        status: 'Boarding',
        availableSeats: 12,
        driver: 'Jose Reyes'
      },
      {
        id: 3,
        busNumber: 'CEB-001',
        route: 'Cebu → Dumaguete',
        departure: '08:00 AM',
        arrival: '12:00 PM',
        status: 'On Time',
        availableSeats: 0,
        driver: 'Miguel Santos'
      },
      {
        id: 4,
        busNumber: 'ABC-003',
        route: 'Quezon City → Tagaytay',
        departure: '09:00 AM',
        arrival: '11:30 AM',
        status: 'On Time',
        availableSeats: 18,
        driver: 'Pedro Garcia'
      },
      {
        id: 5,
        busNumber: 'DVO-001',
        route: 'Davao → CDO',
        departure: '10:00 AM',
        arrival: '03:00 PM',
        status: 'Delayed',
        availableSeats: 3,
        driver: 'Juan Santos'
      },
      {
        id: 6,
        busNumber: 'ABC-004',
        route: 'Manila → Bicol',
        departure: '11:00 AM',
        arrival: '07:00 PM',
        status: 'On Time',
        availableSeats: 22,
        driver: 'Carlos Mendoza'
      },
      {
        id: 7,
        busNumber: 'ABC-005',
        route: 'Manila → Batangas',
        departure: '12:00 PM',
        arrival: '02:30 PM',
        status: 'On Time',
        availableSeats: 8,
        driver: 'Ramon Aquino'
      },
      {
        id: 8,
        busNumber: 'CEB-002',
        route: 'Cebu → Bohol',
        departure: '01:00 PM',
        arrival: '03:30 PM',
        status: 'On Time',
        availableSeats: 15,
        driver: 'Antonio Dela Cruz'
      },
      {
        id: 9,
        busNumber: 'ABC-006',
        route: 'Manila → Subic',
        departure: '02:00 PM',
        arrival: '04:30 PM',
        status: 'On Time',
        availableSeats: 30,
        driver: 'Fernando Reyes'
      },
      {
        id: 10,
        busNumber: 'ABC-007',
        route: 'Manila → Pampanga',
        departure: '03:00 PM',
        arrival: '05:00 PM',
        status: 'On Time',
        availableSeats: 10,
        driver: 'Eduardo Santos'
      },
      {
        id: 11,
        busNumber: 'ABC-008',
        route: 'Manila → Laguna',
        departure: '04:00 PM',
        arrival: '06:00 PM',
        status: 'On Time',
        availableSeats: 25,
        driver: 'Ricardo Garcia'
      },
      {
        id: 12,
        busNumber: 'ABC-009',
        route: 'Manila → Zambales',
        departure: '05:00 PM',
        arrival: '08:30 PM',
        status: 'On Time',
        availableSeats: 7,
        driver: 'Manuel Cruz'
      }
    ]);
  };

  const fetchPopularRoutes = async () => {
    setPopularRoutes([
      { 
        id: 1, 
        origin: 'Manila', 
        destination: 'Baguio', 
        distance: 246, 
        duration: 360, 
        fare: 850,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop',
        discount: '20% OFF'
      },
      { 
        id: 2, 
        origin: 'Manila', 
        destination: 'Vigan', 
        distance: 400, 
        duration: 480, 
        fare: 1200,
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&h=300&fit=crop',
        discount: 'BEST SELLER'
      },
      { 
        id: 3, 
        origin: 'Cebu', 
        destination: 'Dumaguete', 
        distance: 165, 
        duration: 240, 
        fare: 650,
        image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=500&h=300&fit=crop',
        discount: 'NEW ROUTE'
      },
      { 
        id: 4, 
        origin: 'Davao', 
        destination: 'CDO', 
        distance: 260, 
        duration: 300, 
        fare: 980,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop',
        discount: '15% OFF'
      }
    ]);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome back, {user.username}!</h1>
          <p className="hero-subtitle">
            ABC Bus Lines - Serving the Philippines since 1985. With over 200 buses and 50+ routes nationwide, 
            we're your trusted partner for safe, comfortable, and affordable travel.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/book" className="btn btn-primary btn-large" style={{ background: 'white', color: '#1e40af' }}>
              Book Your Trip Now
            </Link>
            <Link to="/tracker" className="btn btn-secondary btn-large" style={{ background: 'transparent', color: 'white', border: '2px solid white' }}>
              Track Live Buses
            </Link>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          right: '48px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '300px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          opacity: 0.2
        }}></div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="chart" color="#0071e3" />
          </div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="calendar" color="#34c759" />
          </div>
          <div className="stat-value">{stats.upcomingTrips}</div>
          <div className="stat-label">Upcoming Trips</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="bus" color="#ff9f0a" />
          </div>
          <div className="stat-value">{stats.todaySchedules}</div>
          <div className="stat-label">Today's Schedules</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="star" color="#af52de" />
          </div>
          <div className="stat-value">{stats.loyaltyPoints.toLocaleString()}</div>
          <div className="stat-label">Loyalty Points</div>
        </div>
      </div>

      {/* Today's Bus Schedules */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2 className="card-title">Today's Bus Schedules - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
          <Link to="/book" className="btn btn-secondary">Book a Trip</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Bus #</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Route</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Departure</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Arrival</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Available Seats</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {todaySchedules.slice(0, 8).map(schedule => (
                <tr key={schedule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>{schedule.busNumber}</td>
                  <td style={{ padding: '12px', fontSize: '0.875rem' }}>{schedule.route}</td>
                  <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>{schedule.departure}</td>
                  <td style={{ padding: '12px', fontSize: '0.875rem' }}>{schedule.arrival}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      color: schedule.availableSeats === 0 ? '#dc2626' : schedule.availableSeats < 10 ? '#f59e0b' : '#16a34a'
                    }}>
                      {schedule.availableSeats === 0 ? 'Full' : `${schedule.availableSeats} seats`}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge badge-${
                      schedule.status === 'On Time' ? 'success' : 
                      schedule.status === 'Boarding' ? 'info' : 
                      schedule.status === 'Delayed' ? 'warning' : 'secondary'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {schedule.availableSeats > 0 ? (
                      <Link to="/book" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                        Book Now
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fully Booked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/book" style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500' }}>
            View All {todaySchedules.length} Schedules →
          </Link>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Popular Routes</h2>
          <Link to="/book" className="btn btn-secondary">View All Routes</Link>
        </div>
        <div className="grid grid-4">
          {popularRoutes.map(route => (
            <div key={route.id} className="route-card">
              <div className="route-image" style={{
                backgroundImage: `url(${route.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="route-badge">{route.discount}</span>
              </div>
              <div className="route-content">
                <h3 className="route-title">{route.origin} → {route.destination}</h3>
                <div className="route-details">
                  <div className="route-info">
                    <span>{route.distance}km</span>
                    <span>{Math.floor(route.duration/60)}h</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span className="route-price">₱{route.fare}</span>
                  <Link to="/book" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="grid" style={{ gap: '12px' }}>
            <Link to="/book" className="btn btn-primary">
              Book New Trip
            </Link>
            <Link to="/my-bookings" className="btn btn-secondary">
              View My Bookings
            </Link>
            <Link to="/tracker" className="btn btn-secondary">
              Track Buses
            </Link>
            <Link to="/3d-ticket" className="btn btn-secondary">
              3D Terminal View
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Bookings</h2>
            <Link to="/my-bookings" style={{ color: '#3b82f6', fontSize: '0.875rem' }}>View All</Link>
          </div>
          {recentBookings.map(booking => (
            <div key={booking.id} className="bus-list-item">
              <div className="bus-info-section">
                <div className="bus-icon">
                  <Icon name="ticket" color="#0071e3" />
                </div>
                <div className="bus-details">
                  <h3>{booking.origin} → {booking.destination}</h3>
                  <div className="bus-meta">
                    <span>{booking.departure_date}</span>
                    <span>{booking.departure_time}</span>
                    <span className="badge badge-success">Confirmed</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="route-price">₱{booking.total_amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="card" style={{ background: 'white', padding: '48px 32px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '48px', 
          fontSize: '2rem', 
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Why Choose ABC Bus Lines?
        </h2>
        <div className="grid grid-4" style={{ gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}>
              <Icon name="shield" size={40} color="white" />
            </div>
            <h3 style={{ 
              marginBottom: '12px', 
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b' 
            }}>
              39 Years of Excellence
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Trusted since 1985 with 5M+ satisfied passengers yearly
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}>
              <Icon name="bus" size={40} color="white" />
            </div>
            <h3 style={{ 
              marginBottom: '12px', 
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b' 
            }}>
              200+ Modern Fleet
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Latest Euro 4 buses with WiFi, USB charging & entertainment
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px', 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
            }}>
              <Icon name="location" size={40} color="white" />
            </div>
            <h3 style={{ 
              marginBottom: '12px', 
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b' 
            }}>
              50+ Routes Nationwide
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              From Luzon to Mindanao, connecting all major cities
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px', 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
            }}>
              <Icon name="star" size={40} color="white" />
            </div>
            <h3 style={{ 
              marginBottom: '12px', 
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e293b' 
            }}>
              Award-Winning Service
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              DOTr Excellence Award 2023, ISO 9001:2015 Certified
            </p>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        padding: '48px 32px',
        color: 'white'
      }}>
        <h2 style={{ 
          textAlign: 'center',
          marginBottom: '48px', 
          color: 'white',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          ABC Bus Lines by the Numbers
        </h2>
        <div className="grid grid-4" style={{ gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              39
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Years of Service
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              5M+
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Annual Passengers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              200+
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Modern Buses
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              1,500+
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Professional Drivers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;