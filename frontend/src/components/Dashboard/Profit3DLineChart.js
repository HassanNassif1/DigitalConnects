import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";

function Profit3DLineChart() {
  const [accountingData, setAccountingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/AccountingData");
        setAccountingData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const profitByDate = {};
  accountingData.forEach(item => {
    const dateKey = new Date(item.plan_date).toLocaleDateString();
    const profit = parseFloat(item.amount || 0) - parseFloat(item.price_on_me || 0);
    if (!profitByDate[dateKey]) profitByDate[dateKey] = 0;
    profitByDate[dateKey] += profit;
  });

  const dates = Object.keys(profitByDate);
  const profits = Object.values(profitByDate);

  const option = {
    tooltip: { show: true },
    xAxis3D: { type: 'category', data: dates },
    yAxis3D: { type: 'value' },
    zAxis3D: { type: 'value' },
    grid3D: {
      viewControl: { autoRotate: true, rotateSpeed: 10 },
      boxDepth: 100,
      light: { main: { intensity: 1.2 }, ambient: { intensity: 0.3 } }
    },
    series: [
      {
        type: 'line3D',
        data: dates.map((d, i) => [d, profits[i], Math.random() * 10]),
        lineStyle: { width: 4, color: '#2E3192', opacity: 0.9 },
        itemStyle: { color: '#1FBf7A' },
        smooth: true
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
}

export default Profit3DLineChart;
