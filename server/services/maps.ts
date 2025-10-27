// TomTom Maps service (requires TOMTOM_API_KEY)
export async function calculateRoute(
  origin: string,
  destination: string,
  mode: string = "driving"
): Promise<{ distance: string; duration: string; apiAvailable: boolean }> {
  const apiKey = process.env.TOMTOM_API_KEY;

  if (!apiKey || apiKey === "your_tomtom_api_key_here") {
    return {
      distance: "",
      duration: "",
      apiAvailable: false,
    };
  }

  try {
    // Geocode origin and destination
    const originGeo = await geocodeAddress(origin, apiKey);
    const destGeo = await geocodeAddress(destination, apiKey);

    // Calculate route
    const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${originGeo.lat},${originGeo.lon}:${destGeo.lat},${destGeo.lon}/json?key=${apiKey}&travelMode=${mode}`;
    
    const response = await fetch(routeUrl);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0].summary;
      
      return {
        distance: formatDistance(route.lengthInMeters),
        duration: formatDuration(route.travelTimeInSeconds),
        apiAvailable: true,
      };
    }

    throw new Error("No route found");
  } catch (error) {
    console.error("TomTom routing error:", error);
    throw new Error("Failed to calculate route");
  }
}

async function geocodeAddress(address: string, apiKey: string) {
  const geoUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`;
  const response = await fetch(geoUrl);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    return data.results[0].position;
  }

  throw new Error(`Could not geocode: ${address}`);
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  const miles = km * 0.621371;
  return `${km.toFixed(1)} km (${miles.toFixed(1)} mi)`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Alternative Maps providers (for documentation)
export const MAPS_ALTERNATIVES = {
  google: {
    name: "Google Maps",
    apis: ["Directions API", "Geocoding API", "Places API"],
    website: "https://developers.google.com/maps",
    pricing: "$5/1000 requests (free $200 credit monthly)",
  },
  mapbox: {
    name: "Mapbox",
    apis: ["Directions API", "Geocoding API", "Navigation API"],
    website: "https://www.mapbox.com/",
    pricing: "Free tier up to 100,000 requests/month",
  },
  openstreetmap: {
    name: "OpenStreetMap",
    apis: ["Nominatim (geocoding)", "OSRM (routing)"],
    website: "https://www.openstreetmap.org/",
    pricing: "Free (community-driven)",
  },
};
