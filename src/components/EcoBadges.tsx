
import React from 'react';
import { 
  BadgeCheck, 
  Leaf, 
  Zap, 
  Award, 
  ThumbsUp, 
  Brain,
  MessageSquare
} from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface BadgeProps {
  totalCarbon: number;
  promptCount: number;
  avgTokensPerPrompt: number;
}

const EcoBadges: React.FC<BadgeProps> = ({ totalCarbon, promptCount, avgTokensPerPrompt }) => {
  // Badge unlock criteria
  const badges = [
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Keep your carbon footprint below 5g while using AI',
      icon: <Leaf className="h-4 w-4 text-green-500" />,
      unlocked: totalCarbon < 5 && promptCount > 3,
      color: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
    },
    {
      id: 'prompt-master',
      name: 'Prompt Master',
      description: 'Craft efficient prompts using fewer tokens per prompt',
      icon: <Brain className="h-4 w-4 text-indigo-500" />,
      unlocked: avgTokensPerPrompt < 40 && promptCount > 3,
      color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200'
    },
    {
      id: 'frequency-user',
      name: 'Frequent User',
      description: 'Track 10+ AI prompts',
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      unlocked: promptCount >= 10,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'
    },
    {
      id: 'energy-saver',
      name: 'Energy Saver',
      description: 'Keep energy usage below 0.01 kWh over 5+ prompts',
      icon: <Zap className="h-4 w-4 text-amber-500" />,
      unlocked: (totalCarbon / promptCount) < 2 && promptCount > 5,
      color: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200'
    },
    {
      id: 'eco-starter',
      name: 'Eco Tracking Starter',
      description: 'Begin your journey of tracking AI carbon impact',
      icon: <ThumbsUp className="h-4 w-4 text-teal-500" />,
      unlocked: promptCount > 0,
      color: 'bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200'
    }
  ];

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  if (promptCount === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        <Award className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
        <p>Start tracking prompts to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unlockedBadges.length > 0 && (
        <>
          <h4 className="text-sm font-medium flex items-center">
            <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
            Unlocked Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.map(badge => (
              <HoverCard key={badge.id}>
                <HoverCardTrigger asChild>
                  <Badge className={`cursor-help ${badge.color}`}>
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{badge.name}</h4>
                    <p className="text-xs">{badge.description}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </>
      )}

      {lockedBadges.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-muted-foreground">Badges to Unlock</h4>
          <div className="flex flex-wrap gap-2">
            {lockedBadges.map(badge => (
              <HoverCard key={badge.id}>
                <HoverCardTrigger asChild>
                  <Badge variant="outline" className="opacity-50 cursor-help">
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{badge.name}</h4>
                    <p className="text-xs">{badge.description}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EcoBadges;
