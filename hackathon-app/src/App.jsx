import React, { useState, useEffect } from 'react';
import WellbeingChart from './WellbeingChart';
import LonelinessChart from './LonelinessChart';
import AIQuestionForm from './AIQuestionForm';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the CSV data
    fetch('/data/final/final_means_loneliness_quarterly.csv')
      .then(response => response.text())
      .then(csvText => {
        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const parsedData = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
              const value = values[index];
              // Convert numeric values
              if (['life_satisfaction', 'worthwhile', 'happiness', 'anxiety', 'wellbeing_index', 'often', 'some_time', 'occasionally', 'hardly_ever', 'never', 'lonely_at_least_occasionally_pct', 'lonely_often_or_sometimes_pct'].includes(header)) {
                row[header] = parseFloat(value);
              } else if (header === 'quarter') {
                row[header] = `2025_Q${value}`;
              } else {
                row[header] = value;
              }
            });
            parsedData.push(row);
          }
        }
        
        setData(parsedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate averages for key metrics
  const avgLifeSatisfaction = (data.reduce((sum, item) => sum + item.life_satisfaction, 0) / data.length).toFixed(1);
  const avgHappiness = (data.reduce((sum, item) => sum + item.happiness, 0) / data.length).toFixed(1);
  const avgLoneliness = Math.round(data.reduce((sum, item) => sum + item.lonely_at_least_occasionally_pct, 0) / data.length);
  const regions = [...new Set(data.map(item => item.region))].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur shadow-sm border border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-pink-600">UK Wellbeing Dashboard</h1>
          <p className="mt-2 text-slate-700 text-lg">
            Regional Personal Wellbeing & Loneliness Analysis - 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Life Satisfaction</h3>
            <p className="text-2xl font-bold text-blue-600">{avgLifeSatisfaction}/10</p>
            <p className="text-xs text-gray-500 mt-1">Across all regions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Happiness</h3>
            <p className="text-2xl font-bold text-yellow-600">{avgHappiness}/10</p>
            <p className="text-xs text-gray-500 mt-1">Stable across quarters</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Loneliness Rate</h3>
            <p className="text-2xl font-bold text-pink-600">{avgLoneliness}%</p>
            <p className="text-xs text-gray-500 mt-1">At least occasionally</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Regions Tracked</h3>
            <p className="text-2xl font-bold text-green-600">{regions}</p>
            <p className="text-xs text-gray-500 mt-1">UK regions</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WellbeingChart data={data} />
          <LonelinessChart data={data} />
        </div>

        {/* AI Question Form */}
        <div className="mt-8">
          <AIQuestionForm data={data} />
        </div>

        {/* Data Summary */}
        <div className="mt-8 bg-white/80 backdrop-blur rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About This Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Wellbeing Metrics</h3>
              <p>Personal wellbeing scores are measured on a scale of 0-10, covering life satisfaction, worthwhile activities, happiness, and anxiety levels across 9 UK regions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Loneliness Statistics</h3>
              <p>Loneliness data shows the percentage of respondents experiencing different frequencies of loneliness, from "never" to "often or always".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

