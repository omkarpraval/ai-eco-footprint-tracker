
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  LinkIcon, 
  Unlink, 
  ExternalLink,
  SendIcon
} from 'lucide-react';
import { AI_TOOLS, connectAITool, disconnectAITool, simulateExternalAIPrompt } from '@/lib/aiToolsIntegration';
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AIToolsConnector = () => {
  const [tools, setTools] = useState([...AI_TOOLS]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [simulationText, setSimulationText] = useState("");
  const { toast } = useToast();

  // Update tools state when connection status changes
  useEffect(() => {
    const handleConnectionUpdate = () => {
      setTools([...AI_TOOLS]);
    };

    window.addEventListener('connection-updated', handleConnectionUpdate);
    
    return () => {
      window.removeEventListener('connection-updated', handleConnectionUpdate);
    };
  }, []);

  const handleConnect = (toolId: string) => {
    const success = connectAITool(toolId);
    if (success) {
      // Refresh the tools list
      setTools([...AI_TOOLS]);
    }
  };

  const handleDisconnect = (toolId: string) => {
    const success = disconnectAITool(toolId);
    if (success) {
      // Refresh the tools list
      setTools([...AI_TOOLS]);
    }
  };

  const handleSimulatePrompt = () => {
    if (!selectedTool) {
      toast({
        title: "Error",
        description: "Please select an AI tool first",
        variant: "destructive",
      });
      return;
    }

    if (!simulationText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for the prompt",
        variant: "destructive",
      });
      return;
    }

    simulateExternalAIPrompt(selectedTool, simulationText);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connect AI Tools</CardTitle>
        <CardDescription>
          Connect to your favorite AI tools to track your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    id={`switch-${tool.id}`}
                    checked={tool.isConnected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleConnect(tool.id);
                      } else {
                        handleDisconnect(tool.id);
                      }
                    }}
                  />
                  <Label htmlFor={`switch-${tool.id}`} className="font-medium">
                    {tool.name}
                  </Label>
                </div>
                {tool.isConnected ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTool(tool.id);
                            toast({
                              title: "Tool Selected",
                              description: `You can now simulate prompts from ${tool.name}`,
                            });
                          }}
                          className={selectedTool === tool.id ? "bg-muted" : ""}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {selectedTool === tool.id ? "Selected" : "Select"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select this tool to simulate prompts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="text-xs text-muted-foreground">Not connected</div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <div className="mb-2 text-sm font-medium">Simulate Prompt from Selected Tool</div>
            <div className="space-y-2">
              <Textarea
                placeholder="Enter a prompt to simulate..."
                value={simulationText}
                onChange={(e) => setSimulationText(e.target.value)}
                disabled={!selectedTool}
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleSimulatePrompt}
                disabled={!selectedTool || !simulationText.trim()}
                className="w-full"
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Simulate Prompt
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>For full integration, install our browser extension (coming soon)</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIToolsConnector;
