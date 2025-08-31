import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2024-1001',
      customer: 'Juan Dela Cruz',
      email: 'juan@email.com',
      phone: '+63 917 123 4567',
      origin: 'Manila',
      destination: 'Baguio',
      route: 'Manila → Baguio',
      busNumber: 'ABC-001',
      seatNumbers: ['A12', 'A13'],
      date: '2024-12-25',
      time: '06:00 AM',
      amount: 1700,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-12-20',
      passengers: 2
    },
    {
      id: 'BK-2024-1002',
      customer: 'Maria Santos',
      email: 'maria@email.com',
      phone: '+63 918 234 5678',
      origin: 'Cebu',
      destination: 'Dumaguete',
      route: 'Cebu → Dumaguete',
      busNumber: 'CEB-001',
      seatNumbers: ['B4'],
      date: '2024-12-25',
      time: '08:00 AM',
      amount: 650,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2024-12-21',
      passengers: 1
    },
    {
      id: 'BK-2024-1003',
      customer: 'Pedro Garcia',
      email: 'pedro@email.com',
      phone: '+63 919 345 6789',
      origin: 'Davao',
      destination: 'CDO',
      route: 'Davao → CDO',
      busNumber: 'DVO-001',
      seatNumbers: ['C8', 'C9', 'C10'],
      date: '2024-12-26',
      time: '10:00 AM',
      amount: 2940,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-12-19',
      passengers: 3
    },
    {
      id: 'BK-2024-1004',
      customer: 'Ana Reyes',
      email: 'ana@email.com',
      phone: '+63 920 456 7890',
      origin: 'Manila',
      destination: 'Vigan',
      route: 'Manila → Vigan',
      busNumber: 'ABC-002',
      seatNumbers: ['D1', 'D2'],
      date: '2024-12-27',
      time: '05:00 AM',
      amount: 2400,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-12-22',
      passengers: 2
    },
    {
      id: 'BK-2024-1005',
      customer: 'Roberto Lopez',
      email: 'roberto@email.com',
      phone: '+63 921 567 8901',
      origin: 'Quezon City',
      destination: 'Tagaytay',
      route: 'Quezon City → Tagaytay',
      busNumber: 'ABC-003',
      seatNumbers: ['E5'],
      date: '2024-12-28',
      time: '07:00 AM',
      amount: 450,
      status: 'cancelled',
      paymentStatus: 'refunded',
      bookingDate: '2024-12-18',
      passengers: 1
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusUpdate = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
  };

  const handlePaymentUpdate = (bookingId, newPaymentStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, paymentStatus: newPaymentStatus } : booking
    ));
    toast.success(`Payment status updated to ${newPaymentStatus}`);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' } 
          : booking
      ));
      toast.success('Booking cancelled and refund initiated');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || booking.date === dateFilter;
    
    return matchesStatus && matchesPayment && matchesSearch && matchesDate;
  });

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPaymentColor = (status) => {
    switch(status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Bookings Management</h1>
          <p style={{ color: '#64748b' }}>View and manage all customer bookings, payments, and cancellations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>📋</div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>✅</div>
            <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
            <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>💰</div>
            <div className="stat-value">₱{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by ID, customer, email, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ flex: '1', minWidth: '300px' }}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-control"
            style={{ width: '200px' }}
          />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control"
            style={{ width: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="form-control"
            style={{ width: '150px' }}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Booking ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Route</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Date & Time</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Seats</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Payment</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: '600' }}>{booking.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{booking.customer}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.875rem' }}>{booking.route}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bus: {booking.busNumber}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.875rem' }}>{booking.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.time}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                    {booking.seatNumbers.join(', ')}
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.passengers} pax</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: '600' }}>
                    ₱{booking.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge badge-${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge badge-${getPaymentColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetails(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="btn btn-success"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            No bookings found matching your filters
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Booking Details</h2>
              <button 
                onClick={() => setShowDetails(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Booking ID</label>
                <div style={{ fontWeight: '600', marginBottom: '16px' }}>{selectedBooking.id}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Booking Date</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.bookingDate}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Customer Name</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.customer}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Email</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Phone</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.phone}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Passengers</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.passengers}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Route</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.route}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Bus Number</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.busNumber}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Travel Date</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.date}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Departure Time</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.time}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Seat Numbers</label>
                <div style={{ fontWeight: '500', marginBottom: '16px' }}>{selectedBooking.seatNumbers.join(', ')}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Total Amount</label>
                <div style={{ fontWeight: '600', fontSize: '1.25rem', color: '#1e40af', marginBottom: '16px' }}>
                  ₱{selectedBooking.amount.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <span className={`badge badge-${getStatusColor(selectedBooking.status)}`} style={{ padding: '8px 16px' }}>
                Status: {selectedBooking.status}
              </span>
              <span className={`badge badge-${getPaymentColor(selectedBooking.paymentStatus)}`} style={{ padding: '8px 16px' }}>
                Payment: {selectedBooking.paymentStatus}
              </span>
            </div>

            {selectedBooking.status !== 'cancelled' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                {selectedBooking.status === 'pending' && (
                  <button 
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'confirmed');
                      setShowDetails(false);
                    }}
                    className="btn btn-success" 
                    style={{ flex: 1 }}
                  >
                    Confirm Booking
                  </button>
                )}
                {selectedBooking.paymentStatus === 'pending' && (
                  <button 
                    onClick={() => {
                      handlePaymentUpdate(selectedBooking.id, 'paid');
                      setShowDetails(false);
                    }}
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                  >
                    Mark as Paid
                  </button>
                )}
                <button 
                  onClick={() => {
                    handleCancelBooking(selectedBooking.id);
                    setShowDetails(false);
                  }}
                  className="btn btn-danger" 
                  style={{ flex: 1 }}
                >
                  Cancel & Refund
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;