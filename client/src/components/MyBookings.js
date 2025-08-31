import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Icon } from './Icons';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Load bookings from localStorage (demo mode)
    const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
    setBookings(storedBookings);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#34c759';
      case 'pending':
        return '#ff9f0a';
      case 'cancelled':
        return '#ff3b30';
      default:
        return '#86868b';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#34c759';
      case 'pending':
        return '#ff9f0a';
      case 'failed':
        return '#ff3b30';
      default:
        return '#86868b';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.status === 'confirmed';
    if (filter === 'past') return false; // In demo, all are upcoming
    if (filter === 'pending') return booking.paymentStatus === 'pending';
    return true;
  });

  const handleShowQR = (booking) => {
    setSelectedBooking(booking);
    setShowQR(true);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Icon name="ticket" size={24} color="#1d1d1f" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>My Bookings</h1>
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '32px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: '16px'
        }}>
          {['all', 'upcoming', 'past', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 16px',
                background: filter === tab ? '#0071e3' : 'transparent',
                color: filter === tab ? 'white' : '#86868b',
                border: 'none',
                borderRadius: '980px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '400',
                transition: 'all 0.3s',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'all' ? `All Bookings (${bookings.length})` :
               tab === 'upcoming' ? `Upcoming (${bookings.filter(b => b.status === 'confirmed').length})` :
               tab === 'past' ? 'Past Trips (0)' :
               `Pending Payment (${bookings.filter(b => b.paymentStatus === 'pending').length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 32px',
            background: '#f5f5f7',
            borderRadius: '12px'
          }}>
            <Icon name="ticket" size={48} color="#86868b" />
            <h3 style={{ marginTop: '16px', color: '#1d1d1f' }}>No bookings found</h3>
            <p style={{ color: '#86868b' }}>
              {filter === 'all' ? 'You haven\'t made any bookings yet.' :
               filter === 'upcoming' ? 'No upcoming trips.' :
               filter === 'past' ? 'No past trips.' :
               'No pending payments.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((booking) => (
              <div 
                key={booking.bookingId || booking.id} 
                className="card"
                style={{ 
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.08)',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    {/* Booking Header */}
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                        {booking.bookingReference}
                      </h3>
                      <h4 style={{ fontSize: '1.125rem', color: '#0071e3', marginBottom: '16px' }}>
                        {booking.route}
                      </h4>
                    </div>

                    {/* Booking Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>Date:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{booking.date}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>Time:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{booking.time}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>Bus:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{booking.busNumber}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>Seats:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {booking.seatNumbers ? booking.seatNumbers.join(', ') : 
                           booking.seat_numbers ? booking.seat_numbers.join(', ') : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>
                          Payment Method:
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase' }}>
                          {booking.paymentMethod || 'GCASH'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#86868b', display: 'block', marginBottom: '4px' }}>
                          Reference:
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {booking.paymentReference || 'PAY' + Math.floor(Math.random() * 1000000000)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Price and Actions */}
                  <div style={{ textAlign: 'right', marginLeft: '32px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '16px' }}>
                      ₱{(booking.totalAmount || booking.total_amount || 0).toLocaleString()}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <span 
                        className="badge"
                        style={{ 
                          background: `${getStatusColor(booking.status)}20`,
                          color: getStatusColor(booking.status),
                          padding: '6px 12px',
                          borderRadius: '980px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {booking.status?.toUpperCase() || 'CONFIRMED'}
                      </span>
                      <span 
                        className="badge"
                        style={{ 
                          background: `${getPaymentStatusColor(booking.paymentStatus || 'completed')}20`,
                          color: getPaymentStatusColor(booking.paymentStatus || 'completed'),
                          padding: '6px 12px',
                          borderRadius: '980px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {(booking.paymentStatus || 'COMPLETED').toUpperCase()}
                      </span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleShowQR(booking)}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        Show QR Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ 
            width: '500px', 
            maxWidth: '90%',
            background: 'white',
            padding: '32px',
            borderRadius: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>QR Ticket</h2>
              <button 
                onClick={() => setShowQR(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  color: '#86868b'
                }}
              >
                ×
              </button>
            </div>

            <div id="printable-ticket" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                display: 'inline-block'
              }}>
                <QRCode 
                  value={`ABC-BUS-${selectedBooking.bookingReference}-${selectedBooking.bookingId}`}
                  size={200}
                />
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ marginBottom: '8px', color: '#000' }}>{selectedBooking.bookingReference}</h3>
                <p style={{ color: '#000', marginBottom: '4px', fontSize: '16px', fontWeight: '500' }}>{selectedBooking.route}</p>
                <p style={{ color: '#000', marginBottom: '4px', fontSize: '14px' }}>{selectedBooking.date} • {selectedBooking.time}</p>
                <p style={{ color: '#000', fontSize: '14px' }}>
                  Seats: {selectedBooking.seatNumbers ? selectedBooking.seatNumbers.join(', ') : 'N/A'}
                </p>
                <p style={{ color: '#000', fontSize: '14px', marginTop: '8px' }}>
                  Bus: {selectedBooking.busNumber}
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => {
                  const printContent = document.getElementById('printable-ticket').innerHTML;
                  const printWindow = window.open('', '', 'width=400,height=600');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>ABC Bus Ticket - ${selectedBooking.bookingReference}</title>
                        <style>
                          body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            padding: 20px;
                            text-align: center;
                          }
                          h3 { margin-bottom: 8px; }
                          p { margin: 4px 0; }
                          @media print {
                            body { padding: 10px; }
                          }
                        </style>
                      </head>
                      <body>
                        <h2 style="margin-bottom: 20px;">ABC BUS TICKET</h2>
                        ${printContent}
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #ccc;">
                          <p style="font-size: 12px; color: #666;">Present this ticket at the terminal</p>
                          <p style="font-size: 12px; color: #666;">Thank you for choosing ABC Bus!</p>
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Icon name="print" size={16} /> Print Ticket
              </button>
              
              <button
                onClick={() => {
                  // Download QR as image
                  const svg = document.querySelector('#printable-ticket svg');
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = `ABC-Ticket-${selectedBooking.bookingReference}.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                  };
                  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <Icon name="download" size={16} /> Save QR
              </button>
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: '#f5f5f7', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#86868b',
              textAlign: 'center'
            }}>
              <Icon name="check" size={16} color="#34c759" />
              <p style={{ margin: '8px 0 0 0' }}>Show this QR code at the terminal for boarding</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Tips */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="alert" size={20} />
          Booking Tips
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Before Your Trip:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Save your QR code ticket on your phone
              </li>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Arrive at the terminal 30 minutes early
              </li>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Bring a valid ID for verification
              </li>
              <li style={{ fontSize: '14px', color: '#86868b' }}>
                • Check weather and traffic conditions
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Need Help?</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Contact support: 0917-ABC-BUSS
              </li>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Email: support@abcbus.ph
              </li>
              <li style={{ marginBottom: '8px', fontSize: '14px', color: '#86868b' }}>
                • Refund policy: Full refund 2+ hours before departure
              </li>
              <li style={{ fontSize: '14px', color: '#86868b' }}>
                • Reschedule: Up to 24 hours before departure
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;