import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "🤖 LCARS AI Assistant Online. I can help you with natural language queries, task management, and general assistance.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sentiment, setSentiment] = useState({ mood: "neutral", score: 0, icon: "😐" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process voice commands from sessionStorage
  useEffect(() => {
    const voiceCommand = sessionStorage.getItem("voiceCommand");
    if (voiceCommand) {
      // Clear it immediately to prevent re-processing
      sessionStorage.removeItem("voiceCommand");
      
      // Set the input and automatically send it
      setInput(voiceCommand);
      
      // Auto-send after a brief delay to ensure UI updates
      setTimeout(() => {
        if (voiceCommand.trim()) {
          handleVoiceMessage(voiceCommand);
        }
      }, 500);
    }
  }, []);

  const handleVoiceMessage = async (message: string) => {
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input
    setIsProcessing(true);

    // Analyze sentiment
    const sentimentResult = analyzeSentiment(message);
    setSentiment(sentimentResult);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Check if Claude AI is available
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      let aiResponse: string;

      if (data.error && data.apiAvailable === false) {
        // Use local NLP if Claude AI not available
        aiResponse = await processNaturalLanguage(message);
      } else {
        aiResponse = data.response;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local NLP
      const aiResponse = await processNaturalLanguage(message);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeSentiment = (text: string) => {
    const positiveWords = ["good", "great", "awesome", "amazing", "excellent", "happy", "love", "perfect"];
    const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "horrible", "sad", "angry"];

    let score = 0;
    const lower = text.toLowerCase();

    positiveWords.forEach((word) => {
      if (lower.includes(word)) score += 10;
    });

    negativeWords.forEach((word) => {
      if (lower.includes(word)) score -= 10;
    });

    let mood = "neutral";
    let icon = "😐";

    if (score > 30) {
      mood = "positive";
      icon = "😊";
    } else if (score < -30) {
      mood = "negative";
      icon = "😔";
    }

    return { mood, score, icon };
  };

  const processNaturalLanguage = async (text: string): Promise<string> => {
    const lower = text.toLowerCase();
    let responses: string[] = [];

    // Check for compound questions (multiple topics in one query)
    const hasTime = /time|clock|stardate/i.test(lower);
    const hasWeather = /weather|temperature|forecast/i.test(lower);
    const hasTasks = /task|todo|to-do|reminder/i.test(lower);
    const hasStatus = /status|health|system|diagnostic/i.test(lower);
    const hasJoke = /joke|funny|laugh/i.test(lower);
    const hasGreeting = /^(hi|hello|hey|greetings)/i.test(lower);
    const hasThanks = /thank|thanks/i.test(lower);
    const hasSwallow = /swallow|african|european/i.test(lower);

    // Handle greetings first
    if (hasGreeting) {
      return "Hello! I'm your LCARS AI assistant. How can I help you today?";
    }

    if (hasThanks) {
      return "You're welcome! I'm always here to assist you.";
    }

    // Compound query handling - gather all relevant data
    if (hasTime) {
      const now = new Date();
      const stardate = (41000.0 + (Date.now() % 31536000000) / 31536000).toFixed(2);
      responses.push(`⏰ TIME: ${now.toLocaleTimeString()} | Stardate: ${stardate}`);
    }

    if (hasTasks) {
      try {
        const tasksResponse = await fetch("/api/tasks");
        const tasks = await tasksResponse.json();
        const activeTasks = tasks.filter((t: any) => t.status === "active");
        const completed = tasks.filter((t: any) => t.status === "completed");
        
        responses.push(`📋 TASKS: ${activeTasks.length} active, ${completed.length} completed`);
        
        if (activeTasks.length > 0) {
          const topTasks = activeTasks.slice(0, 3).map((t: any) => `  • ${t.title}`).join('\n');
          responses.push(`Top priorities:\n${topTasks}`);
        }
      } catch (error) {
        responses.push(`📋 TASKS: Unable to fetch task data`);
      }
    }

    if (hasWeather) {
      try {
        const weatherResponse = await fetch("/api/weather/current");
        const weather = await weatherResponse.json();
        responses.push(`🌤️ WEATHER: ${weather.temp}°C, ${weather.condition} in ${weather.city}`);
      } catch (error) {
        responses.push(`🌤️ WEATHER: Unable to fetch weather data`);
      }
    }

    if (hasStatus) {
      responses.push(`💚 SYSTEM STATUS: All LCARS systems NOMINAL\n  • Core: OPERATIONAL\n  • AI Module: READY\n  • Storage: ACTIVE`);
    }

    if (hasJoke) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why did the developer go broke? Because he used up all his cache!",
        "What's the object-oriented way to become wealthy? Inheritance! 💰",
      ];
      responses.push(`😄 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
    }

    // Easter egg: African or European swallow reference (Monty Python)
    if (hasSwallow) {
      responses.push(`🐦 SWALLOW ANALYSIS:\nAfrican Swallow: Unladen airspeed ~24 mph (non-migratory)\nEuropean Swallow: Unladen airspeed ~20.1 mph\n\nNote: Swallows cannot carry coconuts. Bridge of Death protocols do not apply here.`);
    }

    // If we gathered multiple responses, combine them
    if (responses.length > 0) {
      return responses.join('\n\n');
    }

    // Single topic queries
    if (/about|what is|tell me about|explain/i.test(lower) && !hasSwallow) {
      return "I'm the LCARS AI Console - a Star Trek-themed productivity dashboard. I can help with task management, weather info, analytics, and natural language processing.";
    }

    if (/api|claude|anthropic/i.test(lower)) {
      return "🤖 Claude AI Integration is ready to activate! Add your ANTHROPIC_API_KEY to .env to enable advanced AI conversations. See API-ALTERNATIVES.md for other options (OpenAI, Gemini, Perplexity).";
    }

    // Default response
    return "I understand you're asking about: " + text + ". While I have basic natural language processing, adding a Claude AI API key will unlock much more powerful conversations and understanding. See the Settings panel for API configuration.";
  };

  const handleSend = async () => {
    if (!input.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Analyze sentiment
    const sentimentResult = analyzeSentiment(input);
    setSentiment(sentimentResult);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Check if Claude AI is available
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      let aiResponse: string;

      if (data.error && data.apiAvailable === false) {
        // Use local NLP if Claude AI not available
        aiResponse = await processNaturalLanguage(input);
      } else {
        aiResponse = data.response;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local NLP
      const aiResponse = await processNaturalLanguage(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow flex items-center gap-2" data-testid="text-page-title">
          <MessageSquare className="h-8 w-8" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Natural language interface
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-sm text-primary">Quick Questions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("What's the weather?")}
            data-testid="button-quick-weather"
          >
            What's the weather?
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Show my tasks")}
            data-testid="button-quick-tasks"
          >
            Show my tasks
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Tell me a joke")}
            data-testid="button-quick-joke"
          >
            Tell me a joke
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("System status")}
            data-testid="button-quick-status"
          >
            System status
          </Button>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lcars-scanner">
        <CardContent className="p-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4" data-testid="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-md ${
                  msg.role === "user"
                    ? "bg-primary/20 border-l-4 border-primary ml-12"
                    : msg.role === "assistant"
                    ? "bg-secondary/20 border-l-4 border-secondary mr-12"
                    : "bg-muted/50 text-center"
                }`}
                data-testid={`message-${i}`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="bg-secondary/20 border-l-4 border-secondary p-3 rounded-md mr-12 lcars-pulse">
                <div className="text-sm">AI is thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... (natural language supported)"
              className="resize-none"
              rows={3}
              data-testid="input-ai-chat"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Mood:</span>{" "}
                  <span className="font-mono" data-testid="text-sentiment-mood">
                    {sentiment.icon} {sentiment.mood}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Score:</span>{" "}
                  <span className="font-mono" data-testid="text-sentiment-score">
                    {sentiment.score > 0 ? "+" : ""}
                    {sentiment.score}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={isProcessing || !input.trim()}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-md bg-muted">✅ Natural Language Understanding</div>
            <div className="p-3 rounded-md bg-muted">✅ Context-Aware Responses</div>
            <div className="p-3 rounded-md bg-muted">✅ Sentiment Analysis</div>
            <div className="p-3 rounded-md bg-muted">✅ Task Management Help</div>
            <div className="p-3 rounded-md bg-muted">✅ Information Retrieval</div>
            <div className="p-3 rounded-md bg-muted">✅ Star Trek Roleplay</div>
          </div>
          <div className="mt-4 p-3 rounded-md bg-warning/20 text-sm">
            <div className="font-semibold text-foreground mb-1">🤖 Enhanced AI Available</div>
            <div className="text-muted-foreground">
              Add <span className="text-primary">ANTHROPIC_API_KEY</span> to enable Claude AI for much more powerful conversations.
              See API-ALTERNATIVES.md for setup instructions and alternatives.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
