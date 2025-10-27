import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, MapPin, Image as ImageIcon } from "lucide-react";

export default function SpacePanel() {
  // Fetch NASA APOD
  const { data: apod, isLoading: apodLoading } = useQuery({
    queryKey: ["/api/nasa/apod"],
  });

  // Fetch ISS location
  const { data: iss, isLoading: issLoading } = useQuery({
    queryKey: ["/api/iss/location"],
    refetchInterval: 10000, // Update every 10 seconds
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow" data-testid="text-page-title">
          Space Exploration
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          NASA imagery and ISS tracking
        </p>
      </div>

      {/* NASA APOD */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            NASA Astronomy Picture of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apodLoading ? (
            <div className="text-center py-12 lcars-pulse text-primary">
              Loading astronomical data...
            </div>
          ) : apod ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full h-auto"
                  data-testid="img-apod"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-apod-title">
                  {apod.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2" data-testid="text-apod-date">
                  {apod.date}
                </p>
                <p className="text-sm text-foreground" data-testid="text-apod-explanation">
                  {apod.explanation}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Unable to load NASA APOD data
            </p>
          )}
        </CardContent>
      </Card>

      {/* ISS Tracker */}
      <Card className="lcars-scanner hover-elevate">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Rocket className="h-5 w-5 lcars-pulse" />
            International Space Station
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issLoading ? (
            <div className="text-center py-6 lcars-pulse text-primary">
              Tracking ISS...
            </div>
          ) : iss ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground mb-1">Latitude</div>
                  <div className="text-xl font-bold text-primary" data-testid="text-iss-latitude">
                    {iss.latitude.toFixed(4)}°
                  </div>
                </div>
                <div className="p-4 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground mb-1">Longitude</div>
                  <div className="text-xl font-bold text-primary" data-testid="text-iss-longitude">
                    {iss.longitude.toFixed(4)}°
                  </div>
                </div>
                <div className="p-4 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground mb-1">Altitude</div>
                  <div className="text-xl font-bold text-primary" data-testid="text-iss-altitude">
                    {iss.altitude ? iss.altitude.toFixed(2) + " km" : "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-iss-update">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs text-success">
                🟢 ISS is currently orbiting Earth at approximately 28,000 km/h
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Unable to track ISS location
            </p>
          )}
        </CardContent>
      </Card>

      {/* Space Facts */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Did You Know?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-md bg-muted">
              🌌 The ISS orbits Earth every 90 minutes
            </div>
            <div className="p-3 rounded-md bg-muted">
              ⭐ NASA's APOD has been running since June 16, 1995
            </div>
            <div className="p-3 rounded-md bg-muted">
              🚀 The ISS travels at 7.66 km/s (17,100 mph)
            </div>
            <div className="p-3 rounded-md bg-muted">
              🌍 Astronauts aboard the ISS see 16 sunrises every day
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
