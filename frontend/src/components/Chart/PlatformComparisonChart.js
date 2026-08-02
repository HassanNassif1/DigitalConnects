import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const PlatformComparisonChart = () => {
  const [platformData, setPlatformData] = useState({
    labels: ['Instagram', 'Facebook', 'Snapchat', 'YouTube', 'X', 'TikTok'],
    datasets: [
      {
        label: 'Comparison',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: [0, 0, 0, 0, 0, 0], // Initialize with zeros
      },
    ],
  });

  useEffect(() => {
    // Fetch data for all platforms
    axios
      .get('http://localhost:5000/api/platforms') // Updated API endpoint
      .then((response) => {
        const platformMetrics = {
          Instagram: 0,
          Facebook: 0,
          Snapchat: 0,
          YouTube: 0,
          X: 0,
          TikTok: 0,
        };

        response.data.forEach((record) => {
          // Assuming 'type' is the key for the platform data in your API
          const platform = record.type;
          platformMetrics[platform] += record.amount; // Adjust as needed
        });

        setPlatformData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: Object.values(platformMetrics),
            },
          ],
        }));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Platform Comparison</h2>
      <Bar
        data={platformData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default PlatformComparisonChart;
