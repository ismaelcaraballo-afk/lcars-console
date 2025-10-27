import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Check, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";

export default function TaskManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<InsertTask>>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (task: InsertTask) => {
      return await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task created",
        description: "Your task has been added successfully.",
      });
      setDialogOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    },
  });

  // Complete task mutation
  const completeTask = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/tasks/${id}/complete`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task completed!",
        description: "Great job! Keep up the momentum.",
      });
    },
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/tasks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
  });

  const activeTasks = tasks?.filter((t) => t.status === "active") || [];

  const handleCreateTask = () => {
    if (!newTask.title?.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    createTask.mutate(newTask as InsertTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "text-foreground";
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary lcars-glow" data-testid="text-page-title">
            Task Manager
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Manage your missions and objectives
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" data-testid="button-add-task">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-task">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  data-testid="input-task-title"
                />
              </div>
              <div>
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Task description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  data-testid="input-task-description"
                />
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger id="task-priority" data-testid="select-task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  data-testid="input-task-due-date"
                />
              </div>
              <Button
                onClick={handleCreateTask}
                disabled={createTask.isPending}
                className="w-full"
                data-testid="button-submit-task"
              >
                {createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="lcars-pulse inline-block">Loading tasks...</div>
        </div>
      ) : activeTasks.length === 0 ? (
        <Card className="lcars-scanner">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground" data-testid="text-no-tasks">
              No active tasks. Great job! 🎉
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeTasks.map((task) => {
            const daysUntil = getDaysUntilDue(task.dueDate);
            const isUrgent = daysUntil <= 1;

            return (
              <Card
                key={task.id}
                className={`lcars-scanner hover-elevate ${
                  task.priority === "high" ? "border-destructive/50" : ""
                }`}
                data-testid={`task-card-${task.id}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" data-testid={`text-task-title-${task.id}`}>
                          {task.title}
                        </span>
                        <span
                          className={`text-xs font-mono ${getPriorityColor(task.priority)}`}
                          data-testid={`text-task-priority-${task.id}`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground font-normal mt-2" data-testid={`text-task-description-${task.id}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => completeTask.mutate(task.id)}
                        data-testid={`button-complete-task-${task.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteTask.mutate(task.id)}
                        data-testid={`button-delete-task-${task.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {isUrgent && <AlertCircle className="h-4 w-4 text-destructive lcars-pulse" />}
                      <span className={isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"} data-testid={`text-task-due-${task.id}`}>
                        Due in {daysUntil} {daysUntil === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
