// ISS tracker service (free, no API key required)
export async function getISSLocation() {
  try {
    const response = await fetch("http://api.open-notify.org/iss-now.json");
    
    if (!response.ok) {
      throw new Error(`ISS API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp,
      altitude: 408, // ISS orbits at ~408 km (approximate)
    };
  } catch (error) {
    console.error("ISS location fetch error:", error);
    throw new Error("Failed to fetch ISS location");
  }
}
