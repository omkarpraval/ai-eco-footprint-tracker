
import { addCarbonToday } from '@/components/FootprintChart';
import { calculateCarbonFootprint } from './carbonCalculator';

// This is a list of common AI tools that could be integrated
export const AI_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', avgTokensPerPrompt: 50 },
  { id: 'bard', name: 'Google Bard', avgTokensPerPrompt: 45 },
  { id: 'claude', name: 'Claude', avgTokensPerPrompt: 55 },
  { id: 'midjourney', name: 'Midjourney', avgTokensPerPrompt: 120 },
  { id: 'dall-e', name: 'DALL-E', avgTokensPerPrompt: 150 },
  { id: 'copilot', name: 'GitHub Copilot', avgTokensPerPrompt: 60 },
];

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
  
  // Calculate carbon footprint
  const carbonAmount = calculateCarbonFootprint(tokenCount);
  
  // Log the event
  console.log(`Tracked ${tokenCount} tokens from ${tool.name}, adding ${carbonAmount}g CO₂`);
  
  // Add to today's footprint
  addCarbonToday(carbonAmount);
  
  return carbonAmount;
};

// Function to set up listeners for common AI tools (in production, this would integrate with browser extensions)
export const setupAIToolsTracking = (): void => {
  // This is a placeholder for real API integrations
  // In a production app, you'd use browser extensions or API integrations
  console.log("AI Tools tracking initialized");
  
  // Example: listen for a custom event that could be triggered by extensions
  window.addEventListener('ai-tool-used', ((event: CustomEvent) => {
    const { toolId, promptText, tokenCount } = event.detail;
    trackAIPrompt(toolId, promptText, tokenCount);
  }) as EventListener);
};
