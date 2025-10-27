import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CheckSquare,
  Cloud,
  Calendar as CalendarIcon,
  BarChart3,
  Rocket,
  MapPin,
  Bell,
  Terminal,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
import { useLocation } from "wouter";

const menuItems = [
  {
    title: "Console",
    url: "/",
    icon: LayoutDashboard,
    tone: 600,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    tone: 650,
  },
  {
    title: "Weather",
    url: "/weather",
    icon: Cloud,
    tone: 700,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: CalendarIcon,
    tone: 750,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    tone: 800,
  },
  {
    title: "Space",
    url: "/space",
    icon: Rocket,
    tone: 825,
  },
  {
    title: "Travel",
    url: "/travel",
    icon: MapPin,
    tone: 850,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    tone: 875,
  },
  {
    title: "Terminal",
    url: "/terminal",
    icon: Terminal,
    tone: 900,
  },
  {
    title: "AI Chat",
    url: "/ai",
    icon: MessageSquare,
    tone: 950,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    tone: 1000,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const handleMenuClick = (url: string, tone: number) => {
    // Play LCARS beep with unique tone for each menu item
    if (typeof (window as any).playBeep === "function") {
      (window as any).playBeep(tone);
      setTimeout(() => (window as any).playBeep(tone + 100), 100);
    }
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar lcars-scanner" data-testid="sidebar-main">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-primary lcars-glow" data-testid="text-app-title">
            LCARS
          </h2>
          <p className="text-xs text-muted-foreground font-mono" data-testid="text-app-subtitle">
            AI CONSOLE v4.0
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-secondary">NAVIGATION</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`hover-elevate active-elevate-2 ${
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }`}
                      data-testid={`button-nav-${item.title.toLowerCase().replace(" ", "-")}`}
                    >
                      <a
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault();
                          handleMenuClick(item.url, item.tone);
                          window.history.pushState({}, "", item.url);
                          window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="text-xs text-muted-foreground font-mono space-y-1" data-testid="text-system-info">
          <div className="flex justify-between">
            <span>CPU:</span>
            <span className="text-success">98%</span>
          </div>
          <div className="flex justify-between">
            <span>MEM:</span>
            <span className="text-warning">67%</span>
          </div>
          <div className="flex justify-between">
            <span>PWR:</span>
            <span className="text-primary">OPTIMAL</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
