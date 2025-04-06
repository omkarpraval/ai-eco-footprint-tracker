
/**
 * Constants for carbon emissions calculations
 * These are simplified estimates and can be adjusted based on more accurate data
 */
const CARBON_PER_TOKEN = 0.002; // increased from 0.0002 to be more visible
const TOKENS_PER_PROMPT = 30; // average tokens per prompt
const WATER_PER_TOKEN = 0.5; // increased from 0.1 to be more visible
const ENERGY_PER_TOKEN = 0.0005; // increased from 0.0003 to be more visible

/**
 * Calculate the carbon footprint of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @returns Carbon footprint in grams of CO2
 */
export const calculateCarbonFootprint = (tokenCount = TOKENS_PER_PROMPT): number => {
  return parseFloat((tokenCount * CARBON_PER_TOKEN).toFixed(2));
};

/**
 * Calculate the water usage of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @returns Water usage in mL
 */
export const calculateWaterUsage = (tokenCount = TOKENS_PER_PROMPT): number => {
  return parseFloat((tokenCount * WATER_PER_TOKEN).toFixed(2));
};

/**
 * Calculate the energy consumption of an AI prompt
 * @param tokenCount Optional token count (defaults to average)
 * @returns Energy consumption in kWh
 */
export const calculateEnergyConsumption = (tokenCount = TOKENS_PER_PROMPT): number => {
  return parseFloat((tokenCount * ENERGY_PER_TOKEN).toFixed(4));
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
