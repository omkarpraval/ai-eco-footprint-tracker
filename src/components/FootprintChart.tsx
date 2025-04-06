
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, addDays, isAfter, isBefore, startOfToday } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  // Track the current date range we're viewing
  const [currentStartDate, setCurrentStartDate] = useState(subDays(new Date(), 6));
  
  // Update chart data when date range changes or when carbon is updated
  useEffect(() => {
    const updateChartData = () => {
      const data: DailyFootprint[] = [];
      
      // Generate data for the current 7-day window
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentStartDate, i);
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
    
    // Update when dates change
    updateChartData();
    
    // Listen for carbon updates
    window.addEventListener('carbon-updated', updateChartData);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('carbon-updated', updateChartData);
    };
  }, [currentStartDate]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentStartDate(prevDate => subDays(prevDate, 7));
  };

  // Navigate to next week, but not beyond today
  const goToNextWeek = () => {
    const potentialNextDate = addDays(currentStartDate, 7);
    const today = startOfToday();
    
    // Only allow navigation up to current week
    if (!isAfter(potentialNextDate, today)) {
      setCurrentStartDate(potentialNextDate);
    }
  };

  // Check if we can go forward (not beyond current week)
  const canGoForward = () => {
    const nextWeekStart = addDays(currentStartDate, 7);
    const today = startOfToday();
    return isBefore(nextWeekStart, today);
  };

  // Format date range for display
  const dateRangeText = `${format(currentStartDate, 'MMM dd')} - ${format(addDays(currentStartDate, 6), 'MMM dd, yyyy')}`;

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
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center font-medium">{dateRangeText}</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={goToPreviousWeek} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={goToNextWeek} 
                className={!canGoForward() ? "opacity-50 cursor-not-allowed" : ""}
                aria-disabled={!canGoForward()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export default FootprintChart;
