
import { calculateCarbonFootprint, estimateTokensFromText } from './carbonCalculator';
import { useToast } from "@/hooks/use-toast";

// Define AI tools data
export const AI_TOOLS = [
  { 
    id: 'chatgpt', 
    name: 'ChatGPT', 
    avgTokensPerPrompt: 50,
    tokensPerChar: 0.25, // ~4 chars per token
    isConnected: false,
    efficiency: 'medium' // Scale: low, medium, high
  },
  { 
    id: 'bard', 
    name: 'Google Bard',
    avgTokensPerPrompt: 45,
    tokensPerChar: 0.20, // ~5 chars per token (more efficient tokenization)
    isConnected: false,
    efficiency: 'medium-high'
  },
  { 
    id: 'claude', 
    name: 'Claude',
    avgTokensPerPrompt: 55,
    tokensPerChar: 0.22, // ~4.5 chars per token
    isConnected: false,
    efficiency: 'medium'
  },
  { 
    id: 'midjourney', 
    name: 'Midjourney',
    avgTokensPerPrompt: 120,
    tokensPerChar: 0.30, // Image generation needs more processing
    isConnected: false,
    efficiency: 'low'
  },
  { 
    id: 'dall-e', 
    name: 'DALL-E',
    avgTokensPerPrompt: 150,
    tokensPerChar: 0.33, // Image generation needs more processing
    isConnected: false,
    efficiency: 'low'
  },
  { 
    id: 'copilot', 
    name: 'GitHub Copilot',
    avgTokensPerPrompt: 60,
    tokensPerChar: 0.25, // ~4 chars per token
    isConnected: false,
    efficiency: 'high'
  },
];

/**
 * Track carbon from an AI prompt
 * @param toolId ID of the AI tool used
 * @param promptText Optional prompt text (for token estimation)
 * @param customTokenCount Optional token count override
 * @returns Carbon footprint in grams
 */
export const trackAIPrompt = (
  toolId: string, 
  promptText?: string, 
  customTokenCount?: number
): number => {
  // Find the selected tool
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool with ID ${toolId} not found`);
    return 0;
  }
  
  // Calculate token count
  let tokenCount = customTokenCount;

  if (!tokenCount) {
    if (promptText) {
      // Use more accurate token estimator
      tokenCount = estimateTokensFromText(promptText);
    } else {
      tokenCount = tool.avgTokensPerPrompt;
    }
  }
  
  // Calculate carbon footprint
  const carbonAmount = calculateCarbonFootprint(tokenCount, tool.id);
  
  // Log the tracking for debugging
  console.log(`Tracked ${tokenCount} tokens from ${tool.name}: ${carbonAmount}g CO₂`);
  
  return carbonAmount;
};

/**
 * Connect to an AI tool
 * @param toolId ID of the tool to connect
 * @returns Success status
 */
export const connectAITool = (toolId: string): boolean => {
  const toolIndex = AI_TOOLS.findIndex(t => t.id === toolId);
  
  if (toolIndex === -1) {
    console.error(`Tool with ID ${toolId} not found`);
    return false;
  }
  
  // Update tool connection status
  AI_TOOLS[toolIndex].isConnected = true;
  
  // Trigger a custom event
  window.dispatchEvent(new CustomEvent('connection-updated'));
  console.log(`Connected to ${AI_TOOLS[toolIndex].name}`);
  
  return true;
};

/**
 * Disconnect from an AI tool
 * @param toolId ID of the tool to disconnect
 * @returns Success status
 */
export const disconnectAITool = (toolId: string): boolean => {
  const toolIndex = AI_TOOLS.findIndex(t => t.id === toolId);
  
  if (toolIndex === -1) {
    console.error(`Tool with ID ${toolId} not found`);
    return false;
  }
  
  // Update tool connection status
  AI_TOOLS[toolIndex].isConnected = false;
  
  // Trigger a custom event
  window.dispatchEvent(new CustomEvent('connection-updated'));
  console.log(`Disconnected from ${AI_TOOLS[toolIndex].name}`);
  
  return true;
};

/**
 * Set up listeners for AI tools
 */
export const setupAIToolsTracking = (): void => {
  console.log('Setting up AI tools tracking...');
  
  // Here you would typically set up event listeners or connections
  // to real AI tools. For this simulation, we'll just log.
};

/**
 * Simulate an external AI prompt (e.g. from browser extension)
 * @param toolId ID of the tool used
 * @param promptText The prompt text
 */
export const simulateExternalAIPrompt = (
  toolId: string, 
  promptText: string
): void => {
  // Find the selected tool
  const tool = AI_TOOLS.find(t => t.id === toolId);
  
  if (!tool) {
    console.error(`Tool with ID ${toolId} not found`);
    return;
  }
  
  if (!tool.isConnected) {
    console.error(`Tool ${tool.name} is not connected`);
    return;
  }
  
  // Calculate token count using our more accurate estimator
  const tokenCount = estimateTokensFromText(promptText);
  
  // Calculate carbon footprint
  const carbonAmount = calculateCarbonFootprint(tokenCount, tool.id);
  
  // Dispatch an event that our FootprintCounter can listen for
  const event = new CustomEvent('external-prompt-tracked', {
    detail: {
      toolId,
      toolName: tool.name,
      promptText,
      tokenCount,
      carbonAmount
    }
  });
  
  window.dispatchEvent(event);
  console.log(`External prompt tracked from ${tool.name}: ${carbonAmount}g CO₂`);
};
