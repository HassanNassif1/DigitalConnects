import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Cell, PieChart, Pie, LineChart, Line, BarChart, Bar,
  RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis,
  ComposedChart, Legend, FunnelChart, Funnel
} from 'recharts';
import CountUp from 'react-countup';
import './Dashboard.css';
import WorldMap from './WorldMap';
import {
  UserOutlined, FileTextOutlined, DollarOutlined, RiseOutlined, 
  FallOutlined, BarChartOutlined, PieChartOutlined, GlobalOutlined, 
  TeamOutlined, ReloadOutlined, TrophyOutlined, StarOutlined, 
  FlagOutlined, DashboardOutlined, WalletOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ThunderboltOutlined, SafetyOutlined, CreditCardOutlined,
  FireOutlined, RocketOutlined, CrownOutlined, GiftOutlined,
  RadarChartOutlined, DotChartOutlined, FundOutlined, LineChartOutlined,
  BellOutlined, EnvironmentOutlined, PushpinOutlined, NodeIndexOutlined,
  DeleteOutlined, EditOutlined, PlusOutlined, MoreOutlined,
  SyncOutlined, AuditOutlined, UndoOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Divider, Tag, Badge, Space, Button, Spin, Avatar, Progress, Statistic, Table, Popconfirm, Dropdown, Tabs, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line as MapLine } from 'react-simple-maps';

const { Title, Text } = Typography;

// === CONSTANTS ===
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// === SMART COUNTRY DETECTION FOR MAP ===
const countryDatabase = {
  "US": { name: "United States", coords: [-95.7129, 37.0902] },
  "USA": { name: "United States", coords: [-95.7129, 37.0902] },
  "United States": { name: "United States", coords: [-95.7129, 37.0902] },
  "GB": { name: "United Kingdom", coords: [-3.4359, 55.3781] },
  "UK": { name: "United Kingdom", coords: [-3.4359, 55.3781] },
  "United Kingdom": { name: "United Kingdom", coords: [-3.4359, 55.3781] },
  "CA": { name: "Canada", coords: [-106.3468, 56.1304] },
  "Canada": { name: "Canada", coords: [-106.3468, 56.1304] },
  "AU": { name: "Australia", coords: [133.7751, -25.2744] },
  "Australia": { name: "Australia", coords: [133.7751, -25.2744] },
  "DE": { name: "Germany", coords: [10.4515, 51.1657] },
  "Germany": { name: "Germany", coords: [10.4515, 51.1657] },
  "FR": { name: "France", coords: [2.2137, 46.2276] },
  "France": { name: "France", coords: [2.2137, 46.2276] },
  "IN": { name: "India", coords: [78.9629, 20.5937] },
  "India": { name: "India", coords: [78.9629, 20.5937] },
  "AE": { name: "UAE", coords: [53.8478, 23.4241] },
  "UAE": { name: "UAE", coords: [53.8478, 23.4241] },
  "United Arab Emirates": { name: "UAE", coords: [53.8478, 23.4241] },
  "CN": { name: "China", coords: [104.1954, 35.8617] },
  "China": { name: "China", coords: [104.1954, 35.8617] },
  "JP": { name: "Japan", coords: [138.2529, 36.2048] },
  "Japan": { name: "Japan", coords: [138.2529, 36.2048] },
  "BR": { name: "Brazil", coords: [-51.9253, -14.2350] },
  "Brazil": { name: "Brazil", coords: [-51.9253, -14.2350] },
  "RU": { name: "Russia", coords: [105.3188, 61.5240] },
  "Russia": { name: "Russia", coords: [105.3188, 61.5240] },
  "ZA": { name: "South Africa", coords: [22.9375, -30.5595] },
  "South Africa": { name: "South Africa", coords: [22.9375, -30.5595] },
  "NG": { name: "Nigeria", coords: [8.6753, 9.0820] },
  "Nigeria": { name: "Nigeria", coords: [8.6753, 9.0820] },
  "EG": { name: "Egypt", coords: [30.8025, 26.8206] },
  "Egypt": { name: "Egypt", coords: [30.8025, 26.8206] },
  "MX": { name: "Mexico", coords: [-102.5528, 23.6345] },
  "Mexico": { name: "Mexico", coords: [-102.5528, 23.6345] },
};

const getCountryData = (searchKey) => {
  if (!searchKey) return null;
  const key = Object.keys(countryDatabase).find(k => 
    k.toLowerCase() === searchKey.toLowerCase() || searchKey.toLowerCase().includes(k.toLowerCase())
  );
  return key ? countryDatabase[key] : null;
};

// === MEMOIZED CARD WRAPPER ===
const CardWrapper = memo(({ children, colorScheme, id, isHovered, onMouseEnter, onMouseLeave, style = {} }) => {
  const isActive = isHovered === id;
  
  return (
    <div 
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
      style={{
        borderRadius: 24,
        padding: 24,
        border: `1px solid ${colorScheme.border}`,
        background: colorScheme.bg,
        boxShadow: isActive ? `0 8px 40px ${colorScheme.accent}33, inset 0 1px 0 ${colorScheme.accent}44` : `0 4px 20px rgba(0,0,0,0.3)`,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isActive ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${colorScheme.accent}22, transparent)`,
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
      )}
      {children}
    </div>
  );
});

// === MEMOIZED STAT CARD ===
const StatCard = memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <div style={{
      background: stat.scheme.bg,
      borderRadius: 16,
      padding: '14px 16px',
      border: `1px solid ${stat.scheme.border}`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${stat.scheme.accent}, ${stat.scheme.accent}44, ${stat.scheme.accent})`,
        animation: 'waveFlow 3s infinite linear',
        opacity: 0.5
      }} />
      <Icon style={{ fontSize: 18, color: stat.scheme.accent, marginBottom: 4 }} />
      <div style={{ fontSize: 20, fontWeight: 700, color: stat.scheme.light }}>
        {stat.prefix && stat.prefix}<CountUp end={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} />
        {stat.suffix && stat.suffix}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{stat.label}</div>
      {stat.showProgress && (
        <Progress 
          percent={Math.min(stat.value, 100)} 
          strokeColor={stat.value > 20 ? '#22c55e' : stat.value > 10 ? '#eab308' : '#ef4444'}
          showInfo={false}
          size="small"
          style={{ marginTop: 4 }}
        />
      )}
    </div>
  );
});

// === COLORFUL TASK PROGRESS PIE CHART ===
const ColorfulTaskPieChart = memo(({ taskStatus }) => {
  const taskData = [
    { name: 'Completed', value: taskStatus.completed || 0, color: '#22c55e', icon: '✅' },
    { name: 'In Progress', value: taskStatus.inProgress || 0, color: '#f59e0b', icon: '🔄' },
    { name: 'Pending', value: taskStatus.pending || 0, color: '#ef4444', icon: '⏳' },
    { name: 'Review', value: Math.max(0, 100 - (taskStatus.completed + taskStatus.inProgress + taskStatus.pending)), color: '#a855f7', icon: '📋' }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
          <CheckCircleOutlined style={{ color: '#0ea5e9' }} /> Task Progress
        </Text>
        <Badge 
          count={`${Math.round(taskStatus.completed || 0)}% Complete`}
          style={{ 
            background: 'linear-gradient(135deg, #22c55e, #0ea5e9)',
            fontSize: 10,
            padding: '2px 10px',
            borderRadius: 12
          }} 
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{ width: '55%', height: '100%', minHeight: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                paddingAngle={4}
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={2}
                  >
                    <animate 
                      attributeName="opacity" 
                      values="0.3;1;0.3" 
                      dur={`${2 + index * 0.5}s`} 
                      repeatCount="indefinite" 
                    />
                  </Cell>
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {taskData.map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              padding: '4px 8px',
              borderRadius: 6,
              background: `${item.color}15`,
              border: `1px solid ${item.color}22`
            }}>
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: item.color,
                boxShadow: `0 0 20px ${item.color}44`,
                animation: `pulse 2s ${idx * 0.5}s infinite`
              }} />
              <Text style={{ color: '#fff', fontSize: 11, flex: 1 }}>{item.icon} {item.name}</Text>
              <Text style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>
                {item.value.toFixed(1)}%
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: 8, 
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
          {taskStatus.total || 0} Total Tasks
        </Text>
        <Text style={{ color: '#22c55e', fontSize: 10, fontWeight: 600 }}>
          {Math.round(taskStatus.completed || 0)}% Complete
        </Text>
      </div>
    </div>
  );
});

// === TASK MANAGEMENT TABLE COMPONENT ===



// === CREATIVE REVENUE WAVE ===
// === CREATIVE REVENUE WAVE ===
// === CREATIVE REVENUE WAVE ===
const CreativeRevenueWave = memo(({ accountingData }) => {
  // Process accounting data to get daily revenue and profit
  const chartData = useMemo(() => {
    const map = {};
    accountingData.forEach(item => {
      const d = item.plan_date ? new Date(item.plan_date) : new Date();
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const profit = (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)) || 0;
      const rev = parseFloat(item.amount || 0);
      const cost = parseFloat(item.price_on_me || 0);
      
      if (!map[key]) {
        map[key] = { 
          profit: 0, 
          revenue: 0, 
          cost: 0,
          date: key,
          fullDate: d
        };
      }
      map[key].profit += profit;
      map[key].revenue += rev;
      map[key].cost += cost;
    });
    
    // Sort by date and get last 15 days
    const sortedKeys = Object.keys(map).sort((a, b) => {
      return new Date(map[a].fullDate) - new Date(map[b].fullDate);
    });
    
    const last15Keys = sortedKeys.slice(-15);
    return last15Keys.map(k => ({
      date: k,
      revenue: Number(map[k].revenue.toFixed(2)),
      profit: Number(map[k].profit.toFixed(2)),
      cost: Number(map[k].cost.toFixed(2))
    }));
  }, [accountingData]);

  // Calculate totals
  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const totalProfit = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.profit, 0);
  }, [chartData]);

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>No revenue data available</Text>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Wave Background - Colorful */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '100%',
            minHeight: '100%'
          }}
        >
          <defs>
            <linearGradient id="waveColor1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4"/>
              <stop offset="50%" stopColor="#6c5ce7" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="waveColor2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35"/>
              <stop offset="50%" stopColor="#db2777" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#db2777" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="waveColor3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#d97706" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="waveColor4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
              <stop offset="50%" stopColor="#0891b2" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Wave 1 - Purple */}
          <path
            d="M0,100 C100,50 200,150 300,80 C400,10 500,120 600,60 C700,0 800,100 900,40 C1000,-20 1100,80 1200,30 L1200,200 L0,200 Z"
            fill="url(#waveColor1)"
            style={{
              animation: 'waveFloat1 8s ease-in-out infinite',
              transformOrigin: 'bottom'
            }}
          />
          
          {/* Wave 2 - Pink */}
          <path
            d="M0,130 C150,80 250,180 400,110 C550,40 650,140 800,70 C950,0 1050,120 1200,60 L1200,200 L0,200 Z"
            fill="url(#waveColor2)"
            style={{
              animation: 'waveFloat2 10s ease-in-out infinite',
              transformOrigin: 'bottom'
            }}
          />
          
          {/* Wave 3 - Yellow/Orange */}
          <path
            d="M0,160 C120,110 220,190 380,140 C540,90 640,170 800,120 C960,70 1060,150 1200,100 L1200,200 L0,200 Z"
            fill="url(#waveColor3)"
            style={{
              animation: 'waveFloat3 12s ease-in-out infinite',
              transformOrigin: 'bottom'
            }}
          />
          
          {/* Wave 4 - Cyan */}
          <path
            d="M0,70 C180,30 280,140 480,90 C680,40 780,130 980,80 C1180,30 1200,100 1200,100 L1200,200 L0,200 Z"
            fill="url(#waveColor4)"
            style={{
              animation: 'waveFloat4 15s ease-in-out infinite',
              transformOrigin: 'bottom'
            }}
          />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative', zIndex: 1 }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>🌊 Revenue Wave</Text>
        <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
          <span><span style={{ color: '#a855f7', fontWeight: 'bold' }}>●</span> Revenue</span>
          <span><span style={{ color: '#ec4899', fontWeight: 'bold' }}>●</span> Profit</span>
        </div>
      </div>
      
      <div style={{ flex: 1, minHeight: 160, position: 'relative', zIndex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="waveGradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="waveGradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6}/>
                <stop offset="50%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)" 
              tick={{fontSize: 9, fill: 'rgba(255,255,255,0.4)'}} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              tick={{fontSize: 9, fill: 'rgba(255,255,255,0.4)'}} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, '']}
            />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#waveGradRevenue)"
              animationDuration={2500}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#ec4899"
              strokeWidth={2}
              fill="url(#waveGradProfit)"
              animationDuration={3000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 6,
        padding: '6px 12px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Total Revenue</Text>
            <Text style={{ color: '#a855f7', fontSize: 12, fontWeight: 700, display: 'block' }}>
              ${totalRevenue.toFixed(0)}
            </Text>
          </div>
          <div>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>Total Profit</Text>
            <Text style={{ color: '#ec4899', fontSize: 12, fontWeight: 700, display: 'block' }}>
              ${totalProfit.toFixed(0)}
            </Text>
          </div>
        </div>
        <div>
          <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>
            ↑ {totalRevenue > 0 ? ((totalProfit/totalRevenue)*100).toFixed(1) : 0}% Margin
          </Text>
        </div>
      </div>

      {/* Wave Animations */}
      <style>{`
        @keyframes waveFloat1 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          25% { transform: translateX(-50px) scaleY(1.2); }
          50% { transform: translateX(50px) scaleY(0.8); }
          75% { transform: translateX(-30px) scaleY(1.1); }
        }
        @keyframes waveFloat2 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          30% { transform: translateX(60px) scaleY(1.3); }
          60% { transform: translateX(-40px) scaleY(0.7); }
          90% { transform: translateX(30px) scaleY(1.1); }
        }
        @keyframes waveFloat3 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          20% { transform: translateX(-70px) scaleY(1.4); }
          50% { transform: translateX(40px) scaleY(0.6); }
          80% { transform: translateX(-20px) scaleY(1.2); }
        }
        @keyframes waveFloat4 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          40% { transform: translateX(80px) scaleY(1.5); }
          70% { transform: translateX(-60px) scaleY(0.5); }
          90% { transform: translateX(40px) scaleY(1.3); }
        }
      `}</style>
    </div>
  );
});

// === MAIN DASHBOARD COMPONENT ===
function Dashboard() {
  const [accountingData, setAccountingData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const colorSchemes = {
    revenue: { bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)', accent: '#a855f7', light: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
    profit: { bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a4e1a 100%)', accent: '#22c55e', light: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
    expenses: { bg: 'linear-gradient(135deg, #1a0a0a 0%, #4e1a1a 100%)', accent: '#ef4444', light: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
    margin: { bg: 'linear-gradient(135deg, #1a1a0a 0%, #3d3d1a 100%)', accent: '#eab308', light: '#fde047', border: 'rgba(234, 179, 8, 0.3)' },
    clients: { bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a4e 100%)', accent: '#3b82f6', light: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
    tasks: { bg: 'linear-gradient(135deg, #0a1a1a 0%, #1a3d3d 100%)', accent: '#14b8a6', light: '#5eead4', border: 'rgba(20, 184, 166, 0.3)' },
    area: { bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)', accent: '#a855f7', light: '#c084fc', border: 'rgba(168, 85, 247, 0.2)' },
    radial: { bg: 'linear-gradient(135deg, #0a1a2e 0%, #1a3d6e 100%)', accent: '#0ea5e9', light: '#7dd3fc', border: 'rgba(14, 165, 233, 0.2)' },
    bar: { bg: 'linear-gradient(135deg, #1a0a1a 0%, #4e1a4e 100%)', accent: '#ec4899', light: '#f472b6', border: 'rgba(236, 72, 153, 0.2)' },
    map: { bg: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2a 100%)', accent: '#a855f7', light: '#c084fc', border: 'rgba(168, 85, 247, 0.2)' },
    composed: { bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a4e1a 100%)', accent: '#22c55e', light: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' },
    funnel: { bg: 'linear-gradient(135deg, #1a0a0a 0%, #4e1a1a 100%)', accent: '#ef4444', light: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
    invoices: { bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)', accent: '#8b5cf6', light: '#a78bfa', border: 'rgba(139, 92, 246, 0.2)' },
    performers: { bg: 'linear-gradient(135deg, #1a1a0a 0%, #3d3d1a 100%)', accent: '#f59e0b', light: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' },
    taskManagement: { bg: 'linear-gradient(135deg, #0a0a1a 0%, #14142b 100%)', accent: '#6c5ce7', light: '#8b7cf7', border: 'rgba(108, 92, 231, 0.2)' },
  };

  const textColor = "#ffffff";
  const secondaryText = "rgba(255,255,255,0.7)";

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        const [accRes, usersRes, tasksRes, topRes, expRes] = await Promise.all([
          axios.get('http://localhost:5000/api/AccountingData'),
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/viewtasks'),
          axios.get('http://localhost:5000/api/top-scorers'),
          axios.get('http://localhost:5000/api/getexpensesfiltered'),
        ]);
        if (!mounted) return;
        setAccountingData(Array.isArray(accRes.data) ? accRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setTopScorers(Array.isArray(topRes.data) ? topRes.data : []);
        setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      } catch (err) {
        console.error('Dashboard fetch error', err);
        if (mounted) {
          setAccountingData([]);
          setUsers([]);
          setTasks([]);
          setTopScorers([]);
          setExpenses([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  // Task management functions
  const updateTaskStatus = async (taskId, newStatus) => {
    if (!taskId || isNaN(taskId)) {
      message.error('Invalid task ID');
      return;
    }

    const previousTasks = [...tasks];
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const response = await axios.put(`http://localhost:5000/updateTaskStatus/${taskId}`, { status: newStatus });
      
      if (response.status === 200) {
        message.success(`Task successfully marked as ${newStatus}.`);
      } else {
        setTasks(previousTasks);
        message.error('Server returned an error. Reverted changes.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setTasks(previousTasks);
      message.error('Failed to update task status. Network error.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-task/${taskId}`);
      if (response.status === 200) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        message.success('Task deleted successfully.');
      }
    } catch (error) {
      message.error('Failed to delete task.');
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/EditTask/${taskId}`);
  };

  const totalClients = useMemo(() => users.length, [users]);
  const accountingEntries = useMemo(() => accountingData.length, [accountingData]);
  const totalRevenue = useMemo(() => accountingData.reduce((s, item) => s + parseFloat(item.amount || 0), 0), [accountingData]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0), [expenses]);
  const totalProfit = useMemo(() => accountingData.reduce((s, item) => s + (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)), 0), [accountingData]);
  const profitMargin = useMemo(() => totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0, [totalRevenue, totalProfit]);

  const { dates, profits, revenue, costs } = useMemo(() => {
    const map = {};
    accountingData.forEach(item => {
      const d = item.plan_date ? new Date(item.plan_date) : new Date();
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const profit = (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)) || 0;
      const rev = parseFloat(item.amount || 0);
      const cost = parseFloat(item.price_on_me || 0);
      if (!map[key]) map[key] = { profit: 0, revenue: 0, cost: 0 };
      map[key].profit += profit;
      map[key].revenue += rev;
      map[key].cost += cost;
    });
    const keys = Object.keys(map).slice(-15);
    return { 
      dates: keys, 
      profits: keys.map(k => Number(map[k].profit.toFixed(2))),
      revenue: keys.map(k => Number(map[k].revenue.toFixed(2))),
      costs: keys.map(k => Number(map[k].cost.toFixed(2)))
    };
  }, [accountingData]);

  const monthlyData = useMemo(() => {
    const map = {};
    accountingData.forEach(item => {
      const d = item.plan_date ? new Date(item.plan_date) : new Date();
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const rev = parseFloat(item.amount || 0);
      const cost = parseFloat(item.price_on_me || 0);
      if (!map[key]) map[key] = { revenue: 0, cost: 0 };
      map[key].revenue += rev;
      map[key].cost += cost;
    });
    return Object.keys(map).map(k => ({
      month: k,
      revenue: Number(map[k].revenue.toFixed(2)),
      cost: Number(map[k].cost.toFixed(2)),
      profit: Number((map[k].revenue - map[k].cost).toFixed(2))
    }));
  }, [accountingData]);

  const revenueTargetData = useMemo(() => {
    return monthlyData.slice(-6).map(item => {
      const dateObj = new Date(item.month);
      const monthAbbr = dateObj.toLocaleDateString('en-US', { month: 'short' });
      
      return {
        month: monthAbbr,
        revenue: item.revenue,
        target: item.revenue * 1.1,
        growth: item.revenue > 0 ? ((item.profit / item.revenue) * 100) : 0
      };
    });
  }, [monthlyData]);

const topRevenueUsers = useMemo(() => {
  // Create a map to aggregate revenue by user
  const userRevenueMap = {};
  
  accountingData.forEach(item => {
    // Get user_id from the accounting item
    const userId = item.user_id || item.userId || item.userid;
    
    if (userId) {
      const userIdStr = String(userId);
      if (!userRevenueMap[userIdStr]) {
        userRevenueMap[userIdStr] = { 
          totalAmount: 0, 
          count: 0,
          username: null
        };
      }
      userRevenueMap[userIdStr].totalAmount += parseFloat(item.amount || 0);
      userRevenueMap[userIdStr].count += 1;
    }
  });

  // Map users to their total paid amounts
  const result = users
    .map(u => {
      const userIdStr = String(u.id);
      const data = userRevenueMap[userIdStr] || { totalAmount: 0, count: 0 };
      
      return {
        username: u.username || `User ${u.id}`,
        revenue: Number(data.totalAmount.toFixed(2)),
        count: data.count,
        // Optional: add user details
        userId: u.id,
        email: u.email || ''
      };
    })
    .filter(user => user.revenue > 0) // Only show users who have paid
    .sort((a, b) => b.revenue - a.revenue) // Sort by highest revenue
    .slice(0, 8); // Get top 8

  return result;
}, [users, accountingData]);

  const recentInvoices = useMemo(() => {
    return [...accountingData].sort((a, b) => new Date(b.plan_date) - new Date(a.plan_date)).slice(0, 4);
  }, [accountingData]);

  const taskStatus = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done' || t.status === 'completed' || t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress' || t.status === 'in-progress' || t.status === 'ongoing').length;
    const pending = tasks.filter(t => t.status === 'Pending' || t.status === 'pending' || t.status === 'new').length;
    return {
      completed: total > 0 ? (completed / total) * 100 : 0,
      inProgress: total > 0 ? (inProgress / total) * 100 : 0,
      pending: total > 0 ? (pending / total) * 100 : 0,
      total
    };
  }, [tasks]);

  const handleMouseEnter = useCallback((id) => {
    setHoveredCard(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const statsData = useMemo(() => [
    { label: 'Revenue', value: totalRevenue, icon: DollarOutlined, scheme: colorSchemes.revenue, prefix: '$' },
    { label: 'Profit', value: totalProfit, icon: RiseOutlined, scheme: colorSchemes.profit, prefix: '$' },
    { label: 'Expenses', value: totalExpenses, icon: FallOutlined, scheme: colorSchemes.expenses, prefix: '$' },
    { label: 'Margin', value: profitMargin, icon: FundOutlined, scheme: colorSchemes.margin, suffix: '%', showProgress: true },
    { label: 'Clients', value: totalClients, icon: UserOutlined, scheme: colorSchemes.clients },
    { label: 'Tasks', value: tasks.length, icon: FileTextOutlined, scheme: colorSchemes.tasks }
  ], [totalRevenue, totalProfit, totalExpenses, profitMargin, totalClients, tasks.length]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #05050d 100%)' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #05050d 100%)',
      minHeight: '100vh', 
      padding: '20px 28px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* === HEADER === */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
              borderRadius: '50%', 
              width: 48, 
              height: 48, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 22, 
              fontWeight: 'bold', 
              color: '#fff',
              boxShadow: '0 4px 30px rgba(168, 85, 247, 0.3)',
              animation: 'pulse 2s infinite'
            }}>F</div>
            <div>
              <Title level={4} style={{ color: textColor, margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
                Welcome back, Admin!
                <Tag style={{ marginLeft: 12, background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: 'none', color: '#fff', borderRadius: 20 }}>
                  <FireOutlined /> 92% Performance
                </Tag>
              </Title>
              <Text style={{ color: secondaryText, fontSize: 13 }}>
                <RocketOutlined /> {accountingEntries} Invoices • {totalClients} Clients • {tasks.length} Tasks
              </Text>
            </div>
          </div>
          <Space>
            <Button icon={<ReloadOutlined spin={loading} />} onClick={() => window.location.reload()} type="text" style={{ color: textColor }} />
            <Badge count={5} style={{ background: '#ec4899' }}>
              <Button icon={<BellOutlined />} type="text" style={{ color: textColor }} />
            </Badge>
          </Space>
        </div>

        {/* === TOP STATS === */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {statsData.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        {/* === MAIN GRID - REVENUE WAVE + TASK PROGRESS === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '16px' }}>
          <CardWrapper id="area" colorScheme={colorSchemes.area} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ gridColumn: 'span 1' }}>
            <CreativeRevenueWave accountingData={accountingData} />
          </CardWrapper>

          <CardWrapper id="radial" colorScheme={colorSchemes.radial} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ gridColumn: 'span 1' }}>
            <ColorfulTaskPieChart taskStatus={taskStatus} />
          </CardWrapper>
        </div>

        {/* === SECOND ROW - REVENUE TARGET CHART + WORLD MAP === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr', gap: '16px' }}>
          
          {/* REVENUE TARGET CHART */}
          <CardWrapper id="composed" colorScheme={colorSchemes.composed} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: textColor, fontSize: 15, fontWeight: 600 }}>
                <LineChartOutlined style={{ color: '#22c55e' }} /> Revenue vs Target
              </Text>
              <Tag style={{ background: 'rgba(34, 197, 94, 0.2)', border: 'none', color: '#4ade80', borderRadius: 20, fontSize: 10 }}>
                <RiseOutlined /> On Track
              </Tag>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueTargetData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fontSize: 9, fill: 'rgba(255,255,255,0.4)'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: 10 }} />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Line type="monotone" dataKey="growth" stroke="#ec4899" strokeWidth={2} dot={{ r: 3, fill: '#ec4899' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardWrapper>

          <CardWrapper id="map" colorScheme={colorSchemes.map} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: textColor, fontSize: 15, fontWeight: 600 }}>
                <GlobalOutlined style={{ color: '#a855f7' }} /> Global Presence
              </Text>
              <Tag style={{ background: 'rgba(168, 85, 247, 0.2)', border: 'none', color: '#c084fc', borderRadius: 20, fontSize: 10 }}>
                <PushpinOutlined /> Active
              </Tag>
            </div>
            <div style={{ height: 220 }}>
              <WorldMap /> 
            </div>
          </CardWrapper>
        </div>

        {/* === THIRD ROW - RECENT INVOICES & TOP PERFORMERS === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '16px' }}>
          
          <CardWrapper id="invoices" colorScheme={colorSchemes.invoices} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: textColor, fontSize: 15, fontWeight: 600 }}>
                <CreditCardOutlined style={{ color: '#8b5cf6' }} /> Recent Invoices
              </Text>
              <Badge count={recentInvoices.length} style={{ background: '#8b5cf6' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {recentInvoices.map((inv, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#22c55e', '#f59e0b', '#ec4899', '#a855f7'][i], animation: 'pulse 2s infinite' }} />
                      <Text style={{ color: textColor, fontWeight: 500, fontSize: 13 }}>{inv.username || 'Client'}</Text>
                    </div>
                    <Text style={{ color: secondaryText, fontSize: 10 }}>{inv.package || 'Standard'} • {new Date(inv.plan_date).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text style={{ color: '#a78bfa', fontWeight: 600, fontSize: 14 }}>${parseFloat(inv.amount || 0).toFixed(0)}</Text>
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>

        <CardWrapper id="performers" colorScheme={colorSchemes.performers} isHovered={hoveredCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  <Text style={{ color: textColor, fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 12 }}>
    <TrophyOutlined style={{ color: '#f59e0b' }} /> Top Paying Clients
  </Text>
  <div style={{ maxHeight: 180, overflowY: 'auto' }}>
    {topRevenueUsers.length > 0 ? (
      topRevenueUsers.map((u, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '8px 0', 
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: ['#f59e0b', '#d1ccc0', '#cd84f1', '#a855f7', '#ec4899', '#22c55e', '#3b82f6', '#f472b6'][i],
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 10, 
              fontWeight: 'bold', 
              color: i === 0 ? '#000' : '#fff',
              boxShadow: i === 0 ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none'
            }}>
              {i + 1}
            </div>
            <div>
              <Text style={{ color: textColor, fontSize: 13, fontWeight: i === 0 ? 600 : 400 }}>
                {u.username}
              </Text>
              <div style={{ fontSize: 10, color: secondaryText }}>
                {u.count} {u.count === 1 ? 'payment' : 'payments'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Text style={{ 
              color: i === 0 ? '#fbbf24' : i === 1 ? '#a78bfa' : '#60a5fa', 
              fontSize: 14, 
              fontWeight: i === 0 ? 700 : 600 
            }}>
              ${u.revenue}
            </Text>
            <Progress 
              percent={Math.min((u.revenue / (topRevenueUsers[0]?.revenue || 1)) * 100, 100)} 
              strokeColor={['#f59e0b', '#a855f7', '#ec4899', '#22c55e', '#6366f1', '#3b82f6', '#f472b6', '#14b8a6'][i]} 
              showInfo={false} 
              size="small" 
              style={{ width: 40 }} 
            />
          </div>
        </div>
      ))
    ) : (
      <div style={{ textAlign: 'center', padding: '20px 0', color: secondaryText }}>
        <Text style={{ color: secondaryText }}>No payment data available</Text>
      </div>
    )}
  </div>
</CardWrapper>
        </div>

       

        {/* === ANIMATIONS === */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
          @keyframes waveFlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          div::-webkit-scrollbar { width: 3px; }
          div::-webkit-scrollbar-track { background: transparent; }
          div::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.3); border-radius: 10px; }
        `}</style>
      </div>
    </div>
  );
}

export default Dashboard;