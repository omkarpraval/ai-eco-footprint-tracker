
import React, { useState, useEffect } from 'react';
import { Droplets, Zap, Info, MessageSquare, Link } from 'lucide-react';
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
import { AI_TOOLS, trackAIPrompt, setupAIToolsTracking } from '@/lib/aiToolsIntegration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AIToolsConnector from './AIToolsConnector';

const FootprintCounter = () => {
  // State for the carbon counter
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPromptCarbon, setLastPromptCarbon] = useState(0);
  const [promptCount, setPromptCount] = useState(0);
  const [selectedTool, setSelectedTool] = useState(AI_TOOLS[0].id);
  const [promptText, setPromptText] = useState('');
  const [totalTokens, setTotalTokens] = useState(0); // Added to track total tokens
  const { toast } = useToast();
  
  // Load saved data on component mount
  useEffect(() => {
    const savedTotalCarbon = localStorage.getItem('totalCarbon');
    const savedPromptCount = localStorage.getItem('promptCount');
    const savedTotalTokens = localStorage.getItem('totalTokens');
    
    if (savedTotalCarbon) {
      setTotalCarbon(parseFloat(savedTotalCarbon));
    }
    
    if (savedPromptCount) {
      setPromptCount(parseInt(savedPromptCount));
    }
    
    if (savedTotalTokens) {
      setTotalTokens(parseInt(savedTotalTokens));
    }
    
    // Initialize AI tools tracking
    setupAIToolsTracking();

    // Listen for external prompt events
    window.addEventListener('external-prompt-tracked', handleExternalPrompt as EventListener);
    
    return () => {
      window.removeEventListener('external-prompt-tracked', handleExternalPrompt as EventListener);
    };
  }, []);
  
  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('totalCarbon', totalCarbon.toString());
    localStorage.setItem('promptCount', promptCount.toString());
    localStorage.setItem('totalTokens', totalTokens.toString());
  }, [totalCarbon, promptCount, totalTokens]);

  // Handle external prompt tracking
  const handleExternalPrompt = (event: CustomEvent) => {
    const { tokenCount, carbonAmount } = event.detail;
    
    setLastPromptCarbon(carbonAmount);
    setTotalCarbon(prev => {
      const newTotal = parseFloat((prev + carbonAmount).toFixed(2));
      return newTotal;
    });
    
    setTotalTokens(prev => prev + tokenCount);
    setPromptCount(prev => prev + 1);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // Track a prompt with the selected AI tool
  const trackPrompt = () => {
    const carbonAmount = trackAIPrompt(selectedTool, promptText);
    setLastPromptCarbon(carbonAmount);
    setTotalCarbon(prev => {
      const newTotal = parseFloat((prev + carbonAmount).toFixed(2));
      return newTotal;
    });
    
    // Calculate tokens based on the tool used or prompt text
    const tool = AI_TOOLS.find(t => t.id === selectedTool);
    let tokenCount = 0;
    
    if (promptText) {
      // Rough estimation: ~4 chars per token
      tokenCount = Math.ceil(promptText.length / 4);
    } else if (tool) {
      tokenCount = tool.avgTokensPerPrompt;
    }
    
    // Update total tokens
    setTotalTokens(prev => prev + tokenCount);
    
    // Increment prompt counter
    setPromptCount(prev => prev + 1);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    // Clear prompt text
    setPromptText('');

    // Show success toast
    toast({
      title: "Prompt Tracked",
      description: `Added ${carbonAmount}g CO₂ from ${tool?.name}`,
    });
  };
  
  return (
    <Tabs defaultValue="track" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="track">Track Prompts</TabsTrigger>
        <TabsTrigger value="connect">Connect AI Tools</TabsTrigger>
      </TabsList>
      
      <TabsContent value="track">
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
                      <span>{calculateWaterUsage(totalTokens).toFixed(1)} mL</span>
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
                      <span>{calculateEnergyConsumption(totalTokens).toFixed(4)} kWh</span>
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
              
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Textarea
                      placeholder="Enter your AI prompt here"
                      className="min-h-[80px]"
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select
                      value={selectedTool}
                      onValueChange={setSelectedTool}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI Tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_TOOLS.map(tool => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              onClick={trackPrompt} 
              className="w-full bg-eco-leaf hover:bg-eco-leafLight"
              disabled={!promptText.trim()}
            >
              Track AI Prompt
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="connect">
        <AIToolsConnector />
      </TabsContent>
    </Tabs>
  );
};

export default FootprintCounter;
