import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cloud, Droplets, Wind, Eye, Gauge, MapPin, Search } from "lucide-react";

export default function WeatherPanel() {
  const [city, setCity] = useState("New York");
  const [searchCity, setSearchCity] = useState("");

  // Fetch current weather
  const { data: weather, isLoading, refetch } = useQuery({
    queryKey: ["/api/weather", city],
  });

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary lcars-glow" data-testid="text-page-title">
            Weather Center
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Real-time atmospheric conditions
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="lcars-scanner">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              data-testid="input-city-search"
            />
            <Button onClick={handleSearch} data-testid="button-search-city">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="lcars-pulse text-primary">Scanning atmosphere...</div>
        </div>
      ) : weather ? (
        <>
          {/* Current Weather */}
          <Card className="lcars-scanner hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                {weather.city || city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-6xl font-bold text-primary lcars-glow" data-testid="text-current-temp">
                    {Math.round(weather.temp)}°
                  </div>
                  <p className="text-xl text-secondary mt-2" data-testid="text-weather-condition">
                    {weather.condition}
                  </p>
                </div>
                <div className="text-8xl">{getWeatherIcon(weather.condition)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Details */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feels Like</CardTitle>
                <Cloud className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-feels-like">
                  {Math.round(weather.feelsLike)}°
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-humidity">
                  {weather.humidity}%
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-wind-speed">
                  {Math.round(weather.windSpeed)} mph
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visibility</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-visibility">
                  {Math.round(weather.visibility / 1000)} km
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 7-Day Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <Card className="lcars-scanner">
              <CardHeader>
                <CardTitle className="text-primary">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-7">
                  {weather.forecast.map((day: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-3 rounded-md hover-elevate border border-border"
                      data-testid={`forecast-day-${index}`}
                    >
                      <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                      <div className="text-3xl mb-2">{getWeatherIcon(day.condition)}</div>
                      <div className="text-sm font-semibold text-primary">{Math.round(day.maxTemp)}°</div>
                      <div className="text-xs text-muted-foreground">{Math.round(day.minTemp)}°</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No weather data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getWeatherIcon(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("clear") || lower.includes("sunny")) return "☀️";
  if (lower.includes("cloud")) return "☁️";
  if (lower.includes("rain")) return "🌧️";
  if (lower.includes("snow")) return "❄️";
  if (lower.includes("storm") || lower.includes("thunder")) return "⛈️";
  if (lower.includes("fog") || lower.includes("mist")) return "🌫️";
  return "🌤️";
}
