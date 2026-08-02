// Dashboard.js (plain JavaScript React component)
// Place this file as src/components/Dashboard.js
// Also create the companion CSS file src/components/Dashboard.css (content below)

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';

import CountUp from 'react-countup';
import './Dashboard.css';
import WorldMap from './WorldMap';

function Dashboard() {
  const [accountingData, setAccountingData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        const [accRes, usersRes, tasksRes, topRes, expRes] = await Promise.all([
          axios.get('http://localhost:5000/api/AccountingData'),
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/viewtasks'),
          axios.get('http://localhost:5000/api/top-scorers'),
          axios.get('http://localhost:5000/api/getexpensesfiltered'), // Fetch current month's expenses
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

const topScorersData = topScorers.slice(0, 5).map((s) => ({
  name: s.username,
  value: s.total_invoices || 0,
}));

const SCORER_COLORS = ['#2E3192', '#1FBf7A', '#ff7f50', '#ffa500', '#ff69b4'];
 const EXPENSE_COLORS = ['#ff6384', '#36a2eb', '#ffce56', '#8bc34a', '#9c27b0'];
  const totalClients = users.length;
  const accountingEntries = accountingData.length;
  const totalProfit = accountingData.reduce((s, item) => s + (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)), 0);
const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const { dates, profits } = useMemo(() => {
    const map = {};
    accountingData.forEach(item => {
      const d = item.plan_date ? new Date(item.plan_date) : new Date();
      const key = d.toLocaleDateString();
      const profit = (parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0)) || 0;
      map[key] = (map[key] || 0) + profit;
    });
    const keys = Object.keys(map).sort((a,b) => new Date(a) - new Date(b));
    return { dates: keys, profits: keys.map(k => Number(map[k].toFixed(2))) };
  }, [accountingData]);
 const expensesByDate = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const d = e.date ? new Date(e.date) : new Date();
      const key = d.toLocaleDateString();
      map[key] = (map[key] || 0) + parseFloat(e.amount || 0);
    });
    return Object.keys(map).sort((a,b) => new Date(a)-new Date(b)).map(date => ({ date, amount: Number(map[date].toFixed(2)) }));
  }, [expenses]);
  const profitPerUser = useMemo(() => {
    return users.map(u => {
      const invoices = accountingData.filter(a => a.user_id === u.id);
      const userProfit = invoices.reduce((s, it) => s + (parseFloat(it.amount || 0) - parseFloat(it.price_on_me || 0)), 0);
      return { username: u.username || u.name || `User ${u.id}`, totalProfit: Number(userProfit.toFixed(2)) };
    }).sort((a,b) => b.totalProfit - a.totalProfit);
  }, [users, accountingData]);

  const pendingTasksCount = tasks.filter(t => (t.status || '').toLowerCase() === 'pending' || !t.completed).length;
  const doneTasksCount = tasks.filter(t => (t.status || '').toLowerCase() === 'done' || t.completed).length;
  const progressPercent = Math.round((doneTasksCount / (pendingTasksCount + doneTasksCount || 1)) * 100);

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="center-note">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      
      <header className="dash-header">
        <div className="header-left">
          <h1 className="brand">Admin Dashboard</h1>
          <p className="subtitle">Professional UI • Clean visuals • Animated micro-interactions</p>
        </div>
       
      </header>

      <main className="dash-main">
       <section className="kpi-cards">
  <article className="card glass card-animated" style={{ background: 'linear-gradient(135deg, #2E3192, #1B1F4D)' }}>
    <div className="card-top">
      <div className="card-title">Total Clients</div>
      <div className="card-icon">👥</div>
    </div>
    <div className="card-body">
      <div className="card-number"><CountUp end={totalClients} duration={1.4} /></div>
      <div className="card-note">Active accounts</div>
    </div>
  </article>

  <article className="card glass card-animated" style={{ background: 'linear-gradient(135deg, #1FBf7A, #0B3D2E)' }}>
    <div className="card-top">
      <div className="card-title">Total Invoices</div>
      <div className="card-icon">📄</div>
    </div>
    <div className="card-body">
      <div className="card-number"><CountUp end={accountingEntries} duration={1.4} /></div>
      <div className="card-note">Recorded invoices</div>
    </div>
  </article>

  <article className="card glass card-animated" style={{ background: 'linear-gradient(135deg, #FF7F50, #FF6347)' }}>
    <div className="card-top1">
      <div className="card-title">Total Profit</div>
      <div className="card-icon">💸</div>
    </div>
    <div className="card-body">
      <div className="card-number1">${<CountUp end={Number(totalProfit.toFixed(2))} duration={1.6} decimals={2} />}</div>
      <div className="card-note">Net profit</div>
    </div>
  </article>

  <article className="card glass card-animated" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
    <div className="card-top">
      <div className="card-title">Total Expenses</div>
    </div>
    <div style={{ color: "black", fontWeight: "800", fontSize: "24px", marginTop: "5%" }}>
      ${<CountUp end={Number(totalExpenses.toFixed(2))} duration={1.6} decimals={2} />}
    </div>
  </article>
</section>

<section className="charts-grid">
  <div >
   

    <div className="chart-body worldmap-container">
      <WorldMap />
    </div>
  </div>
</section>

        <section className="charts-grid">
          <div className="chart-card glass chart-animated">
            <div className="chart-header">
              <h3>Profit Over Time</h3>
            </div>
            <div className="chart-body">
              {dates.length ? (
                <Plot
                  data={[{
                    x: dates,
                    y: profits,
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: 'rgba(48, 98, 183, 0.95)', width: 3, shape: 'spline' },
                    marker: { size: 6, color: '#2E3192' },
                  }]}
                  layout={{
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    color:'white',
                    margin: { t: 10, l: 40, r: 10, b: 40 },
                    xaxis: { title: 'Date', automargin: true },
                    yaxis: { title: 'Profit ($)', automargin: true },
                    autosize: true,
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div className="empty">No profit data</div>
              )}
            </div>
          </div>

          <aside className="side-column">
            <div className="top-scorers glass card-animated">
              <h4>Top Scorers</h4>
              <div className="scorers-list">
                {topScorers.length ? topScorers.slice(0,5).map((s, i) => (
                  <div className="scorer" key={s.id || i}>
                    <img src={s.profile_image || 'https://via.placeholder.com/48'} alt={s.username} className="scorer-avatar" />
                    <div className="scorer-info">
                      <div className="scorer-name">{s.username}</div>
                      <div className="scorer-meta">{s.total_invoices} $</div>
                    </div>
                    <div className="scorer-rank">#{i+1}</div>
                  </div>
                )) : <div className="empty">No scorers yet</div>}
              </div>
            </div>

            <div className="tasks glass card-animated">
              <h4>Tasks Overview</h4>
              <div className="task-stats">
                <div className="task-count">
                  <div className="big">{pendingTasksCount}</div>
                  <div className="label">Pending</div>
                </div>
                <div className="task-count">
                  <div className="big success">{doneTasksCount}</div>
                  <div className="label">Completed</div>
                </div>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="progress-meta">{progressPercent}% completed</div>

              <button className="btn view-tasks" onClick={() => window.location.href = '/viewtasks'}>View All Tasks →</button>
            </div>
          </aside>

        </section>
  {/* Expenses PieChart */}
   <section className="charts-flex-container glass card-animated">
  {/* Expenses PieChart */}
  <div className="chart-card flex-chart">
    <div className="chart-header"><h3>Expenses by Date</h3></div>
    <div className="chart-body">
      {expensesByDate.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expensesByDate}
              dataKey="amount"
              nameKey="date"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              label={({ date, percent }) => `${date} (${(percent*100).toFixed(0)}%)`}
            >
              {expensesByDate.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip formatter={value => [`$${value}`, 'Expense']} />
          </PieChart>
        </ResponsiveContainer>
      ) : <div className="empty">No expenses yet</div>}
    </div>
  </div>

  {/* Total Profit BarChart */}
  <div className="chart-card flex-chart">
    <h3>Total Profit Report</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={profitPerUser} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#111" />
          <XAxis dataKey="username" stroke="#bbb" tick={{ fontSize: 12 }} />
          <YAxis stroke="#bbb" />
          <Tooltip contentStyle={{ background: '#0b1226', border: 'none', color: '#fff' }} formatter={value => [`$${value}`, 'Profit']} />
          <Bar dataKey="totalProfit" fill="rgba(48, 98, 183, 0.95)" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</section>


      </main>

      <footer className="dash-footer">©2025 Digital Connects All Rights Reserved.</footer>
    </div>
  );
}

export default Dashboard;

