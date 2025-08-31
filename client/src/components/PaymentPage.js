import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Icon } from './Icons';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    // Load booking from localStorage (demo mode)
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      const bookingData = JSON.parse(pendingBooking);
      setBooking(bookingData);
      setLoading(false);
    } else {
      toast.error('No booking found');
      navigate('/book');
      setLoading(false);
    }
  }, [bookingId, navigate]);

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    
    // Demo mode - simulate payment processing
    setTimeout(() => {
      // Create completed booking with payment details
      const completedBooking = {
        ...booking,
        bookingReference: 'ABC' + Math.floor(Math.random() * 10000000),
        paymentMethod: selectedPaymentMethod,
        paymentReference: 'PAY' + Date.now(),
        paymentStatus: 'completed',
        status: 'confirmed',
        qrCode: 'QR-' + bookingId
      };
      
      // Get existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      
      // Add new booking
      existingBookings.unshift(completedBooking);
      
      // Save to localStorage
      localStorage.setItem('myBookings', JSON.stringify(existingBookings));
      
      // Clear pending booking
      localStorage.removeItem('pendingBooking');
      
      toast.success('Payment successful! Your QR ticket has been generated.');
      navigate('/my-bookings');
      setProcessing(false);
    }, 2000); // 2 second delay for demo
  };

  const paymentMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      description: 'Pay using your GCash wallet',
      icon: 'peso',
      available: true
    },
    {
      id: 'paymaya',
      name: 'Maya',
      description: 'Pay using your Maya account',
      icon: 'peso',
      available: true
    },
    {
      id: 'bank_transfer',
      name: 'Online Banking',
      description: 'BPI, BDO, Metrobank, and more',
      icon: 'chart',
      available: true
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, JCB',
      icon: 'shield',
      available: true
    }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px' }}>Loading payment details...</p>
      </div>
    );
  }

  if (!booking) {
    return <div className="card">Booking not found</div>;
  }

  return (
    <div>
      {/* Demo Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #ff9f0a 0%, #ff3b30 100%)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        DEMO MODE - This is a payment simulation. No real payment will be processed.
      </div>

      <div className="card">
        <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Complete Your Payment</h1>
        
        {/* Booking Summary */}
        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ background: '#f5f5f7' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Booking Summary</h2>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Route:</strong> {booking.route}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Bus:</strong> {booking.busNumber}</p>
              <p><strong>Seats:</strong> {booking.seatNumbers.join(', ')}</p>
              <hr style={{ margin: '16px 0', border: '1px solid rgba(0,0,0,0.06)' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1d1d1f' }}>
                Total: ₱{booking.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="shield" color="#34c759" />
              Secure Payment
            </h2>
            
            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', color: '#1d1d1f' }}>What happens after payment:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="check" color="#34c759" size={16} />
                <span>Instant booking confirmation</span>
              </li>
              <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="ticket" color="#34c759" size={16} />
                <span>QR code ticket generation</span>
              </li>
              <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="mail" color="#34c759" size={16} />
                <span>Email confirmation sent</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="check" color="#34c759" size={16} />
                <span>Ready for boarding</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Choose Payment Method</h2>
          <p style={{ color: '#86868b', marginBottom: '24px' }}>Select your preferred payment method. All methods are secure and processed instantly.</p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px',
            marginBottom: '32px'
          }}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                style={{
                  padding: '20px',
                  background: selectedPaymentMethod === method.id ? '#0071e3' : 'white',
                  border: `2px solid ${selectedPaymentMethod === method.id ? '#0071e3' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '12px',
                  cursor: method.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  opacity: method.available ? 1 : 0.5,
                  textAlign: 'center'
                }}
              >
                <div style={{ marginBottom: '12px', color: selectedPaymentMethod === method.id ? 'white' : '#0071e3' }}>
                  <Icon name={method.icon} size={32} />
                </div>
                <h4 style={{ 
                  marginBottom: '4px', 
                  fontSize: '1rem',
                  color: selectedPaymentMethod === method.id ? 'white' : '#1d1d1f'
                }}>
                  {method.name}
                </h4>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: selectedPaymentMethod === method.id ? 'rgba(255,255,255,0.9)' : '#86868b' 
                }}>
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Instructions */}
        {selectedPaymentMethod && (
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
            border: '1px solid #0071e3',
            marginBottom: '32px'
          }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.125rem' }}>Payment Instructions</h3>
            <div style={{ lineHeight: '1.8' }}>
              {selectedPaymentMethod === 'gcash' && (
                <>
                  <p>1. You will be redirected to GCash</p>
                  <p>2. Login to your GCash account</p>
                  <p>3. Confirm the payment of ₱{booking.totalAmount.toLocaleString()}</p>
                  <p>4. Return to ABC Bus for confirmation</p>
                </>
              )}
              {selectedPaymentMethod === 'paymaya' && (
                <>
                  <p>1. You will be redirected to Maya</p>
                  <p>2. Login to your Maya account</p>
                  <p>3. Confirm the payment of ₱{booking.totalAmount.toLocaleString()}</p>
                  <p>4. Return to ABC Bus for confirmation</p>
                </>
              )}
              {selectedPaymentMethod === 'credit_card' && (
                <>
                  <p>1. Enter your card details securely</p>
                  <p>2. Verify with 3D Secure if required</p>
                  <p>3. Confirm the payment of ₱{booking.totalAmount.toLocaleString()}</p>
                  <p>4. Receive instant confirmation</p>
                </>
              )}
              {selectedPaymentMethod === 'bank_transfer' && (
                <>
                  <p>1. Select your preferred bank</p>
                  <p>2. Login to your online banking</p>
                  <p>3. Complete the payment of ₱{booking.totalAmount.toLocaleString()}</p>
                  <p>4. Receive your QR ticket instantly</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/book')}
            className="btn btn-secondary"
            disabled={processing}
            style={{ flex: '1' }}
          >
            Back to Booking
          </button>
          
          <button 
            onClick={processPayment}
            className="btn btn-primary"
            disabled={!selectedPaymentMethod || processing}
            style={{ flex: '2' }}
          >
            {processing ? 'Processing Payment...' : `Pay ₱${booking.totalAmount.toLocaleString()} Now`}
          </button>
        </div>

        {/* Security Notice */}
        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: '#f5f5f7', 
          borderRadius: '12px', 
          fontSize: '0.875rem', 
          color: '#86868b' 
        }}>
          <p style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="shield" size={16} />
            <strong>Secure Transaction:</strong> Your payment information is protected by 256-bit SSL encryption.
          </p>
          <p style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="check" size={16} />
            <strong>Money Back Guarantee:</strong> Full refund available up to 2 hours before departure.
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="ticket" size={16} />
            <strong>Instant Confirmation:</strong> Your QR ticket will be generated immediately after payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;