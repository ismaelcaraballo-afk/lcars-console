// Weather service using Open-Meteo (free, no API key required)
export async function getCurrentWeather(city: string) {
  try {
    // First, geocode the city to get coordinates using ip-api for location
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Get weather data from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;
    const daily = weatherData.daily;

    // Map weather codes to conditions
    const getCondition = (code: number): string => {
      if (code === 0) return "Clear sky";
      if (code <= 3) return "Partly cloudy";
      if (code <= 48) return "Foggy";
      if (code <= 67) return "Rainy";
      if (code <= 77) return "Snowy";
      if (code <= 82) return "Rain showers";
      if (code <= 86) return "Snow showers";
      if (code <= 99) return "Thunderstorm";
      return "Unknown";
    };

    // Build forecast
    const forecast = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(daily.time[i]);
      forecast.push({
        day: days[date.getDay()],
        date: daily.time[i],
        condition: getCondition(daily.weather_code[i]),
        maxTemp: daily.temperature_2m_max[i],
        minTemp: daily.temperature_2m_min[i],
      });
    }

    return {
      city: name,
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      condition: getCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      visibility: 10000, // Open-Meteo doesn't provide this, use default
      forecast,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    throw new Error("Failed to fetch weather data");
  }
}
