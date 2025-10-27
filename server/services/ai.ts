import Anthropic from "@anthropic-ai/sdk";

// Claude AI service (requires ANTHROPIC_API_KEY)
export async function chatWithClaude(message: string): Promise<{ response: string; apiAvailable: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return {
      response: "",
      apiAvailable: false,
    };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      system: "You are a helpful AI assistant in a Star Trek LCARS interface. Be concise and helpful. Use a professional but friendly tone.",
    });

    const textContent = response.content.find((block) => block.type === "text");
    
    return {
      response: textContent && textContent.type === "text" ? textContent.text : "No response generated",
      apiAvailable: true,
    };
  } catch (error) {
    console.error("Claude AI error:", error);
    throw new Error("Failed to get AI response");
  }
}

// Alternative AI providers (for documentation)
export const AI_ALTERNATIVES = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4", "gpt-3.5-turbo"],
    website: "https://platform.openai.com/",
    pricing: "Pay-as-you-go starting at $0.03/1K tokens",
  },
  gemini: {
    name: "Google Gemini",
    models: ["gemini-pro", "gemini-pro-vision"],
    website: "https://ai.google.dev/",
    pricing: "Free tier available, then pay-as-you-go",
  },
  perplexity: {
    name: "Perplexity AI",
    models: ["pplx-7b-chat", "pplx-70b-chat"],
    website: "https://www.perplexity.ai/",
    pricing: "API access available",
  },
  local: {
    name: "Local LLMs",
    models: ["Ollama", "LM Studio", "llama.cpp"],
    website: "https://ollama.com/",
    pricing: "Free (run on your own hardware)",
  },
};
