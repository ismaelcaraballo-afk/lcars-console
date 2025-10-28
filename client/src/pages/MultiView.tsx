import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import all panel components
import TaskManager from "./TaskManager";
import WeatherPanel from "./WeatherPanel";
import Calendar from "./Calendar";
import Analytics from "./Analytics";
import SpacePanel from "./SpacePanel";
import TravelCalculator from "./TravelCalculator";
import NotificationsPage from "./NotificationsPage";
import TerminalCLI from "./TerminalCLI";
import AIChat from "./AIChat";

const panelComponents: Record<string, { component: React.ComponentType; title: string }> = {
  tasks: { component: TaskManager, title: "Task Manager" },
  weather: { component: WeatherPanel, title: "Weather" },
  calendar: { component: Calendar, title: "Calendar" },
  analytics: { component: Analytics, title: "Analytics" },
  space: { component: SpacePanel, title: "Space Exploration" },
  travel: { component: TravelCalculator, title: "Travel Calculator" },
  notifications: { component: NotificationsPage, title: "Notifications" },
  terminal: { component: TerminalCLI, title: "Terminal" },
  ai: { component: AIChat, title: "AI Chat" },
};

export default function MultiView() {
  const [location, setLocation] = useLocation();
  
  // Extract panels from URL query params (SSR-safe check for window)
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const urlParams = new URLSearchParams(search);
  const requestedPanels = urlParams.get("panels")?.split(",").filter(Boolean) || [];
  
  // Deduplicate and limit to max 4 panels
  const panels = [...new Set(requestedPanels)].slice(0, 4);

  // Filter out invalid panel names
  const validPanels = panels.filter(p => panelComponents[p]);

  // If no valid panels, show helpful error message
  if (validPanels.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-warning">
              {panels.length === 0 ? "No Panels Selected" : "Invalid Panels"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {panels.length === 0 
                ? "No panels were specified for multi-view mode." 
                : "The requested panels were not recognized."}
              {" "}Use voice commands like:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
              <li>"Computer show me weather and tasks"</li>
              <li>"Computer give me analytics and calendar"</li>
              <li>"Computer display weather, tasks, and analytics"</li>
            </ul>
            <Button 
              onClick={() => setLocation("/")} 
              className="mt-4"
              data-testid="button-back-to-dashboard"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine grid layout based on number of panels
  const gridClass = validPanels.length === 1 
    ? "grid-cols-1" 
    : validPanels.length === 2 
    ? "grid-cols-1 lg:grid-cols-2" 
    : validPanels.length === 3
    ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
    : "grid-cols-1 lg:grid-cols-2";

  return (
    <div className="p-4 space-y-4 h-full overflow-auto">
      {/* Header with info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary lcars-glow" data-testid="text-multiview-title">
            Multi-Panel View
          </h1>
          <p className="text-sm text-muted-foreground">
            Viewing {validPanels.length} panel{validPanels.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/")}
          data-testid="button-close-multiview"
        >
          <X className="h-4 w-4 mr-2" />
          Close Multi-View
        </Button>
      </div>

      {/* Grid of panels */}
      <div className={`grid ${gridClass} gap-4 h-[calc(100%-5rem)]`}>
        {validPanels.map((panelKey) => {
          const { component: PanelComponent, title } = panelComponents[panelKey];
          return (
            <Card 
              key={panelKey} 
              className="overflow-hidden flex flex-col lcars-scanner"
              data-testid={`panel-${panelKey}`}
            >
              <CardHeader className="border-b border-border pb-3 shrink-0">
                <CardTitle className="text-lg text-primary">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <div className="h-full">
                  <PanelComponent />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
