
/**
 * Constants for carbon emissions calculations
 * These are simplified estimates and can be adjusted based on more accurate data
 */
const CARBON_PER_TOKEN = 0.002; // increased from 0.0002 to be more visible
const TOKENS_PER_PROMPT = 30; // average tokens per prompt
const WATER_PER_TOKEN = 0.5; // increased from 0.1 to be more visible
const ENERGY_PER_TOKEN = 0.0005; // increased from 0.0003 to be more visible

// Model specific factors - different AI models have different efficiency
export const MODEL_FACTORS = {
  'chatgpt': { carbon: 1.0, water: 1.0, energy: 1.0 },
  'bard': { carbon: 0.9, water: 0.85, energy: 0.9 },
  'claude': { carbon: 1.1, water: 1.2, energy: 1.1 },
  'midjourney': { carbon: 2.5, water: 2.0, energy: 2.5 },
  'dall-e': { carbon: 2.2, water: 1.8, energy: 2.2 },
  'copilot': { carbon: 0.8, water: 0.7, energy: 0.8 }
};

/**
 * Calculate the carbon footprint of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @param modelType The AI model type
 * @returns Carbon footprint in grams of CO2
 */
export const calculateCarbonFootprint = (
  tokenCount = TOKENS_PER_PROMPT, 
  modelType = 'chatgpt'
): number => {
  const factor = MODEL_FACTORS[modelType as keyof typeof MODEL_FACTORS]?.carbon || 1;
  return parseFloat((tokenCount * CARBON_PER_TOKEN * factor).toFixed(2));
};

/**
 * Calculate the water usage of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @param modelType The AI model type
 * @returns Water usage in mL
 */
export const calculateWaterUsage = (
  tokenCount = TOKENS_PER_PROMPT,
  modelType = 'chatgpt'
): number => {
  const factor = MODEL_FACTORS[modelType as keyof typeof MODEL_FACTORS]?.water || 1;
  return parseFloat((tokenCount * WATER_PER_TOKEN * factor).toFixed(2));
};

/**
 * Calculate the energy consumption of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @param modelType The AI model type
 * @returns Energy consumption in kWh
 */
export const calculateEnergyConsumption = (
  tokenCount = TOKENS_PER_PROMPT,
  modelType = 'chatgpt'
): number => {
  const factor = MODEL_FACTORS[modelType as keyof typeof MODEL_FACTORS]?.energy || 1;
  return parseFloat((tokenCount * ENERGY_PER_TOKEN * factor).toFixed(4));
};

/**
 * More accurate token estimation from text
 * @param text The text to estimate tokens for
 * @returns Estimated token count
 */
export const estimateTokensFromText = (text: string): number => {
  if (!text || typeof text !== 'string') return 0;
  
  // Count words (split by spaces and remove empty entries)
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  
  // Average ratio of tokens to words (OpenAI GPT models average ~1.3 tokens per word)
  const tokenRatio = 1.3;
  
  // Check for special characters which can increase token count
  const specialChars = (text.match(/[^\w\s]/g) || []).length;
  const extraTokens = specialChars * 0.1; // Each special char adds ~0.1 extra tokens
  
  // Calculate final estimate
  const estimatedTokens = Math.ceil(words * tokenRatio + extraTokens);
  
  // Ensure at least 1 token for non-empty strings
  return text.trim() ? Math.max(1, estimatedTokens) : 0;
};

/**
 * Get a random eco tip
 * @returns A random eco tip string
 */
export const getRandomEcoTip = (): string => {
  const tips = [
    "Reduce unnecessary AI queries to save energy",
    "Use AI more efficiently by crafting detailed prompts",
    "Try batching your AI requests instead of sending many small ones",
    "Share your knowledge about AI's environmental impact",
    "Consider using AI models optimized for efficiency",
    "Offset your digital carbon footprint through tree planting",
    "Choose cloud providers that use renewable energy",
    "Prompt with purpose: make every AI interaction count",
    "Keep track of your AI usage and set reduction goals",
    "Be mindful of the compute resources your AI requests require"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

/**
 * Get a real-world comparison for the amount of CO2
 * @param grams Amount of CO2 in grams
 * @returns Comparison string
 */
export const getCarbonComparison = (grams: number): string => {
  if (grams < 10) {
    return `Equivalent to charging your smartphone ${Math.round(grams / 0.5)} times`;
  } else if (grams < 100) {
    return `Like driving a car for about ${Math.round(grams / 20)} minutes`;
  } else {
    return `Similar to the carbon footprint of a ${Math.round(grams / 100)}km car journey`;
  }
};

/**
 * Calculate car driving distance equivalent
 * @param carbonGrams CO2 in grams
 * @returns Distance in kilometers
 */
export const calculateCarDistanceEquivalent = (carbonGrams: number): number => {
  // Average car emits ~120g CO2 per km
  return parseFloat((carbonGrams / 120).toFixed(2));
};

/**
 * Calculate water bottles equivalent
 * @param waterMl Water usage in ml
 * @returns Number of standard 500ml water bottles
 */
export const calculateWaterBottlesEquivalent = (waterMl: number): number => {
  // Standard water bottle is 500ml
  return parseFloat((waterMl / 500).toFixed(2));
};

/**
 * Calculate LED bulb hours equivalent
 * @param energyKwh Energy in kWh
 * @returns Hours a 10W LED bulb could run
 */
export const calculateLEDHoursEquivalent = (energyKwh: number): number => {
  // 10W LED uses 0.01 kWh per hour
  return parseFloat((energyKwh / 0.01).toFixed(1));
};
