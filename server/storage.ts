import type {
  Task,
  InsertTask,
  CalendarEvent,
  InsertCalendarEvent,
  Analytics,
  InsertAnalytics,
  Settings,
  InsertSettings,
  Notification,
  InsertNotification,
  Conversation,
  InsertConversation,
  TravelRoute,
  InsertTravelRoute,
} from "@shared/schema";

// Storage interface for all LCARS Console data
export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  completeTask(id: number): Promise<Task | undefined>;
  
  // Calendar Events
  getCalendarEvents(): Promise<CalendarEvent[]>;
  getCalendarEvent(id: number): Promise<CalendarEvent | undefined>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  deleteCalendarEvent(id: number): Promise<boolean>;
  
  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  createAnalytics(data: InsertAnalytics): Promise<Analytics>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
  
  // Settings
  getSettings(userId?: string): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>, userId?: string): Promise<Settings>;
  
  // Notifications
  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  markAllNotificationsRead(): Promise<boolean>;
  
  // AI Conversations
  getConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Travel Routes
  getTravelRoutes(): Promise<TravelRoute[]>;
  createTravelRoute(route: InsertTravelRoute): Promise<TravelRoute>;
  deleteTravelRoute(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private tasks: Map<number, Task> = new Map();
  private calendarEvents: Map<number, CalendarEvent> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private settings: Map<string, Settings> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private conversations: Map<number, Conversation> = new Map();
  private travelRoutes: Map<number, TravelRoute> = new Map();
  
  private nextTaskId = 1;
  private nextEventId = 1;
  private nextAnalyticsId = 1;
  private nextSettingsId = 1;
  private nextNotificationId = 1;
  private nextConversationId = 1;
  private nextRouteId = 1;

  constructor() {
    // Initialize with default data
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Default tasks
    const now = new Date();
    this.createTask({
      title: "Complete LCARS Console Setup",
      description: "Finish restructuring the LCARS AI Console",
      priority: "high",
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: "active",
    });

    this.createTask({
      title: "Test All Features",
      description: "Verify voice, weather, travel, and all interactions",
      priority: "high",
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      status: "active",
    });

    // Default settings
    this.updateSettings({
      voiceRecognition: true,
      textToSpeech: true,
      soundEffects: true,
      desktopNotifications: true,
      taskReminders: true,
      defaultCity: "New York",
      theme: "dark",
    });

    // Default analytics
    this.createAnalytics({
      date: now,
      tasksCompleted: 0,
      productivityScore: 75,
      aiInteractions: 0,
      commandsExecuted: 0,
      metadata: {},
    });

    // Welcome notification
    this.createNotification({
      title: "Welcome to LCARS Console",
      message: "All systems online. Ready for mission objectives.",
      type: "success",
    });
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const newTask: Task = {
      id: this.nextTaskId++,
      ...task,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const completed: Task = {
      ...task,
      status: "completed",
      completedAt: new Date(),
    };
    this.tasks.set(id, completed);
    return completed;
  }

  // Calendar Events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values()).sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }

  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      id: this.nextEventId++,
      ...event,
      endDate: event.endDate || null,
      createdAt: new Date(),
    };
    this.calendarEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  async deleteCalendarEvent(id: number): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }

  // Analytics
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createAnalytics(data: InsertAnalytics): Promise<Analytics> {
    const newAnalytics: Analytics = {
      id: this.nextAnalyticsId++,
      ...data,
    };
    this.analytics.set(newAnalytics.id, newAnalytics);
    return newAnalytics;
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const all = await this.getAnalytics();
    return all[0];
  }

  // Settings
  async getSettings(userId: string = "default_user"): Promise<Settings | undefined> {
    let settings = this.settings.get(userId);
    if (!settings) {
      // Create default settings
      settings = await this.updateSettings({}, userId);
    }
    return settings;
  }

  async updateSettings(newSettings: Partial<InsertSettings>, userId: string = "default_user"): Promise<Settings> {
    const existing = this.settings.get(userId);
    const settings: Settings = {
      id: existing?.id || this.nextSettingsId++,
      userId,
      voiceRecognition: newSettings.voiceRecognition ?? existing?.voiceRecognition ?? true,
      textToSpeech: newSettings.textToSpeech ?? existing?.textToSpeech ?? true,
      soundEffects: newSettings.soundEffects ?? existing?.soundEffects ?? true,
      desktopNotifications: newSettings.desktopNotifications ?? existing?.desktopNotifications ?? true,
      taskReminders: newSettings.taskReminders ?? existing?.taskReminders ?? true,
      defaultCity: newSettings.defaultCity ?? existing?.defaultCity ?? "New York",
      theme: newSettings.theme ?? existing?.theme ?? "dark",
      updatedAt: new Date(),
    };
    this.settings.set(userId, settings);
    return settings;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      id: this.nextNotificationId++,
      ...notification,
      read: false,
      createdAt: new Date(),
    };
    this.notifications.set(newNotification.id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;

    const updated = { ...notification, read: true };
    this.notifications.set(id, updated);
    return updated;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async markAllNotificationsRead(): Promise<boolean> {
    for (const [id, notification] of this.notifications.entries()) {
      this.notifications.set(id, { ...notification, read: true });
    }
    return true;
  }

  // AI Conversations
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const newConversation: Conversation = {
      id: this.nextConversationId++,
      ...conversation,
      createdAt: new Date(),
    };
    this.conversations.set(newConversation.id, newConversation);
    return newConversation;
  }

  // Travel Routes
  async getTravelRoutes(): Promise<TravelRoute[]> {
    return Array.from(this.travelRoutes.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createTravelRoute(route: InsertTravelRoute): Promise<TravelRoute> {
    const newRoute: TravelRoute = {
      id: this.nextRouteId++,
      ...route,
      createdAt: new Date(),
    };
    this.travelRoutes.set(newRoute.id, newRoute);
    return newRoute;
  }

  async deleteTravelRoute(id: number): Promise<boolean> {
    return this.travelRoutes.delete(id);
  }
}

export const storage = new MemStorage();
