import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Settings as SettingsType, InsertSettings } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SettingsType>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState<Partial<InsertSettings>>({
    voiceRecognition: settings?.voiceRecognition ?? true,
    textToSpeech: settings?.textToSpeech ?? true,
    soundEffects: settings?.soundEffects ?? true,
    desktopNotifications: settings?.desktopNotifications ?? true,
    taskReminders: settings?.taskReminders ?? true,
    defaultCity: settings?.defaultCity ?? "New York",
  });

  const updateSettings = useMutation({
    mutationFn: async (data: Partial<InsertSettings>) => {
      return await apiRequest("/api/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    },
  });

  const handleSave = () => {
    updateSettings.mutate(formData);
  };

  const handleToggle = (key: keyof InsertSettings, value: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 lcars-pulse text-primary">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow flex items-center gap-2" data-testid="text-page-title">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Configure your LCARS Console
        </p>
      </div>

      {/* General Settings */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="default-city">Default City</Label>
            <Input
              id="default-city"
              value={formData.defaultCity}
              onChange={(e) => setFormData({ ...formData, defaultCity: e.target.value })}
              placeholder="Enter city name"
              data-testid="input-default-city"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used for weather and location-based features
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-recognition">Voice Recognition</Label>
              <p className="text-xs text-muted-foreground">
                Enable voice commands and speech-to-text
              </p>
            </div>
            <Switch
              id="voice-recognition"
              checked={formData.voiceRecognition}
              onCheckedChange={(checked) => handleToggle("voiceRecognition", checked)}
              data-testid="switch-voice-recognition"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="text-to-speech">Text-to-Speech</Label>
              <p className="text-xs text-muted-foreground">
                Enable AI responses to be read aloud
              </p>
            </div>
            <Switch
              id="text-to-speech"
              checked={formData.textToSpeech}
              onCheckedChange={(checked) => handleToggle("textToSpeech", checked)}
              data-testid="switch-text-to-speech"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <p className="text-xs text-muted-foreground">
                Enable LCARS beep sounds and audio feedback
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={formData.soundEffects}
              onCheckedChange={(checked) => handleToggle("soundEffects", checked)}
              data-testid="switch-sound-effects"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show system notifications for important events
              </p>
            </div>
            <Switch
              id="desktop-notifications"
              checked={formData.desktopNotifications}
              onCheckedChange={(checked) => handleToggle("desktopNotifications", checked)}
              data-testid="switch-desktop-notifications"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Receive reminders for upcoming tasks
              </p>
            </div>
            <Switch
              id="task-reminders"
              checked={formData.taskReminders}
              onCheckedChange={(checked) => handleToggle("taskReminders", checked)}
              data-testid="switch-task-reminders"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-md bg-muted space-y-3">
            <div>
              <div className="font-semibold text-foreground mb-1">🤖 Claude AI (Anthropic)</div>
              <div className="text-sm text-muted-foreground">
                Status: <span className="text-warning">Not configured</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Add <span className="text-primary">ANTHROPIC_API_KEY</span> to .env file
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-muted space-y-3">
            <div>
              <div className="font-semibold text-foreground mb-1">🗺️ TomTom Maps</div>
              <div className="text-sm text-muted-foreground">
                Status: <span className="text-warning">Not configured</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Add <span className="text-primary">TOMTOM_API_KEY</span> to .env file
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-success/20">
            <div className="font-semibold text-foreground mb-1">✅ Free APIs Active</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Open-Meteo (Weather)</div>
              <div>• NASA APOD (Space imagery)</div>
              <div>• ISS Tracker</div>
              <div>• IP API (Location)</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            See <span className="text-primary">API-ALTERNATIVES.md</span> for alternative API options and setup instructions
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-mono text-foreground">LCARS v4.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build:</span>
              <span className="font-mono text-foreground">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-mono text-foreground">React + Express</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theme:</span>
              <span className="font-mono text-foreground">LCARS Dark (Star Trek)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          size="lg"
          data-testid="button-save-settings"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
