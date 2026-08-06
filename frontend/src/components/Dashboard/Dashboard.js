import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';
import CountUp from 'react-countup';
import './Dashboard.css';
import WorldMap from './WorldMap';
import {
  UserOutlined, FileTextOutlined, DollarOutlined, RiseOutlined, 
  FallOutlined, BarChartOutlined, PieChartOutlined, GlobalOutlined, 
  TeamOutlined, ReloadOutlined, TrophyOutlined, StarOutlined, 
  FlagOutlined, DashboardOutlined, WalletOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ThunderboltOutlined, SafetyOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Typography, Divider, Tag, Badge, Space, Button, Spin, Avatar, Progress, Statistic } from 'antd';

const { Title, Text } = Typography;

function Dashboard() {
  const [accountingData, setAccountingData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  // === YOUR EXACT THEME COLORS ===
  const bgColor = "#0a0a1a";
  const cardBg = "#14142b"; // Deep dark blue/purple
  const cardLighter = "#1a1a35";
  const textColor = "#ffffff";
  const borderColor = "rgba(255,255,255,0.06)";
  const accentColor = "#6c5ce7"; // Your main purple
  const accentLight = "#a29bfe";
  const secondaryText = "rgba(255,255,255,0.6)";
  const progressGreen = "#00b894";
  const highlightPink = "#fd79a8";

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

  // === DATA CALCULATIONS ===
  const totalClients = users.length;
  const accountingEntries = accountingData.length;
  const totalProfit = accountingData.reduce((s, item) => s + (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)), 0);
  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  // Memoized Chart Data
  const { dates, profits } = useMemo(() => {
    const map = {};
    accountingData.forEach(item => {
      const d = item.plan_date ? new Date(item.plan_date) : new Date();
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const profit = (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)) || 0;
      map[key] = (map[key] || 0) + profit;
    });
    const keys = Object.keys(map).slice(-10); // Latest 10 entries
    return { dates: keys, profits: keys.map(k => Number(map[k].toFixed(2))) };
  }, [accountingData]);

  // Top 5 Users by revenue
  const topRevenueUsers = useMemo(() => {
    return users.map(u => {
      const invoices = accountingData.filter(a => a.user_id === u.id);
      const revenue = invoices.reduce((s, it) => s + parseFloat(it.amount || 0), 0);
      return { username: u.username || `User ${u.id}`, revenue: Number(revenue.toFixed(2)) };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [users, accountingData]);

  // Recent Invoices
  const recentInvoices = useMemo(() => {
    return accountingData.sort((a, b) => new Date(b.plan_date) - new Date(a.plan_date)).slice(0, 3);
  }, [accountingData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: bgColor }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ 
      background: bgColor, 
      minHeight: '100vh', 
      padding: '24px 32px', // Reduced side padding (or set to 0 for absolute edge-to-edge)
      display: 'flex', 
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* === MAIN DASHBOARD WRAPPER - NO MAX WIDTH === */}
      <div style={{ 
        width: '100%', // Fills 100% of the screen
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        
        {/* === TOP HEADER === */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: accentColor, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: '#fff' }}>F</div>
            <div>
              <Title level={4} style={{ color: textColor, margin: 0, lineHeight: 1.2 }}>Welcome back, Admin!</Title>
              <Text style={{ color: secondaryText, fontSize: 13 }}>Intermediate Level • {accountingEntries} Invoices</Text>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, color: textColor }}>
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()} type="text" style={{ color: textColor }} />
          </div>
        </div>

        {/* === TOP STATS BAR (4 Vertical Pillars) === */}
        <div style={{ flex: '0 0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          {/* Total Clients */}
          <div style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44`, borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${accentColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: 18, marginBottom: 8 }}><UserOutlined /></div>
            <Text style={{ color: secondaryText, fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Total Clients</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: textColor, marginTop: 4 }}><CountUp end={totalClients} /></div>
          </div>

          {/* Active Tasks */}
          <div style={{ background: `${progressGreen}22`, border: `1px solid ${progressGreen}44`, borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${progressGreen}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: progressGreen, fontSize: 18, marginBottom: 8 }}><FileTextOutlined /></div>
            <Text style={{ color: secondaryText, fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Active Tasks</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: textColor, marginTop: 4 }}><CountUp end={tasks.length} /></div>
          </div>

          {/* Expenses */}
          <div style={{ background: `${highlightPink}22`, border: `1px solid ${highlightPink}44`, borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${highlightPink}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: highlightPink, fontSize: 18, marginBottom: 8 }}><DollarOutlined /></div>
            <Text style={{ color: secondaryText, fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Expenses</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: textColor, marginTop: 4 }}><CountUp end={totalExpenses} decimals={0} prefix="$" /></div>
          </div>

          {/* Net Profit */}
          <div style={{ background: `${accentLight}22`, border: `1px solid ${accentLight}44`, borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${accentLight}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentLight, fontSize: 18, marginBottom: 8 }}><SafetyOutlined /></div>
            <Text style={{ color: secondaryText, fontSize: 12, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Net Profit</Text>
            <div style={{ fontSize: 22, fontWeight: 700, color: textColor, marginTop: 4 }}><CountUp end={totalProfit > 0 ? totalProfit : 0} decimals={0} prefix="$" /></div>
          </div>
        </div>

        {/* === CSS GRID DASHBOARD LAYOUT === */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '20px', 
          flex: 1, 
          minHeight: 0
        }}>

          {/* === COLUMN 1 (Left Side) === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Card A: Total Financial Overview (Circle) */}
            <div style={{ flex: '1 1 50%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>Total Finances</Text>
                <WalletOutlined style={{ color: accentColor, fontSize: 20 }} />
              </div>
              
              <div style={{ position: 'relative', marginTop: 10, textAlign: 'center' }}>
                <div style={{ width: 160, height: 160, borderRadius: '50%', background: `conic-gradient(${accentColor} 0% 60%, ${progressGreen} 60% 85%, ${highlightPink} 85% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 130, height: 130, borderRadius: '50%', background: cardBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: secondaryText, fontSize: 11 }}>Total Profit</Text>
                    <div style={{ fontSize: 24, fontWeight: 700, color: textColor }}>${Math.abs(totalProfit).toFixed(0)}</div>
                  </div>
                </div>
                
                <div style={{ position: 'absolute', top: -10, left: -90, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Revenue</Text>
                </div>
                <div style={{ position: 'absolute', bottom: 50, right: -80, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: highlightPink }} />
                  <Text style={{ color: secondaryText, fontSize: 11 }}>Expenses</Text>
                </div>
              </div>
              
              <Text style={{ color: secondaryText, fontSize: 12, marginTop: 20 }}>${totalExpenses.toFixed(0)} spent this month</Text>
            </div>

            {/* Card B: WORLD MAP */}
            <div style={{ flex: '1 1 50%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flex: '0 0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <GlobalOutlined style={{ color: accentColor, fontSize: 18 }} />
                  <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>User Locations</Text>
                </div>
                <Tag color="purple" style={{ background: 'rgba(108,92,231,0.2)', border: 'none', color: '#a29bfe', fontSize: 11, borderRadius: 20 }}>{totalClients} Users</Tag>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <WorldMap users={users} />
              </div>
            </div>

          </div>

          {/* === COLUMN 2 (Middle Side) === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Card C: Recent Invoices (Upcoming Bills Style) */}
            <div style={{ flex: '1 1 60%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>Recent Invoices</Text>
                <CreditCardOutlined style={{ color: accentColor, fontSize: 20 }} />
              </div>
              <Text style={{ color: secondaryText, fontSize: 12, marginBottom: 16 }}>Total Invoices Due: ${accountingData.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toFixed(0)}</Text>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentInvoices.map((inv, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: cardLighter, borderRadius: 12, padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Tag color={i === 0 ? "error" : "default"} style={{ background: i === 0 ? highlightPink : accentColor, border: 'none', color: '#fff', margin: 0, borderRadius: 20, fontSize: 10 }}>{new Date(inv.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</Tag>
                        <Text style={{ color: textColor, fontWeight: 500, fontSize: 13 }}>{inv.username || 'Client'}</Text>
                      </div>
                      <Text style={{ color: secondaryText, fontSize: 11 }}>{inv.package || 'Standard'}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Text style={{ color: textColor, fontWeight: 600 }}>${parseFloat(inv.amount || 0).toFixed(0)}</Text>
                      <Button size="small" style={{ background: 'transparent', border: `1px solid ${accentColor}`, color: accentColor, borderRadius: 20, fontSize: 11, height: 28 }}>Pay</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card D: Middle Bottom (Moved stat boxes here) */}
            <div style={{ flex: '1 1 40%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: cardLighter, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, fontSize: 18, marginBottom: 8 }}><RiseOutlined /></div>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 700 }}><CountUp end={accountingEntries} /></Text>
                <Text style={{ color: secondaryText, fontSize: 11 }}>Total Invoices</Text>
              </div>

              <div style={{ background: cardLighter, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, fontSize: 18, marginBottom: 8 }}><TeamOutlined /></div>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 700 }}><CountUp end={users.length} /></Text>
                <Text style={{ color: secondaryText, fontSize: 11 }}>Registered Users</Text>
              </div>
            </div>

          </div>

          {/* === COLUMN 3 (Right Side) === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Card E: Profit Over Time (Gradient Area Chart) */}
            <div style={{ flex: '1 1 55%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>Profit Over Time</Text>
                <RiseOutlined style={{ color: progressGreen, fontSize: 18 }} />
              </div>
              
              <div style={{ flex: 1, minHeight: 0 }}>
                {dates.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dates.map((d, i) => ({ date: d, profit: profits[i] }))} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={accentColor} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={borderColor} vertical={false} />
                      <XAxis dataKey="date" stroke={secondaryText} tick={{fontSize: 10, fill: secondaryText}} axisLine={false} tickLine={false} />
                      <YAxis stroke={secondaryText} tick={{fontSize: 10, fill: secondaryText}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1a35', border: `1px solid ${borderColor}`, borderRadius: 8, color: '#fff' }} />
                      <Area type="monotone" dataKey="profit" stroke={accentColor} strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: secondaryText }}>No data available</div>
                )}
              </div>
            </div>

            {/* Card F: Top Performers / Revenue List */}
            <div style={{ flex: '1 1 45%', background: cardBg, borderRadius: 24, padding: 24, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: 600 }}>Top Revenue</Text>
                <TrophyOutlined style={{ color: '#fdcb6e', fontSize: 18 }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {topRevenueUsers.length > 0 ? (
                  topRevenueUsers.map((u, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#fdcb6e' : accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{i + 1}</div>
                        <Text style={{ color: textColor, fontWeight: 500, fontSize: 13 }}>{u.username}</Text>
                      </div>
                      <Text style={{ color: progressGreen, fontWeight: 600, fontSize: 13 }}>${u.revenue.toFixed(0)}</Text>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: secondaryText, fontSize: 13 }}>No revenue data available</div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* === CSS STYLES === */}
        <style>{`
          div::-webkit-scrollbar { width: 4px; }
          div::-webkit-scrollbar-track { background: transparent; }
          div::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.3); border-radius: 10px; }
          div::-webkit-scrollbar-thumb:hover { background: rgba(108,92,231,0.5); }
          
          div[style*="border-radius: 24px"] {
            transition: transform 0.2s ease, box-shadow 0.3s ease;
          }
          div[style*="border-radius: 24px"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Dashboard;