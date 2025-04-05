
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const FootprintChart = () => {
  // State to store our chart data
  const [chartData, setChartData] = useState([]);
  
  // Generate chart data on component mount
  useEffect(() => {
    const generateDataWithDates = () => {
      const today = new Date();
      const data = [];
      
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const formattedDate = format(date, 'MMM dd');
        
        // Randomize carbon values a bit for demo purposes
        const carbonValue = (Math.random() * 4 + 2).toFixed(1);
        
        data.push({
          date: formattedDate,
          fullDate: date,
          carbon: parseFloat(carbonValue)
        });
      }
      
      return data;
    };
    
    setChartData(generateDataWithDates());
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Carbon Emissions</CardTitle>
        <CardDescription>
          Visualize your AI carbon footprint by date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value}
              />
              <YAxis label={{ value: 'CO₂ (g)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value}g CO₂`, 'Carbon Emissions']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="carbon" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FootprintChart;
