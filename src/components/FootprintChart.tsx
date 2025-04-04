
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Example data - in a real extension, this would be based on actual usage
const data = [
  { name: 'Mon', carbon: 4.2 },
  { name: 'Tue', carbon: 5.8 },
  { name: 'Wed', carbon: 3.5 },
  { name: 'Thu', carbon: 6.1 },
  { name: 'Fri', carbon: 4.7 },
  { name: 'Sat', carbon: 2.3 },
  { name: 'Sun', carbon: 1.9 },
];

const FootprintChart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Carbon Emissions</CardTitle>
        <CardDescription>
          Visualize your AI carbon footprint over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'CO₂ (g)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value}g CO₂`, 'Carbon Emissions']}
                labelFormatter={(label) => `Day: ${label}`}
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
