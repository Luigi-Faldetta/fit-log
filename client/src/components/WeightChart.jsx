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

const WeightChart = ({ data }) => {
  const [newWeight, setNewWeight] = useState('');
  const [selectedRange, setSelectedRange] = useState('lastMonth');
  // Determine the min and max values for weight
  const weightValues = data.map((entry) => entry.weight);
  const minWeight = Math.min(...weightValues);
  const maxWeight = Math.max(...weightValues);

  // Round down min to the nearest multiple of 5, and round up max to the nearest multiple of 5
  const roundedMin = Math.floor(minWeight / 5) * 5;
  const roundedMax = Math.ceil(maxWeight / 5) * 5;

  // Generate ticks with an increment of 5 between roundedMin and roundedMax
  const ticks = [];
  for (let i = roundedMin; i <= roundedMax; i += 5) {
    ticks.push(i);
  }

  // Function to add new weight
  const addWeight = () => {
    if (newWeight.trim() === '') return; // Prevent adding empty entries

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight), // Parse to float to ensure it's a number
    };

    if (!isNaN(newEntry.weight)) {
      setData((prevData) => [...prevData, newEntry]);
      setNewWeight('');
    }
  };

  // Filter data for selected range
  const filterData = () => {
    const today = new Date();
    const filteredData = data.filter((entry) => {
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
    <div>
      <div style={{ width: '36em', margin: '0 auto', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[roundedMin, roundedMax]} ticks={ticks} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot={{ r: 4 }} // Set dot size
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="weight-form">
        <h3>Log Your Weight</h3>
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Enter your weight (kg)"
        />
        <button onClick={addWeight}>Add Weight</button>
      </div>
      <div className="time-range-selector">
        <h3>Select Time Range:</h3>
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
  );
};

export default WeightChart;
