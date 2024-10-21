import React, { useState, useEffect } from 'react';
import { getBodyFatData, postBodyFatData } from '../../services/apiService';
import './BodyFatChart.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BodyFatChart = () => {
  const [bodyFatData, setBodyFatData] = useState([]);
  const [newBodyFat, setNewBodyFat] = useState('');
  const [selectedRange, setSelectedRange] = useState('lastMonth');

  // Determine the min and max values for body fat percentage
  const bodyFatValues = bodyFatData.map((entry) => entry.bodyFat);
  const minBodyFat = Math.min(...bodyFatValues);
  const maxBodyFat = Math.max(...bodyFatValues);

  // Round down min to the nearest multiple of 5, and round up max to the nearest multiple of 5
  const roundedMin = Math.floor(minBodyFat / 5) * 5;
  const roundedMax = Math.ceil(maxBodyFat / 5) * 5;

  // Fetch body fat data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBodyFatData();
        setBodyFatData(data);
      } catch (error) {
        console.error('Failed to fetch body fat data:', error);
      }
    };

    fetchData();
  }, []);

  // Generate ticks with an increment of 5 between roundedMin and roundedMax
  const ticks = [];
  for (let i = roundedMin; i <= roundedMax; i += 5) {
    ticks.push(i);
  }

  const addBodyFat = async () => {
    if (newBodyFat.trim() === '') return; // Prevent adding empty entries

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      bodyFat: parseFloat(newBodyFat), // Parse to float to ensure it's a number
    };

    if (!isNaN(newEntry.bodyFat)) {
      try {
        const savedEntry = await postBodyFatData(newEntry);
        setBodyFatData((prevData) => [...prevData, newEntry]);
        setNewBodyFat('');
      } catch (error) {
        console.error('Failed to save body fat data:', error);
      }
    }
  };

  // Filter data for selected range
  const filterData = () => {
    const today = new Date();
    const filteredData = bodyFatData.filter((entry) => {
      const entryDate = new Date(entry.date);
      switch (selectedRange) {
        case 'lastWeek':
          return entryDate >= new Date(today.setDate(today.getDate() - 7));
        case 'lastMonth':
          return entryDate >= new Date(today.setMonth(today.getMonth() - 1));
        case 'last3Months':
          return entryDate >= new Date(today.setMonth(today.getMonth() - 3));
        case 'last6Months':
          return entryDate >= new Date(today.setMonth(today.getMonth() - 6));
        case 'lastYear':
          return (
            entryDate >= new Date(today.setFullYear(today.getFullYear() - 1))
          );
        case 'all':
        default:
          return true; // Return all data
      }
    });
    return filteredData;
  };

  const filteredData = filterData();

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div
        style={{
          width: '36em',
          margin: '0 auto',
          height: 400,
          //   marginBottom: '8rem',
          maxWidth: '90vw',
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={bodyFatData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#ffffff"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="date" tick={{ fill: 'white' }} />
            <YAxis
              domain={[roundedMin, roundedMax]}
              ticks={ticks}
              tick={{ fill: 'white' }}
            />
            {/* Custom Y-axis with rounded values */}
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#ff7300"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }} // Set dot size
              name="Body Fat (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="log">
        <div className="body-fat-form">
          <h4>Log Your Body Fat Percentage</h4>
          <input
            type="number"
            value={newBodyFat}
            onChange={(e) => setNewBodyFat(e.target.value)}
            placeholder="Enter your body fat percentage (%)"
          />
          <button onClick={addBodyFat}>Add Body Fat</button>
        </div>
        <div className="time-range-selector">
          <h4>Select Time Range:</h4>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BodyFatChart;
