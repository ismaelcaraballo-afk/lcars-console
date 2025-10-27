import { pgTable, text, serial, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// TASKS
// ========================================

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  status: text("status").notNull().default("active"), // active, completed
  dueDate: timestamp("due_date").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  dueDate: z.string().or(z.date()),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// ========================================
// CALENDAR EVENTS
// ========================================

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location").default(""),
  type: text("type").default("event"), // event, meeting, reminder
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
}).extend({
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

// ========================================
// ANALYTICS / PRODUCTIVITY METRICS
// ========================================

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  tasksCompleted: integer("tasks_completed").default(0),
  productivityScore: integer("productivity_score").default(0), // 0-100
  aiInteractions: integer("ai_interactions").default(0),
  commandsExecuted: integer("commands_executed").default(0),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// ========================================
// USER SETTINGS
// ========================================

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("default_user"), // For future multi-user support
  voiceRecognition: boolean("voice_recognition").default(true),
  textToSpeech: boolean("text_to_speech").default(true),
  soundEffects: boolean("sound_effects").default(true),
  desktopNotifications: boolean("desktop_notifications").default(true),
  taskReminders: boolean("task_reminders").default(true),
  defaultCity: text("default_city").default("New York"),
  theme: text("theme").default("dark"), // Always dark for LCARS, but keeping for structure
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// ========================================
// AI CONVERSATION HISTORY (for context)
// ========================================

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  sentiment: text("sentiment").default("neutral"), // positive, negative, neutral
  sentimentScore: integer("sentiment_score").default(0), // -100 to 100
  intent: text("intent").default("general"), // greeting, weather, tasks, time, help, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// ========================================
// TRAVEL ROUTES (for multi-stop planning)
// ========================================

export const travelRoutes = pgTable("travel_routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  waypoints: json("waypoints").$type<string[]>().default([]),
  distance: text("distance").default(""),
  duration: text("duration").default(""),
  mode: text("mode").default("driving"), // driving, walking, transit
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTravelRouteSchema = createInsertSchema(travelRoutes).omit({
  id: true,
  createdAt: true,
});

export type InsertTravelRoute = z.infer<typeof insertTravelRouteSchema>;
export type TravelRoute = typeof travelRoutes.$inferSelect;

// ========================================
// NOTIFICATIONS
// ========================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, success, warning, danger
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
