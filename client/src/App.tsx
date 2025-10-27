import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
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

  // Voice recognition integration
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Panel navigation commands
    if (lowerCommand.includes("dashboard") || lowerCommand.includes("home")) {
      setLocation("/");
      toast({ title: "Voice Command", description: "Opening Dashboard" });
    } else if (lowerCommand.includes("task")) {
      setLocation("/tasks");
      toast({ title: "Voice Command", description: "Opening Task Manager" });
    } else if (lowerCommand.includes("weather")) {
      setLocation("/weather");
      toast({ title: "Voice Command", description: "Opening Weather Panel" });
    } else if (lowerCommand.includes("calendar")) {
      setLocation("/calendar");
      toast({ title: "Voice Command", description: "Opening Calendar" });
    } else if (lowerCommand.includes("analytics")) {
      setLocation("/analytics");
      toast({ title: "Voice Command", description: "Opening Analytics" });
    } else if (lowerCommand.includes("space")) {
      setLocation("/space");
      toast({ title: "Voice Command", description: "Opening Space Panel" });
    } else if (lowerCommand.includes("travel") || lowerCommand.includes("route")) {
      setLocation("/travel");
      toast({ title: "Voice Command", description: "Opening Travel Calculator" });
    } else if (lowerCommand.includes("notification")) {
      setLocation("/notifications");
      toast({ title: "Voice Command", description: "Opening Notifications" });
    } else if (lowerCommand.includes("terminal") || lowerCommand.includes("console")) {
      setLocation("/terminal");
      toast({ title: "Voice Command", description: "Opening Terminal" });
    } else if (lowerCommand.includes("ai") || lowerCommand.includes("chat")) {
      setLocation("/ai");
      toast({ title: "Voice Command", description: "Opening AI Chat" });
    } else if (lowerCommand.includes("settings")) {
      setLocation("/settings");
      toast({ title: "Voice Command", description: "Opening Settings" });
    } else {
      toast({ 
        title: "Voice Command Not Recognized", 
        description: `Try: "Computer, open dashboard" or "Computer, show tasks"`,
        variant: "destructive"
      });
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
