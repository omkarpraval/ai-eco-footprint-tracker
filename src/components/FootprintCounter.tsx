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
import ImpactEquivalents from './ImpactEquivalents';
import TipsToReduce from './TipsToReduce';
import EcoBadges from './EcoBadges';
import SessionManager from './SessionManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const TOKEN_THRESHOLD_HIGH_IMPACT = 1000; // Threshold for high-impact warning

const FootprintCounter = () => {
  // State for the carbon counter
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastPromptCarbon, setLastPromptCarbon] = useState(0);
  const [promptCount, setPromptCount] = useState(0);
  const [selectedTool, setSelectedTool] = useState(AI_TOOLS[0].id);
  const [promptText, setPromptText] = useState('');
  const [totalTokens, setTotalTokens] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<{ time: string; carbon: number }[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { toast } = useToast();
  
  // Calculate derived metrics
  const waterUsage = calculateWaterUsage(totalTokens);
  const energyConsumption = calculateEnergyConsumption(totalTokens);
  const avgTokensPerPrompt = promptCount > 0 ? Math.round(totalTokens / promptCount) : 0;
  const isCurrentPromptLowImpact = promptText.length > 0 && promptText.length < 100;
  const estimatedTokens = Math.ceil(promptText.length / 4);
  const isHighImpact = estimatedTokens > TOKEN_THRESHOLD_HIGH_IMPACT;
  
  // Load saved data on component mount
  useEffect(() => {
    const savedTotalCarbon = localStorage.getItem('totalCarbon');
    const savedPromptCount = localStorage.getItem('promptCount');
    const savedTotalTokens = localStorage.getItem('totalTokens');
    const savedHistory = localStorage.getItem('sessionHistory');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTotalCarbon) {
      setTotalCarbon(parseFloat(savedTotalCarbon));
    }
    
    if (savedPromptCount) {
      setPromptCount(parseInt(savedPromptCount));
    }
    
    if (savedTotalTokens) {
      setTotalTokens(parseInt(savedTotalTokens));
    }

    if (savedHistory) {
      setSessionHistory(JSON.parse(savedHistory));
    }

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
  }, [totalCarbon, promptCount, totalTokens, sessionHistory]);

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
    updateSessionHistory(carbonAmount);
    
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
    
    // Update session history
    updateSessionHistory(carbonAmount);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    // Clear prompt text
    setPromptText('');

    // Update daily chart
    addCarbonToday(carbonAmount);

    // Show success toast
    toast({
      title: "Prompt Tracked",
      description: `Added ${carbonAmount}g CO₂ from ${tool?.name}`,
    });
  };

  // Update session history with new carbon entry
  const updateSessionHistory = (carbonAmount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSessionHistory(prev => {
      const updated = [...prev, { time: timeStr, carbon: carbonAmount }];
      // Keep only the most recent 20 entries
      if (updated.length > 20) return updated.slice(-20);
      return updated;
    });
  };

  // Reset all session data
  const resetSession = () => {
    setTotalCarbon(0);
    setPromptCount(0);
    setTotalTokens(0);
    setLastPromptCarbon(0);
    setSessionHistory([]);
    localStorage.removeItem('totalCarbon');
    localStorage.removeItem('promptCount');
    localStorage.removeItem('totalTokens');
    localStorage.removeItem('sessionHistory');
    
    toast({
      title: "Session Reset",
      description: "All tracking data has been reset successfully.",
    });
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <Tabs defaultValue="track" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="track">Track Prompts</TabsTrigger>
          <TabsTrigger value="connect">Connect AI Tools</TabsTrigger>
        </TabsList>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="text-xs"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Button>
      </div>
      
      <TabsContent value="track">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                          <span>{waterUsage.toFixed(1)} mL</span>
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
                          <span>{energyConsumption.toFixed(4)} kWh</span>
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
                        {estimatedTokens > 0 && (
                          <div className="mt-1 text-xs text-right text-muted-foreground">
                            Est. tokens: ~{estimatedTokens} {isHighImpact && <span className="text-yellow-600">⚠️ High token count</span>}
                          </div>
                        )}
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

                  {/* Real-world equivalents section */}
                  {totalCarbon > 0 && (
                    <ImpactEquivalents 
                      totalCarbon={totalCarbon}
                      waterUsage={waterUsage}
                      energyConsumption={energyConsumption}
                      isHighImpact={isHighImpact}
                    />
                  )}
                  
                  {/* Session mini-chart */}
                  {sessionHistory.length > 1 && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">Session Carbon Trend</h4>
                        <SessionManager 
                          totalCarbon={totalCarbon}
                          promptCount={promptCount}
                          totalTokens={totalTokens}
                          waterUsage={waterUsage}
                          energyConsumption={energyConsumption}
                          onReset={resetSession}
                        />
                      </div>
                      <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sessionHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                              dataKey="time" 
                              tick={{fontSize: 10}}
                              interval="preserveEnd"
                            />
                            <YAxis 
                              tick={{fontSize: 10}}
                            />
                            <RechartsTooltip
                              formatter={(value: number) => [`${value.toFixed(2)}g CO₂`, 'Carbon']}
                              labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="carbon" 
                              stroke="#4CAF50" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {/* Badges section */}
                  {promptCount > 0 && (
                    <div className="mt-2">
                      <EcoBadges
                        totalCarbon={totalCarbon}
                        promptCount={promptCount}
                        avgTokensPerPrompt={avgTokensPerPrompt}
                      />
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
          </div>
          
          {/* Tips sidebar */}
          <div>
            <TipsToReduce 
              promptText={promptText}
              isLowImpact={isCurrentPromptLowImpact}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="connect">
        <AIToolsConnector />
      </TabsContent>
    </Tabs>
  );
};

export default FootprintCounter;
