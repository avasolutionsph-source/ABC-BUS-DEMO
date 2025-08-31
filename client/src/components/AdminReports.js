import React, { useState } from 'react';

const AdminReports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample data for different report types
  const revenueData = {
    daily: [
      { date: '2024-12-20', revenue: 45680, bookings: 52, passengers: 87 },
      { date: '2024-12-21', revenue: 38920, bookings: 43, passengers: 71 },
      { date: '2024-12-22', revenue: 52340, bookings: 61, passengers: 98 },
      { date: '2024-12-23', revenue: 41200, bookings: 48, passengers: 79 },
      { date: '2024-12-24', revenue: 67890, bookings: 78, passengers: 125 }
    ],
    monthly: [
      { month: 'August 2024', revenue: 985600, bookings: 1234, passengers: 2156 },
      { month: 'September 2024', revenue: 1123400, bookings: 1456, passengers: 2489 },
      { month: 'October 2024', revenue: 1256780, bookings: 1678, passengers: 2890 },
      { month: 'November 2024', revenue: 1089340, bookings: 1345, passengers: 2345 },
      { month: 'December 2024', revenue: 1456890, bookings: 1890, passengers: 3234 }
    ]
  };

  const routePerformance = [
    { route: 'Manila → Baguio', trips: 456, revenue: 387600, occupancy: '85%', avgPassengers: 38 },
    { route: 'Manila → Vigan', trips: 234, revenue: 280800, occupancy: '78%', avgPassengers: 31 },
    { route: 'Cebu → Dumaguete', trips: 345, revenue: 224250, occupancy: '92%', avgPassengers: 42 },
    { route: 'Davao → CDO', trips: 289, revenue: 283220, occupancy: '81%', avgPassengers: 36 },
    { route: 'Quezon City → Tagaytay', trips: 567, revenue: 255150, occupancy: '88%', avgPassengers: 40 }
  ];

  const busPerformance = [
    { busNumber: 'ABC-001', trips: 234, revenue: 198900, mileage: 45670, fuelCost: 34560, maintenance: 12340, profit: 152000 },
    { busNumber: 'ABC-002', trips: 198, revenue: 168300, mileage: 38900, fuelCost: 28900, maintenance: 8900, profit: 130500 },
    { busNumber: 'CEB-001', trips: 267, revenue: 227950, mileage: 52300, fuelCost: 41200, maintenance: 15600, profit: 171150 },
    { busNumber: 'DVO-001', trips: 189, revenue: 170100, mileage: 34500, fuelCost: 26700, maintenance: 9800, profit: 133600 },
    { busNumber: 'ABC-003', trips: 145, revenue: 123250, mileage: 28900, fuelCost: 21300, maintenance: 7650, profit: 94300 }
  ];

  const customerMetrics = {
    totalCustomers: 5678,
    newCustomers: 456,
    returningCustomers: 5222,
    avgBookingsPerCustomer: 2.4,
    customerSatisfaction: '4.6/5.0',
    topCustomers: [
      { name: 'Juan Dela Cruz', bookings: 45, totalSpent: 38250 },
      { name: 'Maria Santos', bookings: 38, totalSpent: 32300 },
      { name: 'Pedro Garcia', bookings: 34, totalSpent: 28900 },
      { name: 'Ana Reyes', bookings: 31, totalSpent: 26350 },
      { name: 'Roberto Lopez', bookings: 28, totalSpent: 23800 }
    ]
  };

  const handleExportReport = () => {
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    alert(`Report exported as ${filename}`);
  };

  const renderRevenueReport = () => (
    <div>
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>💰</div>
          <div className="stat-value">₱1,456,890</div>
          <div className="stat-label">Total Revenue (This Month)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>📈</div>
          <div className="stat-value">+33.7%</div>
          <div className="stat-label">Growth vs Last Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🎯</div>
          <div className="stat-value">₱772/trip</div>
          <div className="stat-label">Average Revenue per Trip</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Revenue Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>
                {dateRange === 'daily' ? 'Date' : 'Month'}
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Revenue</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Bookings</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Passengers</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Avg per Booking</th>
            </tr>
          </thead>
          <tbody>
            {(dateRange === 'daily' ? revenueData.daily : revenueData.monthly).map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  {item.date || item.month}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>
                  ₱{item.revenue.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  {item.bookings.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  {item.passengers.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  ₱{Math.round(item.revenue / item.bookings).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRouteReport = () => (
    <div>
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>🛣️</div>
          <div className="stat-value">24</div>
          <div className="stat-label">Active Routes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>📊</div>
          <div className="stat-value">85%</div>
          <div className="stat-label">Average Occupancy</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⭐</div>
          <div className="stat-value">Manila-Baguio</div>
          <div className="stat-label">Top Performing Route</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Route Performance Analysis</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Route</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Total Trips</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Revenue</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Occupancy</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Avg Passengers</th>
            </tr>
          </thead>
          <tbody>
            {routePerformance.map((route, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>{route.route}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{route.trips}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>
                  ₱{route.revenue.toLocaleString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '8px', 
                      background: '#e5e7eb', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: route.occupancy, 
                        height: '100%', 
                        background: '#3b82f6' 
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.875rem' }}>{route.occupancy}</span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{route.avgPassengers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBusReport = () => (
    <div>
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>🚌</div>
          <div className="stat-value">45</div>
          <div className="stat-label">Total Fleet Size</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>⚙️</div>
          <div className="stat-value">84%</div>
          <div className="stat-label">Fleet Utilization</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⛽</div>
          <div className="stat-value">8.5 km/L</div>
          <div className="stat-label">Avg Fuel Efficiency</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Bus Performance Metrics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Bus Number</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Trips</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Revenue</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Fuel Cost</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Maintenance</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {busPerformance.map((bus, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>{bus.busNumber}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{bus.trips}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600', color: '#16a34a' }}>
                  +₱{bus.revenue.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', color: '#dc2626' }}>
                  -₱{bus.fuelCost.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', color: '#dc2626' }}>
                  -₱{bus.maintenance.toLocaleString()}
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>
                  ₱{bus.profit.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div>
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>👥</div>
          <div className="stat-value">{customerMetrics.totalCustomers.toLocaleString()}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>🆕</div>
          <div className="stat-value">{customerMetrics.newCustomers}</div>
          <div className="stat-label">New This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🔄</div>
          <div className="stat-value">{customerMetrics.avgBookingsPerCustomer}</div>
          <div className="stat-label">Avg Bookings/Customer</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}>⭐</div>
          <div className="stat-value">{customerMetrics.customerSatisfaction}</div>
          <div className="stat-label">Satisfaction Score</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Top Customers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Rank</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Customer Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Total Bookings</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Total Spent</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', color: '#64748b' }}>Loyalty Status</th>
            </tr>
          </thead>
          <tbody>
            {customerMetrics.topCustomers.map((customer, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%',
                    background: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#f97316' : '#e5e7eb',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}>
                    {index + 1}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500' }}>{customer.name}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem' }}>{customer.bookings}</td>
                <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '600' }}>
                  ₱{customer.totalSpent.toLocaleString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${customer.bookings > 40 ? 'warning' : customer.bookings > 30 ? 'info' : 'success'}`}>
                    {customer.bookings > 40 ? 'Gold' : customer.bookings > 30 ? 'Silver' : 'Bronze'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Reports & Analytics</h1>
          <p style={{ color: '#64748b' }}>Generate comprehensive reports for business insights and decision making</p>
        </div>

        {/* Report Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '32px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px',
          flexWrap: 'wrap'
        }}>
          <div>
            <label className="form-label">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-control"
              style={{ width: '200px' }}
            >
              <option value="revenue">Revenue Report</option>
              <option value="route">Route Performance</option>
              <option value="bus">Bus Performance</option>
              <option value="customer">Customer Analytics</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Period</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-control"
              style={{ width: '150px' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginLeft: 'auto' }}>
            <button 
              onClick={handleExportReport}
              className="btn btn-secondary"
            >
              📥 Export CSV
            </button>
            <button 
              onClick={handleExportReport}
              className="btn btn-secondary"
            >
              📄 Export PDF
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'revenue' && renderRevenueReport()}
        {reportType === 'route' && renderRouteReport()}
        {reportType === 'bus' && renderBusReport()}
        {reportType === 'customer' && renderCustomerReport()}

        {/* Summary Card */}
        <div className="card" style={{ 
          marginTop: '32px', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          border: '1px solid #c7d2fe'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>Report Summary</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            This report was generated on {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {new Date().toLocaleTimeString('en-US')}.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Report Type:</span>
              <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{reportType} Analysis</div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Period:</span>
              <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{dateRange}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Generated By:</span>
              <div style={{ fontWeight: '600' }}>Admin User</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;