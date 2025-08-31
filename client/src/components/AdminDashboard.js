import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ user }) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { type: 'ai', text: 'Hello! I\'m your AI Business Assistant. I can help you with sales reports, bus tracking, fuel consumption analysis, and driver performance monitoring. How can I assist you today?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [stats] = useState({
    totalRevenue: 1256780,
    activeBookings: 234,
    totalBuses: 45,
    operationalBuses: 38,
    totalRoutes: 24,
    totalCustomers: 5678,
    todayBookings: 87,
    monthlyGrowth: 12.5
  });

  const [recentBookings] = useState([
    {
      id: 'BK-2024-1001',
      customer: 'Juan Dela Cruz',
      route: 'Manila → Baguio',
      date: '2024-12-25',
      amount: 850,
      status: 'confirmed',
      seatNumber: 'A12'
    },
    {
      id: 'BK-2024-1002',
      customer: 'Maria Santos',
      route: 'Cebu → Dumaguete',
      date: '2024-12-25',
      amount: 650,
      status: 'pending',
      seatNumber: 'B4'
    },
    {
      id: 'BK-2024-1003',
      customer: 'Pedro Garcia',
      route: 'Davao → CDO',
      date: '2024-12-26',
      amount: 980,
      status: 'confirmed',
      seatNumber: 'C8'
    }
  ]);

  const [busStatus] = useState([
    { busNumber: 'ABC-001', route: 'Manila → Baguio', status: 'en_route', driver: 'Roberto Cruz', eta: '45 min' },
    { busNumber: 'ABC-002', route: 'Manila → Vigan', status: 'boarding', driver: 'Jose Reyes', eta: 'Departing' },
    { busNumber: 'CEB-001', route: 'Cebu → Dumaguete', status: 'en_route', driver: 'Miguel Santos', eta: '2 hrs' },
    { busNumber: 'DVO-001', route: 'Davao → CDO', status: 'maintenance', driver: 'N/A', eta: 'N/A' }
  ]);

  // AI Assistant Handler
  const handleAIMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMsg = currentMessage.toLowerCase();
    setAiMessages(prev => [...prev, { type: 'user', text: currentMessage }]);
    
    // Simulate AI responses with business data
    let aiResponse = '';
    
    if (userMsg.includes('sales') || userMsg.includes('revenue')) {
      aiResponse = `📊 Current Sales Report:\n\n• Today's Revenue: ₱${(Math.random() * 50000 + 30000).toFixed(0)}\n• This Week: ₱${stats.totalRevenue.toLocaleString()}\n• Month-to-Date: ₱3,847,290\n• YoY Growth: +${stats.monthlyGrowth}%\n\nTop Routes by Revenue:\n1. Manila → Baguio: ₱425,000\n2. Cebu → Dumaguete: ₱380,000\n3. Davao → CDO: ₱295,000`;
    } else if (userMsg.includes('bus') || userMsg.includes('location') || userMsg.includes('where')) {
      aiResponse = `🚌 Bus Fleet Status:\n\n• ABC-001: En route to Baguio (ETA: 45 min)\n  Location: Tarlac City\n  Speed: 78 km/h\n\n• ABC-002: Boarding at Manila Terminal\n  Passengers: 32/45\n\n• CEB-001: En route to Dumaguete\n  Location: Carcar City\n  Speed: 65 km/h\n\n• DVO-001: Under maintenance\n  Expected return: Tomorrow 6 AM`;
    } else if (userMsg.includes('fuel') || userMsg.includes('consumption')) {
      aiResponse = `⛽ Fuel Consumption Analysis:\n\n• Fleet Average: 4.2 km/L\n• Total Fuel Cost Today: ₱48,750\n• Most Efficient: ABC-005 (5.1 km/L)\n• Needs Attention: ABC-012 (3.2 km/L)\n\nRecommendation: Schedule maintenance for ABC-012 and ABC-008 showing 15% higher consumption than average.`;
    } else if (userMsg.includes('driver') || userMsg.includes('speed') || userMsg.includes('performance')) {
      aiResponse = `👨‍✈️ Driver Performance Report:\n\n• Roberto Cruz (ABC-001)\n  Avg Speed: 78 km/h\n  Safety Score: 94/100\n  On-time: 98%\n\n• Jose Reyes (ABC-002)\n  Avg Speed: 72 km/h\n  Safety Score: 97/100\n  On-time: 95%\n\n⚠️ Alert: Driver Miguel Santos exceeded speed limit (105 km/h) on SLEX at 14:23`;
    } else if (userMsg.includes('help') || userMsg.includes('what can')) {
      aiResponse = `I can help you with:\n\n📊 Sales & Revenue Reports\n🚌 Real-time Bus Tracking\n⛽ Fuel Consumption Analysis\n👨‍✈️ Driver Performance Monitoring\n📈 Business Trends & Predictions\n⚠️ Alert Management\n\nTry asking:\n• "Show me today's sales"\n• "Where are all buses?"\n• "Fuel consumption report"\n• "Driver performance"`;
    } else {
      aiResponse = `I understand you're asking about "${currentMessage}". Here's what I found:\n\n• Current operational efficiency: 87%\n• ${stats.activeBookings} active bookings\n• ${stats.operationalBuses}/${stats.totalBuses} buses operational\n• Customer satisfaction: 4.6/5.0\n\nIs there something specific you'd like to know about sales, buses, fuel, or drivers?`;
    }
    
    setTimeout(() => {
      setAiMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
    }, 1000);
    
    setCurrentMessage('');
  };

  return (
    <div>
      {/* Admin Hero Section with AI Assistant Button */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '32px',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Dashboard</h1>
            <p style={{ opacity: 0.9 }}>Welcome back, {user.username}! Here's your operational overview.</p>
          </div>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '20px' }}>🤖</span>
            AI Business Assistant
          </button>
        </div>
      </div>

      {/* AI Assistant Chat Window */}
      {showAIAssistant && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          height: '600px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* AI Header */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>🤖 AI Business Assistant</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>Powered by ABC Analytics</p>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>

          {/* Legend/Help */}
          <div style={{
            background: '#f8f9fa',
            padding: '12px 20px',
            borderBottom: '1px solid #e9ecef',
            fontSize: '13px',
            color: '#6c757d'
          }}>
            <strong>Quick Commands:</strong> "sales report" | "where are buses" | "fuel consumption" | "driver speed"
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {aiMessages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.type === 'user' ? '#3b82f6' : '#f3f4f6',
                  color: msg.type === 'user' ? 'white' : '#1f2937',
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
              placeholder="Ask about sales, buses, fuel, or drivers..."
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleAIMessage}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            💰
          </div>
          <div className="stat-value">₱{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue (Month)</div>
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#16a34a' }}>
            ↑ {stats.monthlyGrowth}% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            📊
          </div>
          <div className="stat-value">{stats.activeBookings}</div>
          <div className="stat-label">Active Bookings</div>
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#64748b' }}>
            {stats.todayBookings} new today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            🚌
          </div>
          <div className="stat-value">{stats.operationalBuses}/{stats.totalBuses}</div>
          <div className="stat-label">Operational Buses</div>
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#64748b' }}>
            {stats.totalBuses - stats.operationalBuses} in maintenance
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}>
            👥
          </div>
          <div className="stat-value">{stats.totalCustomers.toLocaleString()}</div>
          <div className="stat-label">Total Customers</div>
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#16a34a' }}>
            ↑ 234 new this week
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Bookings</h2>
            <Link to="/admin/bookings" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              View All
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Booking ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Route</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>{booking.id}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem' }}>{booking.customer}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem' }}>{booking.route}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>₱{booking.amount}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Buses */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Buses</h2>
            <Link to="/admin/buses" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              Manage Fleet
            </Link>
          </div>
          {busStatus.map(bus => (
            <div key={bus.busNumber} style={{
              padding: '12px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{bus.busNumber}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{bus.route}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Driver: {bus.driver}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${
                  bus.status === 'en_route' ? 'success' : 
                  bus.status === 'boarding' ? 'info' : 
                  'danger'
                }`}>
                  {bus.status.replace('_', ' ')}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{bus.eta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Quick Actions</h2>
        <div className="grid grid-4">
          <Link to="/admin/buses" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🚌</span>
            Add New Bus
          </Link>
          <Link to="/admin/bookings" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📋</span>
            View Bookings
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📊</span>
            Generate Report
          </Link>
          <Link to="/tracker" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📍</span>
            Track Buses
          </Link>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Revenue Overview</h2>
          <select style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem'
          }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div style={{ 
          height: '300px', 
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
            <p>Revenue Chart Placeholder</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Integration with charting library needed</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-3" style={{ marginTop: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#1e293b' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Booking System</span>
              <span className="badge badge-success">Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Payment Gateway</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>GPS Tracking</span>
              <span className="badge badge-success">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Database</span>
              <span className="badge badge-success">Healthy</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#1e293b' }}>Top Routes Today</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.875rem' }}>Manila → Baguio</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>45 bookings</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.875rem' }}>Cebu → Dumaguete</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>32 bookings</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.875rem' }}>Manila → Vigan</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>28 bookings</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '56%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', color: '#1e293b' }}>Alerts & Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.875rem' }}>
              🔴 Bus ABC-015 needs maintenance
            </div>
            <div style={{ padding: '8px', background: '#fefce8', borderRadius: '6px', fontSize: '0.875rem' }}>
              ⚠️ Low seat availability Manila-Baguio
            </div>
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.875rem' }}>
              ✅ Payment received: ₱45,000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;