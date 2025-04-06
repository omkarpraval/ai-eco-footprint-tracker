
import { addCarbonToday } from '@/components/FootprintChart';
import { calculateCarbonFootprint } from './carbonCalculator';
import { toast } from "@/hooks/use-toast";

// This is a list of common AI tools that could be integrated
export const AI_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', avgTokensPerPrompt: 50, isConnected: false },
  { id: 'bard', name: 'Google Bard', avgTokensPerPrompt: 45, isConnected: false },
  { id: 'claude', name: 'Claude', avgTokensPerPrompt: 55, isConnected: false },
  { id: 'midjourney', name: 'Midjourney', avgTokensPerPrompt: 120, isConnected: false },
  { id: 'dall-e', name: 'DALL-E', avgTokensPerPrompt: 150, isConnected: false },
  { id: 'copilot', name: 'GitHub Copilot', avgTokensPerPrompt: 60, isConnected: false },
];

// Keep track of total tokens used in this session
let sessionTotalTokens = 0;

// Initialize tools connection status from localStorage
export const initializeToolsConnectionStatus = (): void => {
  const storedConnections = localStorage.getItem('aiToolConnections');
  
  if (storedConnections) {
    const connections = JSON.parse(storedConnections);
    
    AI_TOOLS.forEach(tool => {
      if (connections[tool.id] !== undefined) {
        tool.isConnected = connections[tool.id];
      }
    });
  }
};

// Save connection status to localStorage
export const saveConnectionStatus = (): void => {
  const connections: Record<string, boolean> = {};
  
  AI_TOOLS.forEach(tool => {
    connections[tool.id] = tool.isConnected;
  });
  
  localStorage.setItem('aiToolConnections', JSON.stringify(connections));
};

// Connect to an AI tool
export const connectAITool = (toolId: string): boolean => {
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool ${toolId} not found`);
    return false;
  }
  
  // In a real implementation, this would trigger browser extension authorization
  // For now, we'll simulate a successful connection
  tool.isConnected = true;
  saveConnectionStatus();
  
  toast({
    title: "Tool Connected",
    description: `Successfully connected to ${tool.name}`,
  });
  
  return true;
};

// Disconnect from an AI tool
export const disconnectAITool = (toolId: string): boolean => {
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool ${toolId} not found`);
    return false;
  }
  
  tool.isConnected = false;
  saveConnectionStatus();
  
  toast({
    title: "Tool Disconnected",
    description: `Disconnected from ${tool.name}`,
  });
  
  return true;
};

// Mock function to simulate tracking a prompt from a specific AI tool
export const trackAIPrompt = (
  toolId: string, 
  promptText: string = "",
  customTokenCount?: number
): number => {
  // Find the tool
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool ${toolId} not found`);
    return 0;
  }
  
  // Calculate tokens - in a real integration, this would be provided by the API
  // Here we're either using a custom count, the tool's average, or estimating from text
  let tokenCount = customTokenCount;
  
  if (!tokenCount) {
    if (promptText) {
      // Very rough estimation: ~4 chars per token
      tokenCount = Math.ceil(promptText.length / 4);
    } else {
      tokenCount = tool.avgTokensPerPrompt;
    }
  }
  
  // Track session tokens
  sessionTotalTokens += tokenCount;
  
  // Calculate carbon footprint
  const carbonAmount = calculateCarbonFootprint(tokenCount);
  
  // Log the event
  console.log(`Tracked ${tokenCount} tokens from ${tool.name}, adding ${carbonAmount}g CO₂`);
  
  // Add to today's footprint
  addCarbonToday(carbonAmount);
  
  return carbonAmount;
};

// Function to get the total tokens used in this session
export const getSessionTotalTokens = (): number => {
  return sessionTotalTokens;
};

// Function to set up listeners for common AI tools (in production, this would integrate with browser extensions)
export const setupAIToolsTracking = (): void => {
  // Initialize connection status
  initializeToolsConnectionStatus();
  
  // This is a placeholder for real API integrations
  // In a production app, you'd use browser extensions or API integrations
  console.log("AI Tools tracking initialized");
  
  // Example: listen for a custom event that could be triggered by extensions
  window.addEventListener('ai-tool-used', ((event: CustomEvent) => {
    const { toolId, promptText, tokenCount } = event.detail;
    trackAIPrompt(toolId, promptText, tokenCount);
  }) as EventListener);
};

// Simulate an AI prompt from a connected tool (this would normally come from an extension)
export const simulateExternalAIPrompt = (toolId: string, promptText: string): void => {
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool ${toolId} not found`);
    return;
  }
  
  if (!tool.isConnected) {
    toast({
      title: "Tool Not Connected",
      description: `${tool.name} is not connected. Please connect it first.`,
      variant: "destructive",
    });
    return;
  }
  
  const tokenCount = Math.ceil(promptText.length / 4);
  const carbonAmount = trackAIPrompt(toolId, promptText, tokenCount);
  
  toast({
    title: `${tool.name} Used`,
    description: `Tracked ${tokenCount} tokens, adding ${carbonAmount}g CO₂`,
  });
  
  // Dispatch an event to notify components
  window.dispatchEvent(new CustomEvent('external-prompt-tracked', {
    detail: { 
      toolId, 
      promptText, 
      tokenCount, 
      carbonAmount
    }
  }));
};
