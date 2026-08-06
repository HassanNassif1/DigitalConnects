import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line } from 'react-simple-maps';
import { Tooltip, Spin, Typography } from 'antd';
import { GlobalOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

// MAP URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// === EXTENDED COUNTRY COORDINATES (Matching your Backend data) ===
const countryDatabase = {
  // North America
  "United States": [-95.7129, 37.0902], "USA": [-95.7129, 37.0902], "US": [-95.7129, 37.0902],
  "Canada": [-106.3468, 56.1304], "CA": [-106.3468, 56.1304],
  "Mexico": [-102.5528, 23.6345], "MX": [-102.5528, 23.6345],
  "Greenland": [-42.6043, 71.7069], "GL": [-42.6043, 71.7069],
  
  // Central America & Caribbean
  "Guatemala": [-90.2308, 15.7835], "GT": [-90.2308, 15.7835],
  "Belize": [-88.4977, 17.1899], "BZ": [-88.4977, 17.1899],
  "Honduras": [-86.2419, 14.0650], "HN": [-86.2419, 14.0650],
  "El Salvador": [-88.8965, 13.7942], "SV": [-88.8965, 13.7942],
  "Nicaragua": [-85.2072, 12.8654], "NI": [-85.2072, 12.8654],
  "Costa Rica": [-83.7534, 9.7489], "CR": [-83.7534, 9.7489],
  "Panama": [-80.7821, 8.5380], "PA": [-80.7821, 8.5380],
  "Cuba": [-77.7812, 21.5218], "CU": [-77.7812, 21.5218],
  "Jamaica": [-77.2975, 18.1096], "JM": [-77.2975, 18.1096],
  "Dominican Republic": [-70.1627, 18.7357], "DO": [-70.1627, 18.7357],
  "Puerto Rico": [-66.5907, 18.2208], "PR": [-66.5907, 18.2208],
  "Trinidad and Tobago": [-61.2225, 10.6918], "TT": [-61.2225, 10.6918],
  
  // South America
  "Brazil": [-51.9253, -14.2350], "BR": [-51.9253, -14.2350],
  "Argentina": [-63.6167, -38.4161], "AR": [-63.6167, -38.4161],
  "Chile": [-71.5430, -35.6751], "CL": [-71.5430, -35.6751],
  "Colombia": [-74.2973, 4.5709], "CO": [-74.2973, 4.5709],
  "Peru": [-76.5320, -9.1900], "PE": [-76.5320, -9.1900],
  "Venezuela": [-66.5897, 6.4238], "VE": [-66.5897, 6.4238],
  "Ecuador": [-78.1834, -1.8312], "EC": [-78.1834, -1.8312],
  "Bolivia": [-63.5887, -16.2902], "BO": [-63.5887, -16.2902],
  "Paraguay": [-58.4438, -23.4425], "PY": [-58.4438, -23.4425],
  "Uruguay": [-55.7658, -32.5228], "UY": [-55.7658, -32.5228],
  "Guyana": [-58.9308, 4.8604], "GY": [-58.9308, 4.8604],
  "Suriname": [-56.0278, 3.9193], "SR": [-56.0278, 3.9193],
  
  // Europe
  "United Kingdom": [-3.4359, 55.3781], "UK": [-3.4359, 55.3781], "GB": [-3.4359, 55.3781],
  "Germany": [10.4515, 51.1657], "DE": [10.4515, 51.1657],
  "France": [2.2137, 46.2276], "FR": [2.2137, 46.2276],
  "Italy": [12.5674, 41.8719], "IT": [12.5674, 41.8719],
  "Spain": [-3.7492, 40.4637], "ES": [-3.7492, 40.4637],
  "Portugal": [-8.2245, 39.3999], "PT": [-8.2245, 39.3999],
  "Netherlands": [5.2913, 52.1326], "NL": [5.2913, 52.1326],
  "Belgium": [4.4699, 50.5039], "BE": [4.4699, 50.5039],
  "Switzerland": [8.2275, 46.8182], "CH": [8.2275, 46.8182],
  "Austria": [14.5501, 47.5162], "AT": [14.5501, 47.5162],
  "Sweden": [18.6435, 60.1282], "SE": [18.6435, 60.1282],
  "Norway": [8.4689, 60.4720], "NO": [8.4689, 60.4720],
  "Denmark": [9.5018, 56.2639], "DK": [9.5018, 56.2639],
  "Finland": [25.7482, 61.9241], "FI": [25.7482, 61.9241],
  "Ireland": [-8.2439, 53.4129], "IE": [-8.2439, 53.4129],
  "Poland": [19.1451, 51.9194], "PL": [19.1451, 51.9194],
  "Ukraine": [31.1656, 48.3794], "UA": [31.1656, 48.3794],
  "Romania": [24.9668, 45.9432], "RO": [24.9668, 45.9432],
  "Greece": [21.8243, 39.0742], "GR": [21.8243, 39.0742],
  "Turkey": [35.2433, 38.9637], "TR": [35.2433, 38.9637],
  "Czech Republic": [14.4378, 49.8175], "CZ": [14.4378, 49.8175],
  "Hungary": [19.5033, 47.1625], "HU": [19.5033, 47.1625],
  "Slovakia": [19.6990, 48.6690], "SK": [19.6990, 48.6690],
  "Croatia": [15.2000, 45.1000], "HR": [15.2000, 45.1000],
  "Serbia": [20.9028, 44.0165], "RS": [20.9028, 44.0165],
  "Bulgaria": [25.4858, 42.7339], "BG": [25.4858, 42.7339],
  "Iceland": [-19.0208, 64.9631], "IS": [-19.0208, 64.9631],
  "Luxembourg": [6.1296, 49.8153], "LU": [6.1296, 49.8153],
  "Malta": [14.3754, 35.9375], "MT": [14.3754, 35.9375],
  "Cyprus": [33.4299, 35.1264], "CY": [33.4299, 35.1264],
  
  // Russia & Central Asia
  "Russia": [105.3188, 61.5240], "RU": [105.3188, 61.5240],
  "Kazakhstan": [66.9237, 48.0196], "KZ": [66.9237, 48.0196],
  "Uzbekistan": [64.5853, 41.3775], "UZ": [64.5853, 41.3775],
  "Turkmenistan": [59.5563, 38.9697], "TM": [59.5563, 38.9697],
  "Kyrgyzstan": [74.7661, 41.2044], "KG": [74.7661, 41.2044],
  "Tajikistan": [71.2763, 38.8610], "TJ": [71.2763, 38.8610],
  
  // Middle East
  "UAE": [53.8478, 23.4241], "AE": [53.8478, 23.4241],
  "Saudi Arabia": [45.0792, 23.8859], "SA": [45.0792, 23.8859],
  "Iran": [53.6880, 32.4279], "IR": [53.6880, 32.4279],
  "Iraq": [43.6793, 33.2232], "IQ": [43.6793, 33.2232],
  "Syria": [38.9968, 34.8021], "SY": [38.9968, 34.8021],
  "Jordan": [36.2384, 30.5852], "JO": [36.2384, 30.5852],
  "Lebanon": [35.8623, 33.8547], "LB": [35.8623, 33.8547],
  "Israel": [34.8516, 31.0461], "IL": [34.8516, 31.0461],
  "Palestine": [35.2332, 31.9522], "PS": [35.2332, 31.9522],
  "Kuwait": [45.3483, 29.3759], "KW": [45.3483, 29.3759],
  "Oman": [55.2962, 21.5126], "OM": [55.2962, 21.5126],
  "Yemen": [48.5164, 15.5527], "YE": [48.5164, 15.5527],
  "Qatar": [51.1839, 25.3548], "QA": [51.1839, 25.3548],
  "Bahrain": [50.5375, 26.0667], "BH": [50.5375, 26.0667],
  
  // Africa
  "Egypt": [30.8025, 26.8206], "EG": [30.8025, 26.8206],
  "South Africa": [22.9375, -30.5595], "ZA": [22.9375, -30.5595],
  "Nigeria": [8.6753, 9.0820], "NG": [8.6753, 9.0820],
  "Kenya": [37.9062, -1.2921], "KE": [37.9062, -1.2921],
  "Morocco": [-7.0926, 31.7917], "MA": [-7.0926, 31.7917],
  "Algeria": [1.6596, 28.0339], "DZ": [1.6596, 28.0339],
  "Tunisia": [9.5375, 33.8869], "TN": [9.5375, 33.8869],
  "Libya": [17.2282, 26.3351], "LY": [17.2282, 26.3351],
  "Sudan": [30.2176, 12.8628], "SD": [30.2176, 12.8628],
  "Ethiopia": [40.4897, 9.1450], "ET": [40.4897, 9.1450],
  "Somalia": [46.1996, 5.1521], "SO": [46.1996, 5.1521],
  "Ghana": [-1.0232, 7.9465], "GH": [-1.0232, 7.9465],
  "Ivory Coast": [-5.5471, 7.5399], "CI": [-5.5471, 7.5399],
  "Cameroon": [12.3547, 3.8480], "CM": [12.3547, 3.8480],
  "Angola": [17.8739, -11.2027], "AO": [17.8739, -11.2027],
  "Mozambique": [35.5296, -18.6657], "MZ": [35.5296, -18.6657],
  "Zimbabwe": [29.1549, -19.0154], "ZW": [29.1549, -19.0154],
  "Zambia": [27.8493, -13.1339], "ZM": [27.8493, -13.1339],
  "Uganda": [32.2903, 1.3733], "UG": [32.2903, 1.3733],
  "Tanzania": [34.8888, -6.3690], "TZ": [34.8888, -6.3690],
  "Senegal": [-14.4524, 14.4974], "SN": [-14.4524, 14.4974],
  "Mali": [-3.9962, 17.5707], "ML": [-3.9962, 17.5707],
  "Niger": [9.1552, 13.5127], "NE": [9.1552, 13.5127],
  "Burkina Faso": [-1.5135, 12.2383], "BF": [-1.5135, 12.2383],
  "Benin": [2.3158, 9.3077], "BJ": [2.3158, 9.3077],
  "Togo": [1.0181, 8.6195], "TG": [1.0181, 8.6195],
  "Sierra Leone": [-11.7799, 8.4606], "SL": [-11.7799, 8.4606],
  "Liberia": [-9.4295, 6.4281], "LR": [-9.4295, 6.4281],
  
  // Asia
  "China": [104.1954, 35.8617], "CN": [104.1954, 35.8617],
  "India": [78.9629, 20.5937], "IN": [78.9629, 20.5937],
  "Japan": [138.2529, 36.2048], "JP": [138.2529, 36.2048],
  "South Korea": [127.7669, 35.9078], "KR": [127.7669, 35.9078],
  "Pakistan": [69.3451, 30.3753], "PK": [69.3451, 30.3753],
  "Malaysia": [101.9758, 4.2105], "MY": [101.9758, 4.2105],
  "Singapore": [103.8198, 1.3521], "SG": [103.8198, 1.3521],
  "Philippines": [121.7740, 12.8797], "PH": [121.7740, 12.8797],
  "Thailand": [100.9925, 15.8700], "TH": [100.9925, 15.8700],
  "Vietnam": [108.2772, 14.0583], "VN": [108.2772, 14.0583],
  "Indonesia": [113.9213, -0.7893], "ID": [113.9213, -0.7893],
  "Bangladesh": [90.3563, 23.6850], "BD": [90.3563, 23.6850],
  "Myanmar": [95.9562, 21.9162], "MM": [95.9562, 21.9162],
  "Sri Lanka": [80.7718, 7.8731], "LK": [80.7718, 7.8731],
  "Nepal": [84.1240, 28.3949], "NP": [84.1240, 28.3949],
  "Afghanistan": [67.7100, 33.9391], "AF": [67.7100, 33.9391],
  "Mongolia": [103.8467, 46.8625], "MN": [103.8467, 46.8625],
  "North Korea": [127.5101, 40.3399], "KP": [127.5101, 40.3399],
  "Taiwan": [120.9605, 23.6978], "TW": [120.9605, 23.6978],
  "Cambodia": [104.9900, 12.5657], "KH": [104.9900, 12.5657],
  "Laos": [102.4955, 19.8563], "LA": [102.4955, 19.8563],
  
  // Oceania
  "Australia": [133.7751, -25.2744], "AU": [133.7751, -25.2744],
  "New Zealand": [174.8860, -40.9006], "NZ": [174.8860, -40.9006],
  "Papua New Guinea": [147.1803, -6.3149], "PG": [147.1803, -6.3149],
  "Fiji": [178.0650, -17.7134], "FJ": [178.0650, -17.7134],
  "Solomon Islands": [160.1562, -9.6457], "SB": [160.1562, -9.6457],
  
  // Small Island Nations
  "Madagascar": [46.8691, -18.7669], "MG": [46.8691, -18.7669],
  "Mauritius": [57.5522, -20.3484], "MU": [57.5522, -20.3484],
  "Seychelles": [55.4919, -4.6796], "SC": [55.4919, -4.6796],
  "Maldives": [73.2207, 3.2028], "MV": [73.2207, 3.2028],
  "Bahamas": [-77.3963, 25.0343], "BS": [-77.3963, 25.0343],
  "Barbados": [-59.5432, 13.1939], "BB": [-59.5432, 13.1939],
  "Fiji": [178.0650, -17.7134], "FJ": [178.0650, -17.7134],
  "Samoa": [-172.1046, -13.7590], "WS": [-172.1046, -13.7590],
  "Tonga": [-175.1982, -21.1790], "TO": [-175.1982, -21.1790],
  
  // Baltic States
  "Estonia": [25.0136, 58.5953], "EE": [25.0136, 58.5953],
  "Latvia": [24.6032, 56.8796], "LV": [24.6032, 56.8796],
  "Lithuania": [23.8813, 55.1694], "LT": [23.8813, 55.1694],
  
  // Caucasus
  "Georgia": [43.3569, 42.3154], "GE": [43.3569, 42.3154],
  "Armenia": [44.5630, 40.0691], "AM": [44.5630, 40.0691],
  "Azerbaijan": [47.5769, 40.1431], "AZ": [47.5769, 40.1431],
  
  // Antarctica
  "Antarctica": [0, -82.8628], "AQ": [0, -82.8628]
};

const getCountryCoords = (searchKey) => {
  if (!searchKey) return null;
  const key = Object.keys(countryDatabase).find(k => 
    k.toLowerCase() === searchKey.toLowerCase() || searchKey.toLowerCase().includes(k.toLowerCase())
  );
  return key ? countryDatabase[key] : null;
};

const WorldMap = () => {
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // 1. Fetch data from the new API
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users-by-nationality');
        const data = res.data;
        
        // Format data, filter out null nationalities, and find coords
        const formatted = data
          .filter(item => item.nationality)
          .map(item => {
            const coords = getCountryCoords(item.nationality);
            return {
              nationality: item.nationality,
              count: parseInt(item.count, 10),
              coords: coords
            };
          })
          .filter(item => item.coords !== null); // Only show countries we have coordinates for

        setCountryData(formatted);
        setTotalUsers(formatted.reduce((acc, curr) => acc + curr.count, 0));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch nationalities", err);
        setLoading(false);
      }
    };
    fetchNationalities();
  }, []);

  // 2. Generate Dynamic Network Connections (Lines between countries)
  const networkLines = useMemo(() => {
    if (countryData.length < 2) return [];
    const lines = [];
    
    // Create a mesh network by connecting the first country to everyone else
    const firstCountry = countryData[0];
    
    for (let i = 1; i < countryData.length; i++) {
      // Line from First Country to All Others
      if (firstCountry.coords && countryData[i].coords) {
        lines.push({
          from: firstCountry.coords,
          to: countryData[i].coords,
          key: `line-${i}`
        });
      }
      
      // Random cross-connections to create the "web" look
      if (i < countryData.length - 1 && Math.random() > 0.6) {
        if (countryData[i].coords && countryData[i+1].coords) {
           lines.push({
            from: countryData[i].coords,
            to: countryData[i+1].coords,
            key: `cross-${i}`
          });
        }
      }
    }
    return lines;
  }, [countryData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 250 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!countryData.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 250, flexDirection: 'column', gap: 12 }}>
        <GlobalOutlined style={{ fontSize: 40, color: 'rgba(255,255,255,0.4)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>No client location data available</Text>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', borderRadius: 16 }}>
      
      <div style={{ height: '100%', minHeight: 220, width: '100%', position: 'relative' }}>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 160 }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* 1. BG GRADIENT (Cyan to Blue like the image) */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E56CF" stopOpacity={0.9} /> {/* Purple */}
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.95} /> {/* Deep Blue */}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ZoomableGroup center={[0, 10]} zoom={1.1}>
            
            {/* 2. CONTINENTS WITH GRADIENT */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { 
                        fill: 'url(#mapGradient)', 
                        stroke: 'rgba(255,255,255,0.1)', 
                        strokeWidth: 0.5, 
                        outline: 'none', 
                        transition: 'all 0.3s ease' 
                      },
                      hover: { 
                        fill: '#ffffff', 
                        stroke: '#a855f7', 
                        strokeWidth: 1.5, 
                        outline: 'none', 
                        cursor: 'pointer' 
                      },
                      pressed: { fill: '#a855f7', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* 3. WHITE NETWORK LINES */}
            {networkLines.map((line) => (
              <Line
                key={line.key}
                from={line.from}
                to={line.to}
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeOpacity={0.3}
                fill="none"
              />
            ))}

            {/* 4. WHITE CIRCLE USER MARKERS */}
            {countryData.map((country) => {
              const [x, y] = country.coords;
              return (
                <Tooltip title={`${country.nationality}: ${country.count} Clients`} color="#1e1e36" key={country.nationality}>
                  <Marker coordinates={[x, y]}>
                    <g>
                      {/* Outer Glowing Halo */}
                      <circle r={16} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth={1}>
                        <animate attributeName="r" from="14" to="20" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Solid White Circle */}
                      <circle r={10} fill="#ffffff" filter="url(#glow)" />
                      
                      {/* User Icon inside the circle */}
                      <UserOutlined style={{ 
                        fontSize: 12, 
                        color: '#1a1a3a', 
                        position: 'absolute', 
                        transform: 'translate(-6px, -6px)' 
                      }} />
                      
                      {/* Tooltip Label (Showing Count) */}
                      <text
                        x={0}
                        y={-20}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={9}
                        fontWeight={600}
                        style={{ 
                          pointerEvents: 'none', 
                          textShadow: '0px 1px 6px rgba(0,0,0,0.9)'
                        }}
                      >
                        {country.count}
                      </text>
                    </g>
                  </Marker>
                </Tooltip>
              );
            })}
            
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* LEGEND */}
      <div style={{ 
        position: 'absolute', 
        bottom: 10, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 16, 
        alignItems: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 10,
        background: 'rgba(13,13,26,0.8)',
        padding: '4px 12px',
        borderRadius: 20,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />
          <span>Client Hubs</span>
        </div>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
        <TeamOutlined style={{ marginRight: 4 }} /> {totalUsers} Active Users
      </div>
    </div>
  );
};

export default WorldMap;