import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { Tooltip, Spin, Empty, Typography, Avatar, Tag } from 'antd';
import { GlobalOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

// CLEANER, HIGH-RESOLUTION MAP URL (Better than the previous one)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// EXACT GEOGRAPHIC COORDINATES FOR EACH COUNTRY (Used to place Clients accurately)
const countryCoordinates = {
  "United States": [-95.7129, 37.0902], "United Kingdom": [-3.4359, 55.3781],
  "Canada": [-106.3468, 56.1304], "Australia": [133.7751, -25.2744],
  "Germany": [10.4515, 51.1657], "France": [2.2137, 46.2276],
  "Italy": [12.5674, 41.8719], "Spain": [-3.7492, 40.4637],
  "Portugal": [-8.2245, 39.3999], "Netherlands": [5.2913, 52.1326],
  "Belgium": [4.4699, 50.5039], "Switzerland": [8.2275, 46.8182],
  "Austria": [14.5501, 47.5162], "Sweden": [18.6435, 60.1282],
  "Norway": [8.4689, 60.4720], "Denmark": [9.5018, 56.2639],
  "Finland": [25.7482, 61.9241], "Ireland": [-8.2439, 53.4129],
  "Poland": [19.1451, 51.9194], "Czech Republic": [15.4730, 49.8175],
  "Hungary": [19.5033, 47.1625], "Greece": [21.8243, 39.0742],
  "Turkey": [35.2433, 38.9637], "Israel": [34.8516, 31.0461],
  "United Arab Emirates": [53.8478, 23.4241], "Saudi Arabia": [45.0792, 23.8859],
  "India": [78.9629, 20.5937], "China": [104.1954, 35.8617],
  "Japan": [138.2529, 36.2048], "South Korea": [127.7669, 35.9078],
  "Singapore": [103.8198, 1.3521], "Malaysia": [101.9758, 4.2105],
  "Indonesia": [113.9213, -0.7893], "Philippines": [121.7740, 12.8797],
  "New Zealand": [174.8860, -40.9006], "South Africa": [22.9375, -30.5595],
  "Egypt": [30.8025, 26.8206], "Nigeria": [8.6753, 9.0820],
  "Kenya": [37.9062, -1.2921], "Brazil": [-51.9253, -14.2350],
  "Argentina": [-63.6167, -38.4161], "Chile": [-71.5430, -35.6751],
  "Colombia": [-74.2973, 4.5709], "Mexico": [-102.5528, 23.6345],
  "Russia": [105.3188, 61.5240], "Pakistan": [69.3451, 30.3753],
  "Bangladesh": [90.3563, 23.6850], "Vietnam": [108.2772, 14.0583],
  "Thailand": [100.9925, 15.8700], "Taiwan": [120.9605, 23.6978],
  "Hong Kong": [114.1694, 22.3193], "Lebanon": [35.8623, 33.8547],
  "Jordan": [36.2384, 30.5852], "Kuwait": [47.4818, 29.3117],
  "Qatar": [51.1839, 25.3548], "Bahrain": [50.5860, 26.2285],
  "Oman": [57.5504, 21.5126], "Yemen": [48.5164, 15.5527],
  "Iraq": [43.6793, 33.2232], "Iran": [53.6880, 32.4279],
  "Syria": [38.9968, 34.8021], "Palestine": [35.2332, 31.9522],
  "Cyprus": [33.4299, 35.1264], "Ukraine": [31.1656, 48.3794],
  "Romania": [24.9668, 45.9432], "Bulgaria": [25.4858, 42.7339],
  "Croatia": [15.2000, 45.1000], "Serbia": [21.0000, 44.0000],
};

// Helper to get coordinate with fuzzy matching
const getCoordinates = (countryName) => {
  if (!countryName) return null;
  if (countryCoordinates[countryName]) return countryCoordinates[countryName];
  
  const key = Object.keys(countryCoordinates).find(k => 
    k.toLowerCase().includes(countryName.toLowerCase()) || 
    countryName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? countryCoordinates[key] : null;
};

const WorldMap = ({ users = [] }) => {
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  
  // Theme
  const accentColor = "#6c5ce7";
  const secondaryText = "rgba(255,255,255,0.7)";

  // Process Data: Group by Country, but keep individual user details
  const processedData = useMemo(() => {
    if (!users.length) return { countries: [], totalUsers: 0 };

    const countryMap = {};
    users.forEach(user => {
      const country = user.nationality || user.countrycode || 'Unknown';
      if (!countryMap[country]) {
        countryMap[country] = {
          country,
          users: [],
          center: getCoordinates(country)
        };
      }
      countryMap[country].users.push(user);
    });

    return { 
      countries: Object.values(countryMap), 
      totalUsers: users.length 
    };
  }, [users]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column', gap: 12 }}>
        <GlobalOutlined style={{ fontSize: 48, color: secondaryText }} />
        <Text style={{ color: secondaryText }}>No client location data available</Text>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', background: '#0d0d1a', borderRadius: 16, padding: 20 }}>
      
      {/* Clearer Map Render */}
      <div style={{ height: 400, width: '100%', position: 'relative' }}>
        <ComposableMap
          projection="geoEqualEarth" // Better for visualizing global distances clearly
          projectionConfig={{ scale: 180 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={[0, 10]} zoom={1.2}> {/* Zoomed in slightly for clarity */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHovered = hoveredCountry === geo.id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(geo.id)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: { fill: '#1a1a2e', stroke: '#34344a', strokeWidth: 0.5, outline: 'none', transition: 'all 0.2s' },
                        hover: { fill: '#2a2a4e', stroke: '#6c5ce7', strokeWidth: 1.5, outline: 'none', cursor: 'pointer' },
                        pressed: { fill: '#3a3a6e', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* MAP INDIVIDUAL CLIENTS TO THEIR EXACT COUNTRY */}
            {processedData.countries.map((countryGroup) => {
              if (!countryGroup.center) return null;
              
              // Spread clients slightly around the center so they don't all pile up perfectly on top of each other
              return countryGroup.users.map((user, index) => {
                // Add small random offset so multiple users in same country are visible
                const offsetX = (Math.random() - 0.5) * 3; 
                const offsetY = (Math.random() - 0.5) * 3;
                
                return (
                  <Marker 
                    key={user.id || `${countryGroup.country}-${index}`} 
                    coordinates={[countryGroup.center[0] + offsetX, countryGroup.center[1] + offsetY]}
                  >
                    <g>
                      <Tooltip title={`${user.username || 'Client'} (${countryGroup.country})`}>
                        <g>
                          {/* Avatar circle */}
                          <circle r={6} fill={accentColor} stroke="#fff" strokeWidth={1.5} />
                          
                          {/* Client Username Label (Clear, placed above the dot) */}
                          <text
                            x={0}
                            y={-12}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={9}
                            fontWeight="bold"
                            style={{ 
                              pointerEvents: 'none', 
                              textShadow: '0px 1px 4px rgba(0,0,0,0.8)' // Ensures text is always readable
                            }}
                          >
                            {user.username || 'User'}
                          </text>
                        </g>
                      </Tooltip>
                    </g>
                  </Marker>
                );
              });
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center', color: secondaryText, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: accentColor }} />
          <span>Client Location</span>
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <TeamOutlined style={{ marginRight: 4 }} /> {processedData.totalUsers} Clients Mapped
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WorldMap;