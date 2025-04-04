
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { getRandomEcoTip } from '@/lib/carbonCalculator';

const EcoTips = () => {
  const [tip, setTip] = useState<string>(getRandomEcoTip());
  
  // Change tip every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTip(getRandomEcoTip());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="w-full bg-gradient-to-br from-eco-leafLight/10 to-eco-waterLight/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          Eco Tip
        </CardTitle>
        <CardDescription>
          Sustainable AI usage recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-base italic">"{tip}"</div>
      </CardContent>
    </Card>
  );
};

export default EcoTips;
