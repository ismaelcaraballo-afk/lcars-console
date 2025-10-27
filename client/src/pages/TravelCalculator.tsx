import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation, Clock, Fuel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TravelCalculator() {
  const { toast } = useToast();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("driving");
  const [route, setRoute] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!origin.trim() || !destination.trim()) {
      toast({
        title: "Error",
        description: "Please enter both origin and destination",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Check if TomTom Maps API is available
      const response = await fetch(`/api/travel/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`);
      const data = await response.json();

      if (data.error && data.apiAvailable === false) {
        toast({
          title: "TomTom Maps API Not Configured",
          description: "Please add your TOMTOM_API_KEY to use route calculation. See documentation for alternatives (Google Maps, Mapbox).",
          variant: "destructive",
        });
        setRoute(null);
      } else {
        setRoute(data);
        toast({
          title: "Route calculated!",
          description: `Found route from ${origin} to ${destination}`,
        });
      }
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: "Unable to calculate route. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow" data-testid="text-page-title">
          Travel Calculator
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Plan routes and calculate travel time
        </p>
      </div>

      {/* Route Input */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Route Planning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="Starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              data-testid="input-origin"
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Destination location"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              data-testid="input-destination"
            />
          </div>
          <div>
            <Label htmlFor="mode">Travel Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger id="mode" data-testid="select-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driving">Driving</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="transit">Public Transit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
            data-testid="button-calculate-route"
          >
            {isCalculating ? "Calculating..." : "Calculate Route"}
          </Button>
        </CardContent>
      </Card>

      {/* Route Results */}
      {route && route.distance && (
        <Card className="lcars-scanner hover-elevate">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Route Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Distance</span>
                </div>
                <div className="text-2xl font-bold text-primary" data-testid="text-route-distance">
                  {route.distance}
                </div>
              </div>
              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <div className="text-2xl font-bold text-primary" data-testid="text-route-duration">
                  {route.duration}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Status Card */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-warning">🗺️ Maps Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-md bg-muted text-sm">
            <div className="font-semibold text-foreground mb-2">TomTom Maps (Primary)</div>
            <div className="text-muted-foreground">
              {route?.apiAvailable === false ? (
                <span className="text-destructive">⚠️ API key not configured</span>
              ) : (
                <span className="text-success">✓ Ready (add TOMTOM_API_KEY to activate)</span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-md bg-muted text-sm">
            <div className="font-semibold text-foreground mb-2">Alternative Options</div>
            <div className="text-muted-foreground text-xs space-y-1">
              <div>• Google Maps API</div>
              <div>• Mapbox API</div>
              <div>• OpenStreetMap (free)</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            See <span className="text-primary">API-ALTERNATIVES.md</span> for setup instructions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
