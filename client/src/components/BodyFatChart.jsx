import React, { useState } from 'react';
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

const BodyFatChart = ({ data }) => {
  const [bodyFatData, setBodyFatData] = useState(data);
  const [newBodyFat, setNewBodyFat] = useState('');

  // Determine the min and max values for body fat percentage
  const bodyFatValues = data.map((entry) => entry.bodyFat);
  const minBodyFat = Math.min(...bodyFatValues);
  const maxBodyFat = Math.max(...bodyFatValues);

  // Round down min to the nearest multiple of 5, and round up max to the nearest multiple of 5
  const roundedMin = Math.floor(minBodyFat / 5) * 5;
  const roundedMax = Math.ceil(maxBodyFat / 5) * 5;

  // Generate ticks with an increment of 5 between roundedMin and roundedMax
  const ticks = [];
  for (let i = roundedMin; i <= roundedMax; i += 5) {
    ticks.push(i);
  }

  const addBodyFat = () => {
    if (newBodyFat.trim() === '') return; // Prevent adding empty entries

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      bodyFat: parseFloat(newBodyFat), // Parse to float to ensure it's a number
    };

    if (!isNaN(newEntry.bodyFat)) {
      setBodyFatData((prevData) => [...prevData, newEntry]);
      setNewBodyFat('');
    }
  };

  return (
    <div
      style={{
        width: '36em',
        margin: '0 auto',
        height: 400,
        marginBottom: '8rem',
      }}
    >
      <ResponsiveContainer>
        <LineChart
          data={bodyFatData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[roundedMin, roundedMax]} ticks={ticks} />{' '}
          {/* Custom Y-axis with rounded values */}
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bodyFat"
            stroke="#ff7300"
            activeDot={{ r: 8 }}
            dot={{ r: 4 }} // Set dot size
            name="Body Fat (%)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="body-fat-form">
        <h3>Log Your Body Fat Percentage</h3>
        <input
          type="number"
          value={newBodyFat}
          onChange={(e) => setNewBodyFat(e.target.value)}
          placeholder="Enter your body fat (%)"
        />
        <button onClick={addBodyFat}>Add Body Fat</button>
      </div>
    </div>
  );
};

export default BodyFatChart;
