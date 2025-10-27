import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { getCurrentWeather } from "./services/weather";
import { getNASAAPOD } from "./services/nasa";
import { getISSLocation } from "./services/iss";
import { chatWithClaude } from "./services/ai";
import { calculateRoute } from "./services/maps";
import { insertTaskSchema, insertCalendarEventSchema, insertNotificationSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  // ========================================
  // TASKS API
  // ========================================
  
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/stats", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      const activeTasks = tasks.filter((t) => t.status === "active");
      const completed = tasks.filter((t) => t.status === "completed");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const completedToday = completed.filter((t) => 
        t.completedAt && new Date(t.completedAt) >= today
      );

      const productivityScore = tasks.length > 0 
        ? Math.round((completed.length / tasks.length) * 100)
        : 0;

      res.json({
        activeTasks: activeTasks.length,
        completedTasks: completed.length,
        completedToday: completedToday.length,
        productivityScore,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task stats" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.completeTask(id);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ========================================
  // CALENDAR API
  // ========================================

  app.get("/api/calendar/events", async (req, res) => {
    try {
      const events = await storage.getCalendarEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar/events", async (req, res) => {
    try {
      const validatedData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/calendar/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCalendarEvent(id);
      
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // ========================================
  // WEATHER API (Open-Meteo)
  // ========================================

  app.get("/api/weather", async (req, res) => {
    try {
      const city = req.query.city as string || "New York";
      const weather = await getCurrentWeather(city);
      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/current", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      const city = settings?.defaultCity || "New York";
      const weather = await getCurrentWeather(city);
      
      res.json({
        temp: Math.round(weather.temp),
        condition: weather.condition,
        city: weather.city,
      });
    } catch (error) {
      res.status(500).json({ 
        temp: "--",
        condition: "Loading...",
        city: "Unknown",
      });
    }
  });

  // ========================================
  // NASA API (APOD)
  // ========================================

  app.get("/api/nasa/apod", async (req, res) => {
    try {
      const apod = await getNASAAPOD();
      res.json(apod);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NASA APOD" });
    }
  });

  // ========================================
  // ISS TRACKER API
  // ========================================

  app.get("/api/iss/location", async (req, res) => {
    try {
      const location = await getISSLocation();
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ISS location" });
    }
  });

  // ========================================
  // AI CHAT API (Claude/Anthropic)
  // ========================================

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await chatWithClaude(message);

      if (!result.apiAvailable) {
        return res.json({
          response: "",
          error: "Claude AI not configured",
          apiAvailable: false,
          message: "Add ANTHROPIC_API_KEY to .env to enable Claude AI. See API-ALTERNATIVES.md for other options.",
        });
      }

      // Store conversation
      await storage.createConversation({
        message,
        response: result.response,
        sentiment: "neutral",
        sentimentScore: 0,
        intent: "general",
      });

      res.json({
        response: result.response,
        apiAvailable: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // ========================================
  // TRAVEL/MAPS API (TomTom)
  // ========================================

  app.get("/api/travel/route", async (req, res) => {
    try {
      const { origin, destination, mode } = req.query;

      if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required" });
      }

      const result = await calculateRoute(
        origin as string,
        destination as string,
        mode as string || "driving"
      );

      if (!result.apiAvailable) {
        return res.json({
          distance: "",
          duration: "",
          error: "TomTom Maps not configured",
          apiAvailable: false,
          message: "Add TOMTOM_API_KEY to .env to enable route calculation. See API-ALTERNATIVES.md for other options.",
        });
      }

      res.json({
        distance: result.distance,
        duration: result.duration,
        apiAvailable: true,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate route" });
    }
  });

  // ========================================
  // ANALYTICS API
  // ========================================

  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      const tasks = await storage.getTasks();
      const conversations = await storage.getConversations();
      
      const completedTasks = tasks.filter((t) => t.status === "completed").length;

      res.json({
        tasksCompleted: completedTasks,
        productivityScore: analytics?.productivityScore || 0,
        aiInteractions: conversations.length,
        commandsExecuted: analytics?.commandsExecuted || 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ========================================
  // NOTIFICATIONS API
  // ========================================

  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationRead(id);
      
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNotification(id);
      
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  app.post("/api/notifications/mark-all-read", async (req, res) => {
    try {
      await storage.markAllNotificationsRead();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // ========================================
  // SETTINGS API
  // ========================================

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Return HTTP server for vite setup
  const httpServer = createServer(app);
  return httpServer;
}
