
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

// Add this interface for our chart data
interface DailyFootprint {
  date: string;
  fullDate: Date;
  carbon: number;
  promptCount: number;
}

// Create a global variable to store carbon data across sessions
const getStoredFootprints = (): Record<string, DailyFootprint> => {
  const stored = localStorage.getItem('carbonFootprints');
  return stored ? JSON.parse(stored) : {};
};

// Global variable to track carbon footprints by date
const carbonFootprints: Record<string, DailyFootprint> = getStoredFootprints();

// Function to add carbon to today's date
export const addCarbonToday = (carbonAmount: number): void => {
  const today = new Date();
  const dateKey = format(today, 'yyyy-MM-dd');
  
  if (!carbonFootprints[dateKey]) {
    carbonFootprints[dateKey] = {
      date: format(today, 'MMM dd'),
      fullDate: today,
      carbon: 0,
      promptCount: 0
    };
  }
  
  carbonFootprints[dateKey].carbon += carbonAmount;
  carbonFootprints[dateKey].promptCount += 1;
  
  // Save to localStorage
  localStorage.setItem('carbonFootprints', JSON.stringify(carbonFootprints));
  
  // Dispatch a custom event that our chart can listen for
  window.dispatchEvent(new CustomEvent('carbon-updated'));
};

const FootprintChart = () => {
  // State to store our chart data
  const [chartData, setChartData] = useState<DailyFootprint[]>([]);
  
  // Update chart data on component mount and when carbon is updated
  useEffect(() => {
    const updateChartData = () => {
      const today = new Date();
      const data: DailyFootprint[] = [];
      
      // Generate empty data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateKey = format(date, 'yyyy-MM-dd');
        const formattedDate = format(date, 'MMM dd');
        
        // Use stored data if available, otherwise create empty entry
        if (carbonFootprints[dateKey]) {
          data.push(carbonFootprints[dateKey]);
        } else {
          data.push({
            date: formattedDate,
            fullDate: date,
            carbon: 0,
            promptCount: 0
          });
        }
      }
      
      setChartData(data);
    };
    
    // Update on mount
    updateChartData();
    
    // Listen for carbon updates
    window.addEventListener('carbon-updated', updateChartData);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('carbon-updated', updateChartData);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Carbon Emissions</CardTitle>
        <CardDescription>
          Track your AI carbon footprint by date
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
                formatter={(value, name, props) => {
                  if (name === 'carbon') {
                    return [`${value}g CO₂`, 'Carbon Emissions'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="carbon" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {chartData.reduce((total, day) => total + day.promptCount, 0) === 0 && (
          <div className="text-center mt-4 text-muted-foreground">
            Use the "Simulate AI Prompt" button to start tracking your carbon footprint
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FootprintChart;
