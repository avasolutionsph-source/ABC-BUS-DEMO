import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data);
    } catch (error) {
      toast.error('Failed to load routes');
    }
  };

  const searchSchedules = async () => {
    if (!searchForm.origin || !searchForm.destination || !searchForm.date) {
      toast.error('Please fill in all search fields');
      return;
    }

    setLoading(true);
    
    // Demo site - simulate loading and show demo schedules
    setTimeout(() => {
      // Generate demo schedules for any route
      const demoSchedules = [
        { 
          id: 1, 
          bus_number: 'ABC-DEMO-01', 
          origin: searchForm.origin, 
          destination: searchForm.destination, 
          departure_date: searchForm.date, 
          departure_time: '06:00 AM', 
          arrival_time: '12:00 PM', 
          available_seats: 25, 
          capacity: 40, 
          fare: 580 
        },
        { 
          id: 2, 
          bus_number: 'ABC-DEMO-02', 
          origin: searchForm.origin, 
          destination: searchForm.destination,
          departure_date: searchForm.date, 
          departure_time: '09:00 AM', 
          arrival_time: '03:00 PM', 
          available_seats: 15, 
          capacity: 40, 
          fare: 580 
        },
        { 
          id: 3, 
          bus_number: 'ABC-DEMO-03', 
          origin: searchForm.origin, 
          destination: searchForm.destination,
          departure_date: searchForm.date, 
          departure_time: '12:00 PM', 
          arrival_time: '06:00 PM', 
          available_seats: 32, 
          capacity: 40, 
          fare: 580 
        },
        { 
          id: 4, 
          bus_number: 'ABC-DEMO-04', 
          origin: searchForm.origin, 
          destination: searchForm.destination,
          departure_date: searchForm.date, 
          departure_time: '03:00 PM', 
          arrival_time: '09:00 PM', 
          available_seats: 8, 
          capacity: 40, 
          fare: 580 
        },
        { 
          id: 5, 
          bus_number: 'ABC-DEMO-05', 
          origin: searchForm.origin, 
          destination: searchForm.destination,
          departure_date: searchForm.date, 
          departure_time: '06:00 PM', 
          arrival_time: '12:00 AM', 
          available_seats: 38, 
          capacity: 40, 
          fare: 580 
        }
      ];
      
      setSchedules(demoSchedules);
      setStep(2);
      setLoading(false);
      toast.info('This is a demo site - showing sample schedules for demonstration purposes');
    }, 800); // Short delay to simulate loading
  };

  const selectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeats([]);
    setStep(3);
  };

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < 4) { // Max 4 seats per booking
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      toast.warning('Maximum 4 seats per booking');
    }
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setLoading(true);
    
    // Demo mode - simulate booking creation
    setTimeout(() => {
      // Create demo booking data
      const demoBookingId = 'DEMO-' + Date.now();
      const demoBooking = {
        bookingId: demoBookingId,
        scheduleId: selectedSchedule.id,
        seatNumbers: selectedSeats,
        totalAmount: selectedSchedule.fare * selectedSeats.length,
        route: `${selectedSchedule.origin} → ${selectedSchedule.destination}`,
        date: selectedSchedule.departure_date,
        time: selectedSchedule.departure_time,
        busNumber: selectedSchedule.bus_number,
        status: 'pending'
      };
      
      // Store booking data for payment page
      localStorage.setItem('pendingBooking', JSON.stringify(demoBooking));
      
      toast.success('Demo booking created! Redirecting to payment simulation...');
      navigate(`/payment/${demoBookingId}`);
      setLoading(false);
    }, 1000); // 1 second delay for demo
  };

  const generateSeatLayout = () => {
    const seats = [];
    const occupiedSeats = ['A3', 'B2', 'C5', 'D4', 'E1', 'F3', 'G2', 'H4', 'J3']; // Mock occupied seats
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    // Generate bus seat layout with proper rows
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const rowSeats = [];
      
      // Left side seats (1-2)
      for (let col = 1; col <= 2; col++) {
        const seatId = `${row}${col}`;
        const isOccupied = occupiedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        rowSeats.push(
          <div
            key={seatId}
            className={`seat ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
            onClick={() => !isOccupied && toggleSeat(seatId)}
            style={{
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              cursor: isOccupied ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {seatId}
          </div>
        );
      }
      
      // Aisle space
      rowSeats.push(
        <div key={`${row}-aisle`} style={{ width: '30px' }}></div>
      );
      
      // Right side seats (3-4)
      for (let col = 3; col <= 4; col++) {
        const seatId = `${row}${col}`;
        const isOccupied = occupiedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        rowSeats.push(
          <div
            key={seatId}
            className={`seat ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
            onClick={() => !isOccupied && toggleSeat(seatId)}
            style={{
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '500',
              borderRadius: '8px',
              cursor: isOccupied ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {seatId}
          </div>
        );
      }
      
      seats.push(
        <div key={`row-${row}`} style={{ 
          display: 'flex', 
          gap: '8px',
          marginBottom: '8px',
          justifyContent: 'center'
        }}>
          {rowSeats}
        </div>
      );
    }
    
    return seats;
  };

  const uniqueOrigins = [...new Set(routes.map(route => route.origin))];
  const uniqueDestinations = [...new Set(routes.map(route => route.destination))];

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
        🎭 DEMO MODE - This is a demonstration site. All bookings and schedules are simulated for testing purposes.
      </div>
      
      <div className="card">
        <h1>Book Your Journey</h1>
        
        {/* Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <div style={{ color: step >= 1 ? '#0071e3' : '#86868b', fontWeight: step === 1 ? '500' : '400' }}>
            1. Search Routes
          </div>
          <div style={{ color: step >= 2 ? '#0071e3' : '#86868b', fontWeight: step === 2 ? '500' : '400' }}>
            2. Select Schedule
          </div>
          <div style={{ color: step >= 3 ? '#0071e3' : '#86868b', fontWeight: step === 3 ? '500' : '400' }}>
            3. Choose Seats
          </div>
          <div style={{ color: step >= 4 ? '#0071e3' : '#86868b', fontWeight: step === 4 ? '500' : '400' }}>
            4. Payment
          </div>
        </div>

        {/* Step 1: Search */}
        {step === 1 && (
          <div>
            <h2>Where would you like to go?</h2>
            <div className="grid grid-3">
              <div className="form-group">
                <label>From</label>
                <select
                  className="form-control"
                  value={searchForm.origin}
                  onChange={(e) => setSearchForm({ ...searchForm, origin: e.target.value })}
                  required
                >
                  <option value="">Select Origin</option>
                  {uniqueOrigins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>To</label>
                <select
                  className="form-control"
                  value={searchForm.destination}
                  onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
                  required
                >
                  <option value="">Select Destination</option>
                  {uniqueDestinations.map(destination => (
                    <option key={destination} value={destination}>{destination}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={searchForm.date}
                  onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <button 
              onClick={searchSchedules}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Searching...' : 'Search Available Trips'}
            </button>
          </div>
        )}

        {/* Step 2: Select Schedule */}
        {step === 2 && (
          <div>
            <h2>Available Schedules</h2>
            <p>Route: <strong>{searchForm.origin} → {searchForm.destination}</strong> on {searchForm.date}</p>
            
            {schedules.length === 0 ? (
              <div className="alert alert-error">
                No schedules available for this route and date. Please try a different date.
              </div>
            ) : (
              <div className="grid">
                {schedules.map(schedule => (
                  <div key={schedule.id} className="bus-info" style={{ cursor: 'pointer' }} onClick={() => selectSchedule(schedule)}>
                    <div>
                      <strong>Bus {schedule.bus_number}</strong>
                      <br />
                      <span>Departure: {schedule.departure_time}</span>
                      <br />
                      <span>Arrival: {schedule.arrival_time}</span>
                      <br />
                      <small>{schedule.available_seats} seats available</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong>₱{schedule.fare}</strong>
                      <br />
                      <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        Select Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setStep(1)}
              className="btn"
              style={{ background: '#6c757d', color: 'white', marginTop: '1rem' }}
            >
              ← Back to Search
            </button>
          </div>
        )}

        {/* Step 3: Seat Selection */}
        {step === 3 && selectedSchedule && (
          <div>
            <h2>Select Your Seats</h2>
            <div className="grid grid-2">
              <div>
                <div className="card" style={{ background: '#f8f9fa' }}>
                  <h3>Trip Details</h3>
                  <p><strong>Route:</strong> {selectedSchedule.origin} → {selectedSchedule.destination}</p>
                  <p><strong>Date:</strong> {selectedSchedule.departure_date}</p>
                  <p><strong>Time:</strong> {selectedSchedule.departure_time} - {selectedSchedule.arrival_time}</p>
                  <p><strong>Bus:</strong> {selectedSchedule.bus_number}</p>
                  <p><strong>Fare per seat:</strong> ₱{selectedSchedule.fare}</p>
                  
                  {selectedSeats.length > 0 && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '5px' }}>
                      <h4>Selected Seats: {selectedSeats.join(', ')}</h4>
                      <h3>Total: ₱{(selectedSchedule.fare * selectedSeats.length).toLocaleString()}</h3>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3>Bus Layout</h3>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'inline-flex', gap: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="seat available" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>A</div>
                      <span>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="seat selected" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>S</div>
                      <span>Selected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="seat occupied" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>X</div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  border: '3px solid #e5e7eb', 
                  borderRadius: '20px 20px 10px 10px', 
                  padding: '20px', 
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px', 
                    padding: '10px',
                    background: '#1d1d1f',
                    color: 'white',
                    borderRadius: '10px 10px 0 0',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '-0.01em'
                  }}>
                    FRONT - DRIVER
                  </div>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {generateSeatLayout()}
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px', 
                    padding: '10px',
                    background: '#f1f5f9',
                    borderRadius: '0 0 10px 10px',
                    fontSize: '12px',
                    color: '#86868b',
                    fontWeight: '500'
                  }}>
                    REAR - EXIT
                  </div>
                </div>
                
                <p style={{ fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem', color: '#666' }}>
                  Maximum 4 seats per booking
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setStep(2)}
                className="btn"
                style={{ background: '#6c757d', color: 'white', flex: '1' }}
              >
                ← Back to Schedules
              </button>
              <button 
                onClick={confirmBooking}
                className="btn btn-primary"
                disabled={selectedSeats.length === 0 || loading}
                style={{ flex: '2' }}
              >
                {loading ? 'Creating Booking...' : `Proceed to Payment (₱${(selectedSchedule.fare * selectedSeats.length).toLocaleString()})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;