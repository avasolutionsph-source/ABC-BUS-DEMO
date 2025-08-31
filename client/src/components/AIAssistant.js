import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      type: 'ai', 
      text: `Welcome to ABC Bus AI Assistant! 🤖
      
I'm here to help you manage your bus operations efficiently. I can:
• Calculate fuel costs for any route
• Track bus locations and performance
• Analyze driver behavior and safety
• Generate sales and revenue reports
• Monitor fleet efficiency

Type your question or try one of the quick actions below!` 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculateFuelCost = (distance, busType = 'standard') => {
    const fuelPrices = { diesel: 65.50, premium: 72.30 }; // PHP per liter
    const consumption = {
      standard: 4.2,  // km/L
      luxury: 3.8,     // km/L
      economy: 5.1     // km/L
    };
    
    const kmPerLiter = consumption[busType] || consumption.standard;
    const litersNeeded = distance / kmPerLiter;
    const cost = litersNeeded * fuelPrices.diesel;
    
    return {
      liters: litersNeeded.toFixed(2),
      cost: cost.toFixed(2),
      kmPerLiter,
      pricePerLiter: fuelPrices.diesel
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage.toLowerCase();
    setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    
    // Process AI response
    setTimeout(() => {
      let response = '';
      
      if (userMsg.includes('fuel') && (userMsg.includes('cost') || userMsg.includes('calculate'))) {
        // Extract distance from message if provided
        const distanceMatch = userMsg.match(/\d+/);
        const distance = distanceMatch ? parseInt(distanceMatch[0]) : 350; // Default 350km
        
        const fuelData = calculateFuelCost(distance);
        response = `⛽ Fuel Cost Calculation for ${distance}km Journey:

📊 Calculation Details:
• Distance: ${distance} km
• Bus Type: Standard (4.2 km/L)
• Fuel Efficiency: ${fuelData.kmPerLiter} km/L
• Current Diesel Price: ₱${fuelData.pricePerLiter}/L

💰 Cost Breakdown:
• Fuel Required: ${fuelData.liters} liters
• Total Fuel Cost: ₱${parseFloat(fuelData.cost).toLocaleString()}
• Cost per Kilometer: ₱${(fuelData.cost/distance).toFixed(2)}

💡 Recommendations:
• Consider luxury buses for premium routes (₱${calculateFuelCost(distance, 'luxury').cost})
• Economy buses can save ₱${(fuelData.cost - calculateFuelCost(distance, 'economy').cost).toFixed(2)} on this route`;
        
      } else if (userMsg.includes('manila') && userMsg.includes('baguio')) {
        const fuelData = calculateFuelCost(245); // Manila to Baguio distance
        response = `🚌 Manila to Baguio Route Analysis:

📍 Route Details:
• Distance: 245 km via NLEX-SCTEX
• Travel Time: 4-5 hours
• Elevation Gain: 1,500m

⛽ Fuel Cost Calculation:
• Fuel Required: ${fuelData.liters} liters
• Total Fuel Cost: ₱${parseFloat(fuelData.cost).toLocaleString()}
• Cost per Passenger (45 seats): ₱${(fuelData.cost/45).toFixed(2)}

💰 Profitability Analysis:
• Ticket Price: ₱850 per passenger
• Full Capacity Revenue: ₱38,250
• Fuel Cost: ₱${fuelData.cost}
• Estimated Profit Margin: ₱${(38250 - parseFloat(fuelData.cost) - 5000).toLocaleString()} (after fuel & operations)`;

      } else if (userMsg.includes('cebu') && userMsg.includes('dumaguete')) {
        const fuelData = calculateFuelCost(165); // Cebu to Dumaguete distance
        response = `🚌 Cebu to Dumaguete Route Analysis:

📍 Route Details:
• Distance: 165 km (includes ferry)
• Travel Time: 3.5 hours
• Ferry Crossing: Included

⛽ Fuel Cost Calculation:
• Fuel Required: ${fuelData.liters} liters
• Total Fuel Cost: ₱${parseFloat(fuelData.cost).toLocaleString()}
• Ferry Fee: ₱1,200 (bus + driver)

💰 Total Operating Cost:
• Fuel: ₱${fuelData.cost}
• Ferry: ₱1,200
• Total: ₱${(parseFloat(fuelData.cost) + 1200).toFixed(2)}
• Cost per Passenger (45 seats): ₱${((parseFloat(fuelData.cost) + 1200)/45).toFixed(2)}`;

      } else if (userMsg.includes('sales') || userMsg.includes('revenue')) {
        response = `📊 Sales & Revenue Report:

📈 Today's Performance:
• Total Revenue: ₱127,850
• Tickets Sold: 156
• Average Ticket Price: ₱819.55
• Occupancy Rate: 78%

💰 This Week:
• Revenue: ₱893,950
• Growth vs Last Week: +12.5%
• Best Day: Monday (₱152,300)
• Top Route: Manila → Baguio (₱245,000)

📊 Fuel Cost Analysis:
• Total Fuel Expenses: ₱178,500
• Revenue After Fuel: ₱715,450
• Fuel/Revenue Ratio: 19.97%
• Profit Margin: 42.3%`;

      } else if (userMsg.includes('driver') || userMsg.includes('performance')) {
        response = `👨‍✈️ Driver Performance & Fuel Efficiency:

🏆 Top Performers (Fuel Efficiency):
1. Roberto Cruz - 4.8 km/L (14% above average)
   • Routes: Manila-Baguio
   • Savings: ₱2,340/week
   
2. Maria Santos - 4.6 km/L (10% above average)
   • Routes: Cebu-Dumaguete
   • Savings: ₱1,890/week

⚠️ Needs Improvement:
• Juan Dela Cruz - 3.5 km/L
  Recommendation: Driver training on eco-driving
  Potential Savings: ₱3,200/week

📊 Fleet Average: 4.2 km/L
💡 Target: 4.5 km/L (Save ₱45,000/month)`;

      } else if (userMsg.includes('help') || userMsg.includes('legend')) {
        response = `📚 AI Assistant Guide:

🎯 Quick Commands:
• "Calculate fuel cost for [distance]km" - Get fuel calculation
• "Manila to Baguio fuel cost" - Route-specific analysis
• "Sales report" - View revenue and sales data
• "Driver performance" - Check driver metrics
• "Bus status" - Live fleet tracking

💡 Pro Tips:
1. Include specific numbers for accurate calculations
2. Mention route names for detailed analysis
3. Ask about specific buses for maintenance alerts

📊 Available Data:
• 45 buses in fleet
• 24 active routes
• Real-time fuel prices
• Driver performance metrics
• Historical sales data

Type any question about operations, fuel, sales, or fleet management!`;

      } else if (userMsg.includes('bus') && userMsg.includes('status')) {
        response = `🚌 Live Fleet Status:

🟢 En Route (12 buses):
• ABC-001: Manila → Baguio (75km remaining)
  Fuel: 65% | Speed: 78 km/h | ETA: 1h 15m
  
• ABC-002: Cebu → Dumaguete (45km remaining)
  Fuel: 42% | Speed: 65 km/h | ETA: 45min

🟡 At Terminal (8 buses):
• ABC-010: Manila Terminal (Departing 2:30 PM)
• ABC-015: Baguio Terminal (Maintenance check)

🔴 Maintenance (3 buses):
• ABC-018: Engine service (Complete: Tomorrow)
• ABC-022: Tire replacement (Complete: Today 5PM)

⛽ Low Fuel Alert:
• ABC-002: 42% - Refuel at next stop
• ABC-007: 38% - Schedule refueling`;

      } else {
        response = `I can help you with that! Here's what I found:

Based on your query about "${inputMessage}", here are some relevant insights:

📊 Current Operations:
• Fleet Efficiency: 87%
• Active Buses: 38/45
• Today's Fuel Consumption: 2,847 liters
• Estimated Fuel Cost: ₱186,480

💡 Suggestions:
1. Try "calculate fuel cost for 300km" for specific calculations
2. Ask "Manila to Baguio analysis" for route details
3. Type "help" to see all available commands

Would you like me to calculate something specific or show you a detailed report?`;
      }
      
      setMessages(prev => [...prev, { type: 'ai', text: response }]);
    }, 1000);
    
    setInputMessage('');
  };

  const quickActions = [
    { label: 'Calculate Fuel Cost', action: 'Calculate fuel cost for 350km journey' },
    { label: 'Manila-Baguio Route', action: 'Show Manila to Baguio fuel analysis' },
    { label: 'Sales Report', action: 'Show today\'s sales report' },
    { label: 'Fleet Status', action: 'Show bus status' },
    { label: 'Driver Performance', action: 'Show driver performance report' }
  ];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)', gap: '24px' }}>
      {/* Main Chat Interface */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          padding: '20px 24px',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>AI Business Assistant</h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
              Fuel calculations, fleet management, and business insights
            </p>
          </div>
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            {showLegend ? 'Hide' : 'Show'} Guide
          </button>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          background: '#f5f5f7'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: msg.type === 'user' 
                  ? 'linear-gradient(135deg, #0071e3 0%, #0051a2 100%)' 
                  : 'white',
                color: msg.type === 'user' ? 'white' : '#1d1d1f',
                boxShadow: msg.type === 'ai' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div style={{
          padding: '12px 24px',
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(action.action);
                setTimeout(() => handleSendMessage(), 100);
              }}
              style={{
                padding: '6px 12px',
                background: '#f5f5f7',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.target.style.background = '#e8e8ed'}
              onMouseLeave={e => e.target.style.background = '#f5f5f7'}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '16px 24px',
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about fuel costs, routes, sales, or fleet status..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.08)',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* Legend/Guide Panel */}
      {showLegend && (
        <div className="card" style={{ width: '380px', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>
            🎓 AI Assistant User Guide
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#8b5cf6', marginBottom: '12px' }}>⛽ Fuel Cost Calculations</h4>
            <div style={{ 
              background: '#f5f5f7', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <p><strong>How to use:</strong></p>
              <p>• "Calculate fuel cost for 300km"</p>
              <p>• "Manila to Baguio fuel cost"</p>
              <p>• "Fuel consumption analysis"</p>
              <p style={{ marginTop: '8px', color: '#86868b' }}>
                <em>Calculates based on current diesel prices (₱65.50/L) and bus efficiency (4.2 km/L)</em>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#0071e3', marginBottom: '12px' }}>📊 Sales & Revenue</h4>
            <div style={{ 
              background: '#f5f5f7', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <p><strong>Commands:</strong></p>
              <p>• "Show sales report"</p>
              <p>• "Today's revenue"</p>
              <p>• "Weekly performance"</p>
              <p style={{ marginTop: '8px', color: '#86868b' }}>
                <em>Provides real-time sales data, trends, and profitability analysis</em>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#34c759', marginBottom: '12px' }}>🚌 Fleet Management</h4>
            <div style={{ 
              background: '#f5f5f7', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <p><strong>Track your fleet:</strong></p>
              <p>• "Show bus status"</p>
              <p>• "Where is ABC-001?"</p>
              <p>• "Maintenance schedule"</p>
              <p style={{ marginTop: '8px', color: '#86868b' }}>
                <em>Monitor bus locations, fuel levels, and maintenance needs</em>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#ff9500', marginBottom: '12px' }}>👨‍✈️ Driver Analytics</h4>
            <div style={{ 
              background: '#f5f5f7', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              <p><strong>Performance metrics:</strong></p>
              <p>• "Driver performance"</p>
              <p>• "Fuel efficiency by driver"</p>
              <p>• "Safety scores"</p>
              <p style={{ marginTop: '8px', color: '#86868b' }}>
                <em>Analyze driver behavior, efficiency, and safety records</em>
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '24px'
          }}>
            <h4 style={{ marginBottom: '8px' }}>💡 Pro Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', lineHeight: '1.8' }}>
              <li>Include specific numbers for accurate calculations</li>
              <li>Mention bus IDs for individual tracking</li>
              <li>Ask follow-up questions for detailed analysis</li>
              <li>Use route names for location-specific data</li>
            </ul>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#fff3cd',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <strong>🔔 Note:</strong> This is a demo version with simulated data. In production, the AI Assistant connects to real-time fleet management systems.
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;