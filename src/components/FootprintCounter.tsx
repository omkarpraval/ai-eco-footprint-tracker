
import React, { useState, useEffect } from 'react';
import { Droplets, Zap, Info, MessageSquare } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { 
  calculateCarbonFootprint, 
  calculateWaterUsage, 
  calculateEnergyConsumption,
  getCarbonComparison
} from '@/lib/carbonCalculator';
import { addCarbonToday } from './FootprintChart';

const FootprintCounter = () => {
  // State for the carbon counter
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPromptCarbon, setLastPromptCarbon] = useState(0);
  const [promptCount, setPromptCount] = useState(0);
  
  // Load saved data on component mount
  useEffect(() => {
    const savedTotalCarbon = localStorage.getItem('totalCarbon');
    const savedPromptCount = localStorage.getItem('promptCount');
    
    if (savedTotalCarbon) {
      setTotalCarbon(parseFloat(savedTotalCarbon));
    }
    
    if (savedPromptCount) {
      setPromptCount(parseInt(savedPromptCount));
    }
  }, []);
  
  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('totalCarbon', totalCarbon.toString());
    localStorage.setItem('promptCount', promptCount.toString());
  }, [totalCarbon, promptCount]);
  
  // Mock function to simulate an AI prompt
  const simulateAIPrompt = () => {
    const carbonAmount = calculateCarbonFootprint();
    setLastPromptCarbon(carbonAmount);
    setTotalCarbon(prev => {
      const newTotal = parseFloat((prev + carbonAmount).toFixed(2));
      return newTotal;
    });
    
    // Increment prompt counter
    setPromptCount(prev => prev + 1);
    
    // Add carbon to today's date for the chart
    addCarbonToday(carbonAmount);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Carbon Footprint Tracker</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Tracks the estimated CO₂ emissions from your AI interactions.</p>
                <p className="mt-2">Data centers used for AI consume energy, which can produce carbon emissions depending on the energy source.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Monitor and reduce your AI carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="text-eco-leaf text-3xl font-bold mb-1">
                  <span className={isAnimating ? "animate-count-up inline-block" : "inline-block"}>
                    {totalCarbon.toFixed(2)}
                  </span>g
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Total CO₂ Emissions
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-eco-water text-xl font-bold mb-1">
                  <Droplets className="mr-1 h-4 w-4" />
                  <span>{calculateWaterUsage(totalCarbon * 5).toFixed(1)} mL</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Estimated Water Usage
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-amber-500 text-xl font-bold mb-1">
                  <Zap className="mr-1 h-4 w-4" />
                  <span>{calculateEnergyConsumption(totalCarbon * 5).toFixed(4)} kWh</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Energy Consumption
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-indigo-500 text-xl font-bold mb-1">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{promptCount}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Total Prompts
                </div>
              </div>
            </div>
          </div>
          
          {lastPromptCarbon > 0 && (
            <div className="text-sm text-muted-foreground">
              Last AI interaction: <span className="font-medium text-foreground">{lastPromptCarbon}g CO₂</span>
            </div>
          )}
          
          {totalCarbon > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{getCarbonComparison(totalCarbon)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={simulateAIPrompt} 
          className="w-full bg-eco-leaf hover:bg-eco-leafLight"
        >
          Simulate AI Prompt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FootprintCounter;
