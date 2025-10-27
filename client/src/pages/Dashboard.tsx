import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar as CalendarIcon, Cloud, Rocket, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");

  // Fetch quick stats
  const { data: tasksStats } = useQuery({
    queryKey: ["/api/tasks/stats"],
  });

  const { data: weatherData } = useQuery({
    queryKey: ["/api/weather/current"],
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary lcars-glow" data-testid="text-greeting">
          {greeting}, Commander
        </h1>
        <p className="text-muted-foreground" data-testid="text-welcome-message">
          Welcome to your LCARS AI Console. All systems operational.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-active-tasks">
              {tasksStats?.activeTasks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {tasksStats?.completedToday || 0} completed today
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <Activity className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary" data-testid="stat-productivity">
              {tasksStats?.productivityScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Based on task completion</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather</CardTitle>
            <Cloud className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success" data-testid="stat-temperature">
              {weatherData?.temp || "--"}°
            </div>
            <p className="text-xs text-muted-foreground">
              {weatherData?.condition || "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Today</CardTitle>
            <CalendarIcon className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning" data-testid="stat-events-today">
              0
            </div>
            <p className="text-xs text-muted-foreground">No events scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" asChild data-testid="button-quick-add-task">
            <a href="/tasks">Add Task</a>
          </Button>
          <Button variant="secondary" size="sm" asChild data-testid="button-quick-check-weather">
            <a href="/weather">Check Weather</a>
          </Button>
          <Button variant="outline" size="sm" asChild data-testid="button-quick-view-calendar">
            <a href="/calendar">View Calendar</a>
          </Button>
          <Button variant="outline" size="sm" asChild data-testid="button-quick-ai-chat">
            <a href="/ai">AI Assistant</a>
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <StatusIndicator label="Core Systems" status="OPTIMAL" color="success" />
            <StatusIndicator label="AI Module" status="READY" color="primary" />
            <StatusIndicator label="Data Storage" status="NOMINAL" color="success" />
            <StatusIndicator label="Network" status="CONNECTED" color="success" />
            <StatusIndicator label="Sensors" status="ACTIVE" color="warning" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: "success" | "warning" | "primary";
}) {
  const colorClasses = {
    success: "text-success",
    warning: "text-warning",
    primary: "text-primary",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <span className="text-sm text-foreground">{label}</span>
      <span className={`text-sm font-mono font-semibold ${colorClasses[color]}`}>{status}</span>
    </div>
  );
}
