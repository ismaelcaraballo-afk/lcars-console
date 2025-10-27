import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, Zap, Target, Activity } from "lucide-react";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow" data-testid="text-page-title">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Monitor your productivity metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success" data-testid="stat-tasks-completed">
              {stats?.tasksCompleted || 0}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-productivity-score">
              {stats?.productivityScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Current rating</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary" data-testid="stat-ai-interactions">
              {stats?.aiInteractions || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total queries</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate lcars-scanner">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commands Executed</CardTitle>
            <Terminal className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning" data-testid="stat-commands-executed">
              {stats?.commandsExecuted || 0}
            </div>
            <p className="text-xs text-muted-foreground">Terminal usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
              const value = Math.floor(Math.random() * 100);
              return (
                <div key={day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{day}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary lcars-glow"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="lcars-scanner">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <GoalProgress label="Complete 10 tasks" current={7} target={10} />
              <GoalProgress label="50 AI interactions" current={32} target={50} />
              <GoalProgress label="5 terminal commands" current={5} target={5} />
            </div>
          </CardContent>
        </Card>

        <Card className="lcars-scanner">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="font-semibold text-foreground">Task Master</div>
                  <div className="text-xs text-muted-foreground">Completed 100 tasks</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  💬
                </div>
                <div>
                  <div className="font-semibold text-foreground">AI Explorer</div>
                  <div className="text-xs text-muted-foreground">50 AI conversations</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  ⚡
                </div>
                <div>
                  <div className="font-semibold text-foreground">Power User</div>
                  <div className="text-xs text-muted-foreground">7-day streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoalProgress({ label, current, target }: { label: string; current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className={isComplete ? "text-success" : "text-muted-foreground"}>
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${isComplete ? "bg-success" : "bg-primary"} lcars-glow`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

import { Terminal } from "lucide-react";
