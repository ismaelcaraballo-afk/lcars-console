import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Import all LCARS Console pages
import Dashboard from "@/pages/Dashboard";
import TaskManager from "@/pages/TaskManager";
import WeatherPanel from "@/pages/WeatherPanel";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import SpacePanel from "@/pages/SpacePanel";
import TravelCalculator from "@/pages/TravelCalculator";
import NotificationsPage from "@/pages/NotificationsPage";
import TerminalCLI from "@/pages/TerminalCLI";
import AIChat from "@/pages/AIChat";
import Settings from "@/pages/Settings";
import MultiView from "@/pages/MultiView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={TaskManager} />
      <Route path="/weather" component={WeatherPanel} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/space" component={SpacePanel} />
      <Route path="/travel" component={TravelCalculator} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/terminal" component={TerminalCLI} />
      <Route path="/ai" component={AIChat} />
      <Route path="/settings" component={Settings} />
      <Route path="/multi-view" component={MultiView} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Custom sidebar width for LCARS interface
  const style = {
    "--sidebar-width": "16rem", // 256px for LCARS menu
    "--sidebar-width-icon": "4rem",
  };

  // Voice recognition integration - Enhanced AI-powered command processing
  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Task creation commands
    if (lowerCommand.includes("add task") || lowerCommand.includes("create task") || lowerCommand.includes("new task")) {
      let taskTitle = "";
      
      if (lowerCommand.includes("add task")) {
        taskTitle = command.substring(command.toLowerCase().indexOf("add task") + 8).trim();
      } else if (lowerCommand.includes("create task")) {
        taskTitle = command.substring(command.toLowerCase().indexOf("create task") + 11).trim();
      } else if (lowerCommand.includes("new task")) {
        taskTitle = command.substring(command.toLowerCase().indexOf("new task") + 8).trim();
      }
      
      if (taskTitle) {
        try {
          await apiRequest("POST", "/api/tasks", {
            title: taskTitle,
            description: "",
            priority: "medium",
            status: "active",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          });
          
          // Invalidate tasks cache to refresh the UI
          await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
          
          setLocation("/tasks");
          toast({ 
            title: "✅ Task Created", 
            description: `Added: "${taskTitle}"`,
          });
        } catch (error) {
          console.error("Voice task creation error:", error);
          toast({ 
            title: "Error", 
            description: "Failed to create task via voice command",
            variant: "destructive"
          });
        }
      } else {
        toast({ 
          title: "Invalid Command", 
          description: 'Say "Computer, add task [task name]"',
          variant: "destructive"
        });
      }
      return;
    }
    
    // Captain quote commands (Star Trek Easter eggs!)
    const captainCommands = ["spock", "picard", "sisko", "janeway", "archer", "mariner"];
    for (const captain of captainCommands) {
      if (lowerCommand.includes(captain)) {
        setLocation("/terminal");
        toast({ 
          title: "🖖 Captain Quote", 
          description: `Opening Terminal for ${captain.charAt(0).toUpperCase() + captain.slice(1)} quote...`
        });
        // Store command for terminal to execute
        sessionStorage.setItem("terminalCommand", captain);
        return;
      }
    }
    
    // Detect multiple panel requests for multi-view
    const panelKeywords = [
      { keyword: "task", panel: "tasks" },
      { keyword: "weather", panel: "weather" },
      { keyword: "calendar", panel: "calendar" },
      { keyword: "analytics", panel: "analytics" },
      { keyword: "space", panel: "space" },
      { keyword: "travel", panel: "travel" },
      { keyword: "notification", panel: "notifications" },
      { keyword: "terminal", panel: "terminal" },
      { keyword: "ai", panel: "ai" },
    ];
    
    const detectedPanels: string[] = [];
    panelKeywords.forEach(({ keyword, panel }) => {
      if (lowerCommand.includes(keyword)) {
        detectedPanels.push(panel);
      }
    });
    
    // If 2 or more panels detected, use multi-view (deduplicate and limit to 4)
    if (detectedPanels.length >= 2) {
      const uniquePanels = [...new Set(detectedPanels)].slice(0, 4);
      const panelsParam = uniquePanels.join(",");
      setLocation(`/multi-view?panels=${panelsParam}`);
      toast({ 
        title: "Multi-Panel View", 
        description: `Opening ${uniquePanels.length} panels: ${uniquePanels.join(", ")}`
      });
      return;
    }
    
    // Navigation commands (simple panel switching)
    // Support both "open/show [panel]" and just "[panel]" for convenience
    if (lowerCommand.includes("dashboard") || lowerCommand.includes("home")) {
      setLocation("/");
      toast({ title: "Voice Command", description: "Opening Dashboard" });
      return;
    } else if (lowerCommand.includes("task")) {
      setLocation("/tasks");
      toast({ title: "Voice Command", description: "Opening Task Manager" });
      return;
    } else if (lowerCommand.includes("calendar")) {
      setLocation("/calendar");
      toast({ title: "Voice Command", description: "Opening Calendar" });
      return;
    } else if (lowerCommand.includes("analytics")) {
      setLocation("/analytics");
      toast({ title: "Voice Command", description: "Opening Analytics" });
      return;
    } else if (lowerCommand.includes("space")) {
      setLocation("/space");
      toast({ title: "Voice Command", description: "Opening Space Panel" });
      return;
    } else if (lowerCommand.includes("travel") || lowerCommand.includes("route")) {
      setLocation("/travel");
      toast({ title: "Voice Command", description: "Opening Travel Calculator" });
      return;
    } else if (lowerCommand.includes("notification")) {
      setLocation("/notifications");
      toast({ title: "Voice Command", description: "Opening Notifications" });
      return;
    } else if (lowerCommand.includes("terminal") || lowerCommand.includes("console")) {
      setLocation("/terminal");
      toast({ title: "Voice Command", description: "Opening Terminal" });
      return;
    } else if (lowerCommand.includes("settings")) {
      setLocation("/settings");
      toast({ title: "Voice Command", description: "Opening Settings" });
      return;
    } else if (lowerCommand.includes("weather")) {
      setLocation("/weather");
      toast({ 
        title: "🌤️ Weather Request", 
        description: "Opening Weather Panel with current conditions"
      });
      return;
    }
    // AI queries - Send everything else to AI Chat
    else {
      setLocation("/ai");
      toast({ 
        title: "🤖 Processing with AI", 
        description: "Opening AI Chat to answer your question..."
      });
      
      // Store the voice command in sessionStorage for AI Chat to pick up
      sessionStorage.setItem("voiceCommand", command);
    }
  };

  const voice = useVoiceRecognition(handleVoiceCommand);

  // Play LCARS startup beep on mount
  useEffect(() => {
    playBeep(600);
    setTimeout(() => playBeep(800), 100);
    
    // Show voice activation hint
    if (voice.isSupported) {
      setTimeout(() => {
        toast({
          title: "🎤 Voice Control Available",
          description: 'Click the microphone or say "Computer" followed by a command',
        });
      }, 2000);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="starfield" />
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-2 border-b border-border bg-sidebar/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" className="hover-elevate active-elevate-2" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success lcars-pulse" data-testid="status-indicator" />
                    <span className="text-xs text-muted-foreground font-mono" data-testid="text-status">
                      SYSTEMS ONLINE
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock />
                  <StarDate />
                  {voice.isSupported && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant={voice.isListening ? "default" : "ghost"}
                          onClick={voice.isListening ? voice.stopListening : voice.startListening}
                          className={voice.isListening ? "lcars-pulse" : ""}
                          data-testid="button-voice-toggle"
                        >
                          {voice.isListening ? (
                            <Mic className="h-4 w-4" />
                          ) : (
                            <MicOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{voice.isListening ? "Voice Active - Say 'Computer...'" : "Activate Voice Control"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </header>
              <main className="flex-1 overflow-auto bg-background">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Clock component
function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-sm font-mono text-primary" data-testid="text-clock">
      {time}
    </span>
  );
}

// StarDate component (Star Trek style)
function StarDate() {
  const [stardate, setStardate] = useState("");

  useEffect(() => {
    const updateStardate = () => {
      const now = Date.now();
      const currentStardate = (41000.0 + (now % 31536000000) / 31536000).toFixed(2);
      setStardate(currentStardate);
    };
    updateStardate();
    const interval = setInterval(updateStardate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-xs font-mono text-secondary" data-testid="text-stardate">
      SD: {stardate}
    </span>
  );
}

// LCARS beep sound (using Web Audio API)
function playBeep(frequency: number, duration: number = 50) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    // Silently fail if Web Audio API not supported
    console.debug("Audio not supported");
  }
}

// Make playBeep globally available
(window as any).playBeep = playBeep;
