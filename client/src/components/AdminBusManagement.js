import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AdminBusManagement = () => {
  const [buses, setBuses] = useState([
    {
      id: 1,
      busNumber: 'ABC-001',
      plateNumber: 'ABC 1234',
      type: 'Deluxe',
      capacity: 45,
      status: 'active',
      currentRoute: 'Manila → Baguio',
      driver: 'Roberto Cruz',
      lastMaintenance: '2024-11-15',
      nextMaintenance: '2025-01-15',
      totalTrips: 1247,
      mileage: 125430,
      fuelEfficiency: '8.5 km/L',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      busNumber: 'ABC-002',
      plateNumber: 'ABC 5678',
      type: 'Super Deluxe',
      capacity: 40,
      status: 'active',
      currentRoute: 'Manila → Vigan',
      driver: 'Jose Reyes',
      lastMaintenance: '2024-10-20',
      nextMaintenance: '2024-12-20',
      totalTrips: 983,
      mileage: 98500,
      fuelEfficiency: '9.2 km/L',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      busNumber: 'CEB-001',
      plateNumber: 'CEB 2468',
      type: 'Regular',
      capacity: 55,
      status: 'active',
      currentRoute: 'Cebu → Dumaguete',
      driver: 'Miguel Santos',
      lastMaintenance: '2024-11-01',
      nextMaintenance: '2025-01-01',
      totalTrips: 2156,
      mileage: 215600,
      fuelEfficiency: '7.8 km/L',
      image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      busNumber: 'DVO-001',
      plateNumber: 'DVO 1357',
      type: 'Deluxe',
      capacity: 45,
      status: 'maintenance',
      currentRoute: 'N/A',
      driver: 'N/A',
      lastMaintenance: '2024-12-01',
      nextMaintenance: '2025-02-01',
      totalTrips: 1890,
      mileage: 189000,
      fuelEfficiency: '8.0 km/L',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      busNumber: 'ABC-003',
      plateNumber: 'ABC 9876',
      type: 'Super Deluxe',
      capacity: 40,
      status: 'inactive',
      currentRoute: 'N/A',
      driver: 'Pending Assignment',
      lastMaintenance: '2024-09-15',
      nextMaintenance: '2024-11-15',
      totalTrips: 567,
      mileage: 56700,
      fuelEfficiency: '9.0 km/L',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newBus, setNewBus] = useState({
    busNumber: '',
    plateNumber: '',
    type: 'Regular',
    capacity: 50,
    driver: ''
  });

  const handleAddBus = () => {
    if (!newBus.busNumber || !newBus.plateNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bus = {
      id: buses.length + 1,
      ...newBus,
      status: 'inactive',
      currentRoute: 'N/A',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
      totalTrips: 0,
      mileage: 0,
      fuelEfficiency: '0 km/L',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
    };

    setBuses([...buses, bus]);
    setNewBus({ busNumber: '', plateNumber: '', type: 'Regular', capacity: 50, driver: '' });
    setShowAddModal(false);
    toast.success('Bus added successfully!');
  };

  const handleUpdateStatus = (busId, newStatus) => {
    setBuses(buses.map(bus => 
      bus.id === busId ? { ...bus, status: newStatus } : bus
    ));
    toast.success(`Bus status updated to ${newStatus}`);
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(buses.filter(bus => bus.id !== busId));
      toast.success('Bus deleted successfully');
    }
  };

  const filteredBuses = buses.filter(bus => {
    const matchesStatus = filterStatus === 'all' || bus.status === filterStatus;
    const matchesSearch = bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.driver.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Bus Fleet Management</h1>
            <p style={{ color: '#64748b' }}>Manage your entire bus fleet, maintenance schedules, and driver assignments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            + Add New Bus
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>🚌</div>
            <div className="stat-value">{buses.length}</div>
            <div className="stat-label">Total Buses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>✅</div>
            <div className="stat-value">{buses.filter(b => b.status === 'active').length}</div>
            <div className="stat-label">Active Buses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>🔧</div>
            <div className="stat-value">{buses.filter(b => b.status === 'maintenance').length}</div>
            <div className="stat-label">In Maintenance</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2' }}>⏸️</div>
            <div className="stat-value">{buses.filter(b => b.status === 'inactive').length}</div>
            <div className="stat-label">Inactive</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search by bus number, plate, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ maxWidth: '400px' }}
          />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control"
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Bus List */}
        <div className="grid grid-2">
          {filteredBuses.map(bus => (
            <div key={bus.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                height: '200px',
                backgroundImage: `url(${bus.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <span 
                  className={`badge badge-${getStatusColor(bus.status)}`}
                  style={{ position: 'absolute', top: '12px', right: '12px' }}
                >
                  {bus.status}
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>{bus.busNumber}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Plate: {bus.plateNumber}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{bus.type}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Capacity: {bus.capacity}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Driver:</span>
                    <div style={{ fontWeight: '500' }}>{bus.driver}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Current Route:</span>
                    <div style={{ fontWeight: '500' }}>{bus.currentRoute}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Total Trips:</span>
                    <div style={{ fontWeight: '500' }}>{bus.totalTrips.toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Mileage:</span>
                    <div style={{ fontWeight: '500' }}>{bus.mileage.toLocaleString()} km</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Fuel Efficiency:</span>
                    <div style={{ fontWeight: '500' }}>{bus.fuelEfficiency}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Next Maintenance:</span>
                    <div style={{ fontWeight: '500', color: new Date(bus.nextMaintenance) < new Date(Date.now() + 30*24*60*60*1000) ? '#dc2626' : '#16a34a' }}>
                      {bus.nextMaintenance}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      setSelectedBus(bus);
                      setShowEditModal(true);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.875rem' }}
                  >
                    Edit Details
                  </button>
                  {bus.status === 'active' && (
                    <button 
                      onClick={() => handleUpdateStatus(bus.id, 'maintenance')}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '8px', fontSize: '0.875rem' }}
                    >
                      Send to Maintenance
                    </button>
                  )}
                  {bus.status === 'maintenance' && (
                    <button 
                      onClick={() => handleUpdateStatus(bus.id, 'active')}
                      className="btn btn-success"
                      style={{ flex: 1, padding: '8px', fontSize: '0.875rem' }}
                    >
                      Mark as Active
                    </button>
                  )}
                  {bus.status === 'inactive' && (
                    <button 
                      onClick={() => handleUpdateStatus(bus.id, 'active')}
                      className="btn btn-success"
                      style={{ flex: 1, padding: '8px', fontSize: '0.875rem' }}
                    >
                      Activate
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteBus(bus.id)}
                    className="btn btn-danger"
                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
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
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New Bus</h2>
            <div className="form-group">
              <label className="form-label">Bus Number *</label>
              <input
                type="text"
                className="form-control"
                value={newBus.busNumber}
                onChange={(e) => setNewBus({...newBus, busNumber: e.target.value})}
                placeholder="e.g., ABC-004"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Plate Number *</label>
              <input
                type="text"
                className="form-control"
                value={newBus.plateNumber}
                onChange={(e) => setNewBus({...newBus, plateNumber: e.target.value})}
                placeholder="e.g., ABC 1234"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                value={newBus.type}
                onChange={(e) => setNewBus({...newBus, type: e.target.value})}
              >
                <option value="Regular">Regular</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Super Deluxe">Super Deluxe</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                value={newBus.capacity}
                onChange={(e) => setNewBus({...newBus, capacity: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Driver</label>
              <input
                type="text"
                className="form-control"
                value={newBus.driver}
                onChange={(e) => setNewBus({...newBus, driver: e.target.value})}
                placeholder="Driver name"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBus}
                className="btn btn-primary"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusManagement;