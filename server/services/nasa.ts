// NASA APOD service (free, no API key required with DEMO_KEY)
export async function getNASAAPOD() {
  try {
    // NASA provides a DEMO_KEY with limited rate limits
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      url: data.url,
      hdurl: data.hdurl,
      mediaType: data.media_type,
      copyright: data.copyright,
    };
  } catch (error) {
    console.error("NASA APOD fetch error:", error);
    throw new Error("Failed to fetch NASA APOD");
  }
}
