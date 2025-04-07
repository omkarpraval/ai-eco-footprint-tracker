
import React from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Lightbulb, 
  Info 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface TipsToReduceProps {
  promptText: string;
  isLowImpact: boolean;
}

const TipsToReduce: React.FC<TipsToReduceProps> = ({ promptText, isLowImpact }) => {
  // Tips for reducing environmental impact
  const tips = [
    {
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      title: "Use Concise Prompts",
      description: "Keep your prompts short and specific. Every token has an environmental cost."
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      title: "Reuse Prompts",
      description: "Instead of typing similar prompts multiple times, modify and reuse previous ones."
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      title: "Batch Your Requests",
      description: "Instead of many small queries, combine them into one comprehensive prompt."
    },
    {
      icon: <Info className="h-4 w-4 text-purple-500" />,
      title: "Use More Efficient Models",
      description: "Choose smaller, more efficient AI models when your task doesn't require the largest ones."
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          Tips to Reduce Impact
        </CardTitle>
        <CardDescription>
          Simple ways to minimize your AI carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLowImpact && promptText.trim().length > 0 && (
          <div className="bg-green-50 p-3 mb-4 rounded-lg flex items-center">
            <Leaf className="h-4 w-4 mr-2 text-green-600" />
            <p className="text-sm text-green-700">
              Your prompt is concise and eco-friendly! 🌿
            </p>
          </div>
        )}
        
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex">
              <div className="mt-0.5 mr-2">
                {tip.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TipsToReduce;
