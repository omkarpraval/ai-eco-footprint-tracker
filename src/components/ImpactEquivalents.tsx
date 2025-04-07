
import React from 'react';
import { 
  Car, 
  Droplets, 
  Lightbulb, 
  Info,
  Tree,
  Sandwich
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImpactEquivalentsProps {
  totalCarbon: number;
  waterUsage: number;
  energyConsumption: number;
  isHighImpact: boolean;
}

const ImpactEquivalents: React.FC<ImpactEquivalentsProps> = ({ 
  totalCarbon, 
  waterUsage, 
  energyConsumption,
  isHighImpact
}) => {
  // Calculate real-world equivalents
  const carKilometers = (totalCarbon / 120).toFixed(2); // ~120g CO2 per km in average car
  const waterBottles = (waterUsage / 500).toFixed(2); // 500mL standard water bottle
  const ledHours = (energyConsumption / 0.01).toFixed(1); // 10W LED = 0.01 kWh per hour
  const trees = (totalCarbon / 20000).toFixed(3); // Trees absorb ~20kg CO2 per year
  const sandwiches = (totalCarbon / 200).toFixed(2); // ~200g per sandwich carbon footprint

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-green-50 p-3 rounded-lg flex items-center">
          <div className="mr-3 bg-green-100 p-2 rounded-full">
            <Car className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-green-800">Car Travel</p>
            <p className="text-green-700">= {carKilometers} km driving</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="h-3.5 w-3.5 text-green-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  Average car emits ~120g CO₂ per kilometer driven
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg flex items-center">
          <div className="mr-3 bg-blue-100 p-2 rounded-full">
            <Droplets className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-blue-800">Water Bottles</p>
            <p className="text-blue-700">= {waterBottles} bottles (500mL)</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="h-3.5 w-3.5 text-blue-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  Data centers use water for cooling. This is based on estimated water usage per token.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg flex items-center">
          <div className="mr-3 bg-amber-100 p-2 rounded-full">
            <Lightbulb className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-amber-800">10W LED Usage</p>
            <p className="text-amber-700">= {ledHours} hours</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="h-3.5 w-3.5 text-amber-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  A 10W LED bulb uses about 0.01 kWh of electricity per hour
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-teal-50 p-3 rounded-lg flex items-center">
          <div className="mr-3 bg-teal-100 p-2 rounded-full">
            <Tree className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-teal-800">Tree Absorption</p>
            <p className="text-teal-700">= {trees} tree days</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="h-3.5 w-3.5 text-teal-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  A mature tree absorbs about 20kg of CO₂ per year
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg flex items-center">
          <div className="mr-3 bg-orange-100 p-2 rounded-full">
            <Sandwich className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-orange-800">Food Equivalent</p>
            <p className="text-orange-700">= {sandwiches} sandwiches</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="h-3.5 w-3.5 text-orange-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">
                  A typical sandwich has a carbon footprint of ~200g CO₂
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isHighImpact && (
        <Alert className="bg-yellow-50 border-yellow-100">
          <AlertDescription className="text-sm text-yellow-800 flex items-center">
            <span className="bg-yellow-100 p-1 rounded-full mr-2">⚠️</span>
            This prompt may have a higher environmental impact. Consider using shorter, more concise prompts.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImpactEquivalents;
