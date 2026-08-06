import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Typography } from 'antd';

const { Text } = Typography;

const RevenueTargetChart = ({ data }) => {
  // If no data is passed, use this mock data that matches your image
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    return [
      { month: 'Jan', revenue: 12000, target: 13000, growth: 5.5 },
      { month: 'Feb', revenue: 15000, target: 16000, growth: 8.0 },
      { month: 'Mar', revenue: 18000, target: 19000, growth: 10.2 },
      { month: 'Apr', revenue: 17000, target: 20000, growth: 7.1 },
      { month: 'May', revenue: 22000, target: 22000, growth: 12.4 },
    ];
  }, [data]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      // Matches the light blue gradient background from your image
      background: 'linear-gradient(180deg, #dbf4ff 0%, #b0e2f8 100%)',
      borderRadius: 12,
      padding: '20px 20px 10px 20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Chart Title */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <Text style={{ color: '#1a3b5d', fontSize: 16, fontWeight: 700 }}>
          Revenue vs Target with Growth
        </Text>
      </div>

      {/* The Chart */}
      <div style={{ flex: 1, minHeight: 200, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {/* Grid */}
            <CartesianGrid 
              stroke="#ffffff" 
              strokeOpacity={0.5} 
              vertical={false} 
            />

            {/* X-Axis */}
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#1a3b5d', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#1a3b5d', strokeOpacity: 0.2 }}
              tickLine={false}
            />

            {/* LEFT Y-AXIS (Revenue) */}
            <YAxis 
              yAxisId="left"
              orientation="left"
              tick={{ fill: '#1a3b5d', fontSize: 11 }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
              axisLine={false}
              tickLine={false}
            />

            {/* RIGHT Y-AXIS (Growth %) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#1a3b5d', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                border: '1px solid #ccc',
                borderRadius: 8,
                color: '#1a3b5d'
              }} 
              formatter={(value, name) => {
                if (name === 'Growth Rate') return [`${value}%`, name];
                return [`$${value.toLocaleString()}`, name];
              }}
            />

            {/* Legend */}
            <Legend 
              verticalAlign="bottom" 
              height={30}
              iconType="rect"
              wrapperStyle={{ fontSize: 11, color: '#1a3b5d' }}
            />

            {/* 1. Revenue Bar (Light Blue) */}
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              name="Revenue (USD)" 
              fill="#4a90e2" 
              barSize={16} 
              radius={[3, 3, 0, 0]} 
            />

            {/* 2. Target Revenue Bar (Dark Blue/Purple) */}
            <Bar 
              yAxisId="left"
              dataKey="target" 
              name="Target Revenue (USD)" 
              fill="#5e35b1" 
              barSize={16} 
              radius={[3, 3, 0, 0]} 
            />

            {/* 3. Growth Rate Line (White with border) */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="growth" 
              name="Growth Rate (%)" 
              stroke="#ffffff" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#ffffff', stroke: '#1a3b5d', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTargetChart;