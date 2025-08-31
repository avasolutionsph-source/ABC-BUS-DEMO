import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  return null;
};

const BusTracker = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter] = useState([14.5995, 120.9842]); // Manila coordinates

  // Bus stop points for each route - aligned with actual route paths
  const routeStops = {
    'Manila → Baguio': [
      { name: 'Manila (Cubao Terminal)', coords: [14.5995, 120.9842], type: 'terminal' },
      { name: 'Balintawak', coords: [14.6569, 120.9917], type: 'stop' },
      { name: 'Meycauayan', coords: [14.7302, 120.9617], type: 'stop' },
      { name: 'San Fernando Exit', coords: [15.0349, 120.9370], type: 'stop' },
      { name: 'Angeles City', coords: [15.1450, 120.5888], type: 'stop' },
      { name: 'Dau Terminal', coords: [15.2343, 120.5886], type: 'stop' },
      { name: 'Tarlac City', coords: [15.4817, 120.5979], type: 'stop' },
      { name: 'Urdaneta', coords: [15.9761, 120.5711], type: 'stop' },
      { name: 'Rosario Junction', coords: [16.2278, 120.4869], type: 'stop' },
      { name: 'Baguio Terminal', coords: [16.4023, 120.5960], type: 'terminal' }
    ],
    'Manila → Vigan': [
      { name: 'Manila (Sampaloc Terminal)', coords: [14.5995, 120.9842], type: 'terminal' },
      { name: 'Balintawak', coords: [14.6569, 120.9917], type: 'stop' },
      { name: 'Meycauayan', coords: [14.7302, 120.9617], type: 'stop' },
      { name: 'Malolos', coords: [14.8434, 120.8111], type: 'stop' },
      { name: 'San Fernando', coords: [15.0349, 120.6850], type: 'stop' },
      { name: 'Tarlac City', coords: [15.4817, 120.5979], type: 'stop' },
      { name: 'Urdaneta', coords: [15.9761, 120.5711], type: 'stop' },
      { name: 'Pozorrubio', coords: [16.1089, 120.5450], type: 'stop' },
      { name: 'San Fabian', coords: [16.2372, 120.4056], type: 'stop' },
      { name: 'San Fernando LU', coords: [16.6162, 120.3176], type: 'stop' },
      { name: 'Vigan Terminal', coords: [17.5748, 120.3873], type: 'terminal' }
    ],
    'Cebu → Dumaguete': [
      { name: 'Cebu South Terminal', coords: [10.2989, 123.8933], type: 'terminal' },
      { name: 'Talisay', coords: [10.2447, 123.8494], type: 'stop' },
      { name: 'Minglanilla', coords: [10.2434, 123.7959], type: 'stop' },
      { name: 'Naga City', coords: [10.2098, 123.7594], type: 'stop' },
      { name: 'San Fernando', coords: [10.1623, 123.7084], type: 'stop' },
      { name: 'Carcar City', coords: [10.1055, 123.6402], type: 'stop' },
      { name: 'Sibonga', coords: [10.0294, 123.5689], type: 'stop' },
      { name: 'Argao', coords: [9.8790, 123.6093], type: 'stop' },
      { name: 'Bato Port', coords: [9.5513, 123.4018], type: 'stop' },
      { name: 'Dumaguete Port', coords: [9.3063, 123.3018], type: 'terminal' }
    ],
    'Davao → CDO': [
      { name: 'Davao Ecoland Terminal', coords: [7.0731, 125.6128], type: 'terminal' },
      { name: 'Panabo City', coords: [7.3083, 125.6847], type: 'stop' },
      { name: 'Tagum City', coords: [7.4478, 125.8076], type: 'stop' },
      { name: 'Nabunturan', coords: [7.6072, 125.9669], type: 'stop' },
      { name: 'Montevista', coords: [7.7053, 125.9856], type: 'stop' },
      { name: 'Valencia City', coords: [7.9092, 125.0942], type: 'stop' },
      { name: 'Malaybalay', coords: [8.1575, 125.1278], type: 'stop' },
      { name: 'Manolo Fortich', coords: [8.3689, 124.8644], type: 'stop' },
      { name: 'CDO Agora Terminal', coords: [8.4542, 124.6319], type: 'terminal' }
    ],
    'Quezon City → Tagaytay': [
      { name: 'QC Terminal', coords: [14.6760, 121.0437], type: 'terminal' },
      { name: 'Makati', coords: [14.5547, 121.0244], type: 'stop' },
      { name: 'Alabang', coords: [14.4224, 121.0444], type: 'stop' },
      { name: 'Santa Rosa Exit', coords: [14.3122, 121.1114], type: 'stop' },
      { name: 'Balibago', coords: [14.2650, 121.0648], type: 'stop' },
      { name: 'Silang Junction', coords: [14.2307, 120.9758], type: 'stop' },
      { name: 'Tagaytay Rotonda', coords: [14.1097, 120.9616], type: 'terminal' }
    ]
  };

  // Comprehensive Philippine route paths for visualization - aligned with stops
  const routePaths = {
    // Major Luzon Routes
    'Manila → Baguio': [
      [14.5995, 120.9842], // Manila
      [14.6569, 120.9917], // Balintawak
      [14.7302, 120.9617], // Meycauayan
      [15.0349, 120.9370], // San Fernando
      [15.1450, 120.5888], // Angeles
      [15.2343, 120.5886], // Dau
      [15.4817, 120.5979], // Tarlac
      [15.9761, 120.5711], // Urdaneta
      [16.2278, 120.4869], // Rosario
      [16.4023, 120.5960]  // Baguio
    ],
    'Manila → Vigan': [
      [14.5995, 120.9842], // Manila
      [14.6569, 120.9917], // Balintawak
      [14.7302, 120.9617], // Meycauayan
      [14.8434, 120.8111], // Malolos
      [15.0349, 120.6850], // San Fernando
      [15.4817, 120.5979], // Tarlac
      [15.9761, 120.5711], // Urdaneta
      [16.1089, 120.5450], // Pozorrubio
      [16.2372, 120.4056], // San Fabian
      [16.6162, 120.3176], // San Fernando LU
      [17.5748, 120.3873]  // Vigan
    ],
    'Manila → Laoag': [
      [14.5995, 120.9842], // Manila
      [15.4817, 120.5979], // Tarlac
      [16.8451, 120.3877], // La Union
      [17.5748, 120.3873], // Vigan
      [18.1967, 120.5934]  // Laoag
    ],
    'Manila → Legazpi': [
      [14.5995, 120.9842], // Manila
      [14.2206, 121.0636], // Tagaytay
      [14.0991, 121.1506], // Batangas
      [13.7565, 121.0583], // Lucena
      [13.6218, 123.1948], // Naga
      [13.1391, 123.7322]  // Legazpi
    ],
    'Quezon City → Tagaytay': [
      [14.6760, 121.0437], // QC Terminal
      [14.5547, 121.0244], // Makati
      [14.4224, 121.0444], // Alabang
      [14.3122, 121.1114], // Santa Rosa
      [14.2650, 121.0648], // Balibago
      [14.2307, 120.9758], // Silang Junction
      [14.1097, 120.9616]  // Tagaytay
    ],
    'Quezon City → Baguio': [
      [14.6760, 121.0437], // Quezon City
      [14.5995, 120.9842], // Manila
      [15.4817, 120.5979], // Tarlac
      [16.4023, 120.5960]  // Baguio
    ],
    
    // Visayas Routes
    'Manila → Cebu': [
      [14.5995, 120.9842], // Manila (flight connection)
      [10.3157, 123.8854]  // Cebu
    ],
    'Manila → Iloilo': [
      [14.5995, 120.9842], // Manila (flight connection)
      [10.7202, 122.5621]  // Iloilo
    ],
    'Manila → Bacolod': [
      [14.5995, 120.9842], // Manila (flight connection)
      [10.6720, 122.9540]  // Bacolod
    ],
    'Cebu → Bohol (Tagbilaran)': [
      [10.3157, 123.8854], // Cebu
      [9.6496, 123.8547]   // Tagbilaran (via ferry)
    ],
    'Cebu → Dumaguete': [
      [10.2989, 123.8933], // Cebu South Terminal
      [10.2447, 123.8494], // Talisay
      [10.2434, 123.7959], // Minglanilla
      [10.2098, 123.7594], // Naga
      [10.1623, 123.7084], // San Fernando
      [10.1055, 123.6402], // Carcar
      [10.0294, 123.5689], // Sibonga
      [9.8790, 123.6093],  // Argao
      [9.5513, 123.4018],  // Bato Port
      [9.3063, 123.3018]   // Dumaguete
    ],
    'Cebu → Tacloban': [
      [10.3157, 123.8854], // Cebu Port (Ferry Terminal)
      [10.3200, 123.8900], // Cebu City Proper
      [10.3157, 123.8854], // Return to Port for Ferry
      // Ferry crossing - not shown on land route
      [11.2421, 125.0011], // Tacloban Port
      [11.2432, 125.0000]  // Tacloban Terminal
    ],
    'Iloilo → Bacolod': [
      [10.7202, 122.5621], // Iloilo City
      [10.7090, 122.5950], // Oton
      [10.6970, 122.6340], // Tigbauan
      [10.6820, 122.6890], // Guimbal
      [10.6790, 122.7450], // Miagao
      [10.6750, 122.8120], // San Joaquin
      [10.6720, 122.9540]  // Bacolod
    ],
    
    // Mindanao Routes
    // Note: These are flight connections, buses don't operate on these routes
    'Davao → Cagayan de Oro': [
      [7.0731, 125.6128],  // Davao Ecoland
      [7.3083, 125.6847],  // Panabo
      [7.4478, 125.8076],  // Tagum
      [7.6072, 125.9669],  // Nabunturan
      [7.7053, 125.9856],  // Montevista
      [7.9092, 125.0942],  // Valencia
      [8.1575, 125.1278],  // Malaybalay
      [8.3689, 124.8644],  // Manolo Fortich
      [8.4542, 124.6319]   // CDO
    ],
    'Davao → General Santos': [
      [7.0731, 125.6128],   // Davao
      [6.1164, 125.1716]    // General Santos
    ],
    'Cagayan de Oro → Iligan': [
      [8.4542, 124.6319],   // Cagayan de Oro
      [8.2280, 124.2452]    // Iligan
    ],
    'Cagayan de Oro → Butuan': [
      [8.4542, 124.6319],   // Cagayan de Oro
      [8.9475, 125.5461]    // Butuan
    ],
    
    // Island Connections
    'Manila → Palawan (Puerto Princesa)': [
      [14.5995, 120.9842], // Manila (flight connection)
      [9.7392, 118.7353]   // Puerto Princesa
    ],
    'Manila → Caticlan (Boracay)': [
      [14.5995, 120.9842], // Manila
      [14.1078, 121.0858], // Batangas City
      [13.9400, 121.1650], // Lipa
      [13.7565, 121.0583], // Batangas
      [13.4670, 121.1920], // Lucena
      [13.1400, 121.4500], // Gumaca
      [12.8090, 121.5600], // Lopez
      [12.3680, 121.7900], // Calauag
      [11.9252, 121.9514]  // Caticlan
    ],
    
    // Regional Routes
    'Baguio → Vigan': [
      [16.4023, 120.5960], // Baguio
      [17.5748, 120.3873]  // Vigan
    ],
    'Baguio → Sagada': [
      [16.4023, 120.5960], // Baguio
      [17.0858, 120.9023]  // Sagada
    ],
    'Batangas → Tagaytay': [
      [13.7565, 121.0583], // Batangas
      [14.2206, 121.0636]  // Tagaytay
    ],
    'Lucena → Naga': [
      [13.9373, 121.6170], // Lucena
      [13.6218, 123.1948]  // Naga
    ],
    'Naga → Legazpi': [
      [13.6218, 123.1948], // Naga
      [13.1391, 123.7322]  // Legazpi
    ]
  };

  // Sample bus data with comprehensive Philippine routes
  const sampleBuses = [
    {
      id: 1,
      bus_number: 'ABC-001',
      route: 'Manila → Baguio',
      status: 'en_route',
      current_lat: 15.3504,  // Between Tarlac and Urdaneta on actual route
      current_lng: 120.6221,
      departure_time: '06:00',
      estimated_arrival: '12:00',
      next_stop: 'Urdaneta',
      passengers: 35,
      capacity: 40,
      progress: 60,
      eta_minutes: 45,
      speed_kph: 65,
      routePath: routePaths['Manila → Baguio'],
      origin: 'Manila Cubao Terminal',
      destination: 'Baguio Central Terminal'
    },
    {
      id: 2,
      bus_number: 'ABC-002',
      route: 'Manila → Vigan',
      status: 'boarding',
      current_lat: 14.5995,
      current_lng: 120.9842,
      departure_time: '14:00',
      estimated_arrival: '22:00',
      next_stop: 'Manila Cubao Terminal',
      passengers: 8,
      capacity: 40,
      progress: 0,
      eta_minutes: 0,
      speed_kph: 0,
      routePath: routePaths['Manila → Vigan'],
      origin: 'Manila Cubao Terminal',
      destination: 'Vigan Bus Terminal'
    },
    {
      id: 3,
      bus_number: 'CEB-001',
      route: 'Cebu → Dumaguete',
      status: 'en_route',
      current_lat: 9.8790,  // At Argao on actual route
      current_lng: 123.6093,
      departure_time: '08:00',
      estimated_arrival: '12:00',
      next_stop: 'Bato Port',
      passengers: 32,
      capacity: 40,
      progress: 75,
      eta_minutes: 30,
      speed_kph: 58,
      routePath: routePaths['Cebu → Dumaguete'],
      origin: 'Cebu South Terminal',
      destination: 'Dumaguete Terminal'
    },
    {
      id: 4,
      bus_number: 'QC-001',
      route: 'Quezon City → Tagaytay',
      status: 'arrived',
      current_lat: 14.2206,
      current_lng: 121.0636,
      departure_time: '07:00',
      estimated_arrival: '09:00',
      next_stop: 'Tagaytay Terminal',
      passengers: 28,
      capacity: 40,
      progress: 100,
      eta_minutes: 0,
      speed_kph: 0,
      routePath: routePaths['Quezon City → Tagaytay'],
      origin: 'Quezon City Terminal',
      destination: 'Tagaytay Bus Terminal'
    },
    {
      id: 5,
      bus_number: 'DVO-001',
      route: 'Davao → Cagayan de Oro',
      status: 'en_route',
      current_lat: 8.1575,  // At Malaybalay on actual route
      current_lng: 125.1278,
      departure_time: '05:00',
      estimated_arrival: '10:00',
      next_stop: 'Manolo Fortich',
      passengers: 38,
      capacity: 40,
      progress: 85,
      eta_minutes: 25,
      speed_kph: 72,
      routePath: routePaths['Davao → Cagayan de Oro'],
      origin: 'Davao Ecoland Terminal',
      destination: 'Cagayan de Oro Agora Terminal'
    },
    {
      id: 6,
      bus_number: 'ABC-008',
      route: 'Manila → Legazpi',
      status: 'en_route',
      current_lat: 13.6218,
      current_lng: 123.1948,
      departure_time: '04:00',
      estimated_arrival: '12:00',
      next_stop: 'Naga Terminal',
      passengers: 36,
      capacity: 40,
      progress: 70,
      eta_minutes: 120,
      speed_kph: 55,
      routePath: routePaths['Manila → Legazpi'],
      origin: 'Manila Cubao Terminal',
      destination: 'Legazpi Grand Terminal'
    },
    {
      id: 7,
      bus_number: 'REG-005',
      route: 'Baguio → Vigan',
      status: 'boarding',
      current_lat: 16.4023,
      current_lng: 120.5960,
      departure_time: '15:00',
      estimated_arrival: '21:00',
      next_stop: 'Baguio Central Terminal',
      passengers: 5,
      capacity: 40,
      progress: 0,
      eta_minutes: 0,
      speed_kph: 0,
      routePath: routePaths['Baguio → Vigan'],
      origin: 'Baguio Central Terminal',
      destination: 'Vigan Bus Terminal'
    },
    {
      id: 8,
      bus_number: 'CEB-003',
      route: 'Cebu → Tacloban',
      status: 'boarding',
      current_lat: 10.3157,  // At Cebu Port waiting for ferry
      current_lng: 123.8854,
      departure_time: '06:00',
      estimated_arrival: '11:00',
      next_stop: 'Ferry Terminal',
      passengers: 30,
      capacity: 40,
      progress: 5,
      eta_minutes: 240,
      speed_kph: 0,
      routePath: routePaths['Cebu → Tacloban'],
      origin: 'Cebu North Terminal',
      destination: 'Tacloban Bus Terminal'
    },
    {
      id: 9,
      bus_number: 'ABC-012',
      route: 'Manila → Caticlan (Boracay)',
      status: 'en_route',
      current_lat: 13.1400,  // At Gumaca, Quezon on actual land route
      current_lng: 121.4500,
      departure_time: '22:00',
      estimated_arrival: '06:00',
      next_stop: 'Lopez',
      passengers: 39,
      capacity: 40,
      progress: 65,
      eta_minutes: 180,
      speed_kph: 68,
      routePath: routePaths['Manila → Caticlan (Boracay)'],
      origin: 'Manila Cubao Terminal',
      destination: 'Caticlan Jetty Port'
    },
    {
      id: 10,
      bus_number: 'ABC-003',
      route: 'Manila → Baguio',
      status: 'en_route',
      current_lat: 14.7584,  // At NLEX Balintawak
      current_lng: 120.9963,
      departure_time: '08:00',
      estimated_arrival: '14:00',
      next_stop: 'San Fernando',
      passengers: 40,
      capacity: 40,
      progress: 25,
      eta_minutes: 210,
      speed_kph: 85,
      routePath: routePaths['Manila → Baguio'],
      origin: 'Manila Cubao Terminal',
      destination: 'Baguio Central Terminal'
    },
    {
      id: 11,
      bus_number: 'ABC-004',
      route: 'Quezon City → Tagaytay',
      status: 'en_route',
      current_lat: 14.4101,  // At Muntinlupa
      current_lng: 121.0494,
      departure_time: '09:00',
      estimated_arrival: '11:00',
      next_stop: 'Tagaytay',
      passengers: 25,
      capacity: 40,
      progress: 50,
      eta_minutes: 60,
      speed_kph: 45,
      routePath: routePaths['Quezon City → Tagaytay'],
      origin: 'Quezon City Terminal',
      destination: 'Tagaytay Bus Terminal'
    },
    {
      id: 12,
      bus_number: 'ABC-005',
      route: 'Manila → Vigan',
      status: 'en_route',
      current_lat: 16.3756,  // At San Fernando La Union
      current_lng: 120.3173,
      departure_time: '05:00',
      estimated_arrival: '13:00',
      next_stop: 'Candon',
      passengers: 38,
      capacity: 40,
      progress: 70,
      eta_minutes: 120,
      speed_kph: 70,
      routePath: routePaths['Manila → Vigan'],
      origin: 'Manila Cubao Terminal',
      destination: 'Vigan Bus Terminal'
    }
  ];

  useEffect(() => {
    // Initialize with sample data
    setBuses(sampleBuses);
    setLoading(false);

    // Setup socket connection for real-time updates
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && selectedBus) {
      socket.emit('track-bus', selectedBus.id);
      
      socket.on('bus-location-update', (data) => {
        if (data.busId === selectedBus.id) {
          setBusLocation(data.location);
          // Update the bus in the buses array
          setBuses(prevBuses => 
            prevBuses.map(bus => 
              bus.id === selectedBus.id 
                ? { ...bus, current_lat: data.location.lat, current_lng: data.location.lng }
                : bus
            )
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('bus-location-update');
      }
    };
  }, [socket, selectedBus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_route':
        return '#28a745';
      case 'boarding':
        return '#ffc107';
      case 'arrived':
        return '#17a2b8';
      case 'maintenance':
        return '#dc3545';
      case 'inactive':
        return '#6c757d';
      default:
        return '#667eea';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_route':
        return '🚌';
      case 'boarding':
        return '🚏';
      case 'arrived':
        return '✅';
      case 'maintenance':
        return '🔧';
      case 'inactive':
        return '⏸️';
      default:
        return '🚌';
    }
  };

  const selectBus = (bus) => {
    setSelectedBus(bus);
    setBusLocation({ lat: bus.current_lat, lng: bus.current_lng });
  };

  // Create custom bus icons for different statuses
  const createBusIcon = (status) => {
    const colors = {
      'en_route': '#28a745',
      'boarding': '#ffc107',
      'arrived': '#17a2b8',
      'maintenance': '#dc3545',
      'inactive': '#6c757d'
    };
    
    return new L.divIcon({
      html: `
        <div style="
          background: ${colors[status] || '#667eea'}; 
          color: white; 
          border-radius: 50%; 
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 18px; 
          border: 3px solid white; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: ${status === 'en_route' ? 'pulse 2s infinite' : 'none'};
        ">🚌</div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      `,
      iconSize: [40, 40],
      className: 'custom-bus-icon'
    });
  };

  // Create terminal/stop icons
  const startTerminalIcon = new L.divIcon({
    html: `<div style="background: white; color: #333; border-radius: 4px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🏢</div>`,
    iconSize: [30, 30],
    className: 'start-terminal-icon'
  });

  const endTerminalIcon = new L.divIcon({
    html: `<div style="background: #22c55e; color: white; border-radius: 4px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🎯</div>`,
    iconSize: [30, 30],
    className: 'end-terminal-icon'
  });

  if (loading) {
    return <div className="loading">Loading bus tracker...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', margin: '-2rem -24px' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        position: 'relative',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>🚌 Live Bus Tracker</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
          Real-time GPS tracking • {buses.length} active buses
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '380px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          zIndex: 500,
          flexShrink: 0
        }}>
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '1.125rem' }}>Active Buses</h3>
            
            {/* Search Box */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="🔍 Search bus code (e.g., ABC-001)"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Auto-select if exact match found
                    const exactMatch = buses.find(b => 
                      b.bus_number.toLowerCase() === e.target.value.toLowerCase()
                    );
                    if (exactMatch) {
                      selectBus(exactMatch);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: selectedBus ? '100px' : '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                {selectedBus && (
                  <button
                    onClick={() => {
                      setSelectedBus(null);
                      setSearchTerm('');
                    }}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              {searchTerm && buses.filter(bus => 
                bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <p style={{ 
                  marginTop: '8px', 
                  fontSize: '12px', 
                  color: '#ef4444' 
                }}>
                  No buses found matching "{searchTerm}"
                </p>
              )}
            </div>
            
            {buses
              .filter(bus => 
                searchTerm === '' || 
                bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(bus => (
              <div
                key={bus.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  border: selectedBus?.id === bus.id ? '2px solid #667eea' : '1px solid #e1e5e9',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedBus?.id === bus.id ? '#f0f8ff' : 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedBus?.id === bus.id ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onClick={() => selectBus(bus)}
              >
                {/* Bus Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getStatusIcon(bus.status)}</span>
                    <h4 style={{ margin: 0, color: '#333' }}>{bus.bus_number}</h4>
                  </div>
                  <span 
                    style={{ 
                      background: getStatusColor(bus.status),
                      color: 'white',
                      padding: '0.2rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {bus.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Route Info */}
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#667eea', fontSize: '0.9rem' }}>
                  {bus.route}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    background: '#f0f0f0', 
                    borderRadius: '10px', 
                    height: '6px', 
                    overflow: 'hidden' 
                  }}>
                    <div 
                      style={{
                        background: getStatusColor(bus.status),
                        height: '100%',
                        width: `${bus.progress}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                    {bus.progress}% complete
                  </div>
                </div>

                {/* ETA and Next Stop */}
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {bus.eta_minutes > 0 ? (
                    <p style={{ margin: '0 0 0.2rem 0' }}>
                      <strong>ETA:</strong> {bus.eta_minutes} minutes
                    </p>
                  ) : null}
                  {bus.speed_kph > 0 ? (
                    <p style={{ margin: '0 0 0.2rem 0' }}>
                      <strong>Speed:</strong> {bus.speed_kph} km/h
                    </p>
                  ) : null}
                  <p style={{ margin: '0 0 0.2rem 0' }}>
                    <strong>Next Stop:</strong> {bus.next_stop}
                  </p>
                  <p style={{ margin: '0 0 0.2rem 0' }}>
                    <strong>Passengers:</strong> {bus.passengers}/{bus.capacity} 
                    ({Math.round((bus.passengers / bus.capacity) * 100)}% full)
                  </p>
                  
                  {/* Show stop points count */}
                  {routeStops[bus.route] && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#667eea' }}>
                      🚏 {routeStops[bus.route].filter(s => s.type === 'stop').length} stop points available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Screen Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={selectedBus ? [selectedBus.current_lat, selectedBus.current_lng] : mapCenter}
            zoom={selectedBus ? 13 : 7}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <MapController 
              center={selectedBus ? [selectedBus.current_lat, selectedBus.current_lng] : mapCenter}
              zoom={selectedBus ? 13 : 7}
            />
            
            {/* Modern Map Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Route Paths - Only show selected bus route or all if none selected */}
            {buses
              .filter(bus => !selectedBus || bus.id === selectedBus.id)
              .map(bus => (
                bus.routePath && (
                  <Polyline
                    key={`route-${bus.id}`}
                    positions={bus.routePath}
                    pathOptions={{
                      color: selectedBus?.id === bus.id ? '#667eea' : '#ccc',
                      weight: selectedBus?.id === bus.id ? 6 : 3,
                      opacity: selectedBus?.id === bus.id ? 1 : 0.5,
                      dashArray: bus.status === 'boarding' ? '10, 10' : null
                    }}
                  />
                )
            ))}

            {/* Stop Points and Terminal Markers - Only show for selected bus */}
            {buses
              .filter(bus => !selectedBus || bus.id === selectedBus.id)
              .map(bus => {
                const routeKey = bus.route;
                const stops = routeStops[routeKey] || [];
                
                return (
                  <React.Fragment key={`stops-${bus.id}`}>
                    {/* Show all stop points for this route */}
                    {stops.map((stop, index) => {
                    let stopIcon;
                    if (stop.type === 'terminal') {
                      // First terminal is start (white), last terminal is end (green)
                      stopIcon = index === 0 ? startTerminalIcon : endTerminalIcon;
                    } else {
                      stopIcon = new L.divIcon({
                        html: `<div style="background: ${selectedBus?.id === bus.id ? '#ef4444' : '#dc2626'}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">•</div>`,
                        iconSize: [24, 24],
                        className: 'stop-icon'
                      });
                    }
                    
                    return (
                      <Marker
                        key={`stop-${bus.id}-${index}`}
                        position={stop.coords}
                        icon={stopIcon}
                      >
                        <Popup>
                          <div style={{ minWidth: '150px' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                              {stop.type === 'terminal' ? '🏢' : '🚏'} {stop.name}
                            </h4>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#64748b' }}>
                              {stop.type === 'terminal' ? 'Terminal' : 'Bus Stop'}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#667eea' }}>
                              Route: {routeKey}
                            </p>
                            {stop.type === 'stop' && (
                              <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#86868b' }}>
                                Passengers can board/alight here
                              </p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Bus Markers - Only show selected bus or all if none selected */}
            {buses
              .filter(bus => !selectedBus || bus.id === selectedBus.id)
              .map(bus => (
              <Marker
                key={bus.id}
                position={[bus.current_lat, bus.current_lng]}
                icon={createBusIcon(bus.status)}
              >
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      {getStatusIcon(bus.status)} {bus.bus_number}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#667eea' }}>
                      {bus.route}
                    </p>
                    
                    <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Status:</strong> {bus.status.replace('_', ' ').toUpperCase()}
                      </p>
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Progress:</strong> {bus.progress}%
                      </p>
                      {bus.eta_minutes > 0 && (
                        <p style={{ margin: '0.2rem 0' }}>
                          <strong>ETA:</strong> {bus.eta_minutes} minutes
                        </p>
                      )}
                      {bus.speed_kph > 0 && (
                        <p style={{ margin: '0.2rem 0' }}>
                          <strong>Speed:</strong> {bus.speed_kph} km/h
                        </p>
                      )}
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Next Stop:</strong> {bus.next_stop}
                      </p>
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Passengers:</strong> {bus.passengers}/{bus.capacity}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => selectBus(bus)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Track This Bus
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button
              onClick={() => setSelectedBus(null)}
              style={{
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              title="Show All Buses"
            >
              🗺️
            </button>
          </div>

          {/* Map Legend */}
          <div style={{
            position: 'absolute',
            bottom: selectedBus ? '100px' : '20px',
            left: '20px',
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxWidth: '220px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
              Map Legend
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  background: 'white', 
                  border: '2px solid #333', 
                  borderRadius: '4px', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>🏢</div>
                <span style={{ color: '#64748b' }}>Start Terminal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  background: '#22c55e', 
                  borderRadius: '4px', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white'
                }}>🎯</div>
                <span style={{ color: '#64748b' }}>End Terminal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  background: '#dc2626', 
                  borderRadius: '50%', 
                  width: '16px', 
                  height: '16px',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}></div>
                <span style={{ color: '#64748b' }}>Bus Stop Point</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  background: '#667eea', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>🚌</div>
                <span style={{ color: '#64748b' }}>Active Bus</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  borderTop: '3px solid #667eea',
                  width: '20px'
                }}></div>
                <span style={{ color: '#64748b' }}>Bus Route</span>
              </div>
            </div>
            <p style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid #e5e7eb',
              fontSize: '11px', 
              color: '#86868b',
              margin: '12px 0 0 0'
            }}>
              💡 Tip: Click on any marker for details or search for a specific bus code
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar for Selected Bus */}
      {selectedBus && (
        <div style={{
          background: '#667eea',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              🎯 Tracking: {selectedBus.bus_number}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
              {selectedBus.route} • {selectedBus.progress}% complete • {selectedBus.speed_kph} km/h
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {selectedBus.eta_minutes > 0 ? (
              <>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedBus.eta_minutes} min
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  ETA to {selectedBus.next_stop}
                </div>
              </>
            ) : (
              <div style={{ fontSize: '1.2rem' }}>
                {getStatusIcon(selectedBus.status)} {selectedBus.status.replace('_', ' ').toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedBus(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            Show All Buses
          </button>
        </div>
      )}
    </div>
  );
};

export default BusTracker;