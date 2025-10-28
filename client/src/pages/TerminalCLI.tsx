import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Terminal as TerminalIcon } from "lucide-react";

export default function TerminalCLI() {
  const [output, setOutput] = useState<Array<{ text: string; color: string }>>([
    { text: "🖖 LCARS Terminal v4.0 initialized", color: "text-success" },
    { text: "Type 'help' for available commands", color: "text-muted-foreground" },
    { text: "", color: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Check for voice-triggered terminal commands
  useEffect(() => {
    const terminalCommand = sessionStorage.getItem("terminalCommand");
    if (terminalCommand) {
      sessionStorage.removeItem("terminalCommand");
      // Execute the command after a brief delay
      setTimeout(() => {
        handleCommand(terminalCommand);
      }, 500);
    }
  }, []);

  const addOutput = (text: string, color: string = "text-foreground") => {
    setOutput((prev) => [...prev, { text, color }]);
  };

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    addOutput(`> ${cmd}`, "text-primary");
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.trim().toLowerCase().split(" ");
    const command = parts[0];

    switch (command) {
      case "help":
        addOutput("", "");
        addOutput("Available Commands:", "text-primary");
        addOutput("  help              - Show this help message", "text-foreground");
        addOutput("  clear             - Clear terminal", "text-foreground");
        addOutput("  status            - Show system status", "text-foreground");
        addOutput("  date              - Show current date/time", "text-foreground");
        addOutput("  stardate          - Show Star Trek stardate", "text-foreground");
        addOutput("  tasks             - List active tasks", "text-foreground");
        addOutput("  weather           - Get weather info", "text-foreground");
        addOutput("  joke              - Tell a programming joke", "text-foreground");
        addOutput("  fortune           - Get a fortune", "text-foreground");
        addOutput("  spock             - Spock quote", "text-foreground");
        addOutput("  picard            - Picard quote", "text-foreground");
        addOutput("  sisko             - Sisko quote", "text-foreground");
        addOutput("  janeway           - Janeway quote", "text-foreground");
        addOutput("  archer            - Archer quote", "text-foreground");
        addOutput("  mariner           - Mariner quote", "text-foreground");
        addOutput("  calc <expr>       - Calculate expression", "text-foreground");
        addOutput("  echo <text>       - Echo text", "text-foreground");
        addOutput("", "");
        addOutput("Easter Eggs:", "text-primary");
        addOutput("  redshirt          - Random redshirt fate", "text-foreground");
        addOutput("  khan              - KHAAAAN!", "text-foreground");
        addOutput("  beam              - Transporter effect", "text-foreground");
        addOutput("  cowsay <msg>      - Make a cow say something", "text-foreground");
        addOutput("", "");
        break;

      case "clear":
        setOutput([]);
        break;

      case "status":
        addOutput("", "");
        addOutput("🖥️  LCARS SYSTEM STATUS", "text-primary");
        addOutput("  Core Systems:    OPTIMAL", "text-success");
        addOutput("  AI Module:       READY", "text-success");
        addOutput("  Data Storage:    NOMINAL", "text-success");
        addOutput("  Network:         CONNECTED", "text-success");
        addOutput("", "");
        break;

      case "date":
        addOutput(new Date().toString(), "text-success");
        break;

      case "stardate":
        const stardate = (41000.0 + (Date.now() % 31536000000) / 31536000).toFixed(2);
        addOutput(`⭐ Stardate: ${stardate}`, "text-primary");
        addOutput(`   Earth Date: ${new Date().toLocaleDateString()}`, "text-muted-foreground");
        break;

      case "tasks":
        addOutput("📋 Active Tasks:", "text-primary");
        addOutput("  Use /tasks page to view and manage tasks", "text-muted-foreground");
        break;

      case "weather":
        addOutput("🌤️  Weather:", "text-primary");
        addOutput("  Use /weather page for detailed weather info", "text-muted-foreground");
        break;

      case "joke":
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why did the developer go broke? Because he used up all his cache! 💸",
          "There are 10 types of people: those who understand binary and those who don't. 🔢",
        ];
        addOutput(jokes[Math.floor(Math.random() * jokes.length)], "text-success");
        break;

      case "fortune":
        const fortunes = [
          "✨ 'The best way to predict the future is to invent it.' - Alan Kay",
          "💡 'Any sufficiently advanced technology is indistinguishable from magic.' - Arthur C. Clarke",
          "🚀 'Innovation distinguishes between a leader and a follower.' - Steve Jobs",
          "🌟 'The only way to do great work is to love what you do.' - Steve Jobs",
        ];
        addOutput(fortunes[Math.floor(Math.random() * fortunes.length)], "text-success");
        break;

      case "spock":
        const spockQuotes = [
          "🖖 'Live long and prosper.'",
          "🖖 'Logic is the beginning of wisdom, not the end.'",
          "🖖 'Change is the essential process of all existence.'",
          "🖖 'Fascinating.'",
        ];
        addOutput(spockQuotes[Math.floor(Math.random() * spockQuotes.length)], "text-primary");
        break;

      case "picard":
        const picardQuotes = [
          "👨‍✈️ 'Make it so.'",
          "👨‍✈️ 'Engage!'",
          "👨‍✈️ 'Tea. Earl Grey. Hot.'",
          "👨‍✈️ 'Things are only impossible until they're not.'",
          "👨‍✈️ 'The line must be drawn here!'",
          "👨‍✈️ 'There are four lights!'"
        ];
        addOutput(picardQuotes[Math.floor(Math.random() * picardQuotes.length)], "text-primary");
        break;

      case "sisko":
        const siskoQuotes = [
          "⚾ 'It's easy to be a saint in paradise.'",
          "⚾ 'I can live with it.'",
          "⚾ 'If you want to know who you are, it's important to know who you were.'",
          "⚾ 'Sometimes the only way to save a life is to take one.'",
          "⚾ 'I am far more than just another Starfleet captain.'",
          "⚾ 'In the Pale Moonlight...'"
        ];
        addOutput(siskoQuotes[Math.floor(Math.random() * siskoQuotes.length)], "text-primary");
        break;

      case "janeway":
        const janewayQuotes = [
          "☕ 'Coffee. Black.'",
          "☕ 'There's coffee in that nebula!'",
          "☕ 'Do it.'",
          "☕ 'We're Starfleet officers. Weird is part of the job.'",
          "☕ 'Time's up!'",
          "☕ 'I don't break rules, but I bend them... a lot.'"
        ];
        addOutput(janewayQuotes[Math.floor(Math.random() * janewayQuotes.length)], "text-primary");
        break;

      case "archer":
        const archerQuotes = [
          "🐕 'Let's see what's out there.'",
          "🐕 'We're going to stumble, make mistakes... but we're going to keep going.'",
          "🐕 'Where no man has gone before.'",
          "🐕  'We can't turn tail every time we get slapped.'",
          "🐕 'Someday, my people are going to come up with some sort of a doctrine.'",
          "🐕 'This is why we're out here, Doctor.'"
        ];
        addOutput(archerQuotes[Math.floor(Math.random() * archerQuotes.length)], "text-primary");
        break;

      case "mariner":
        const marinerQuotes = [
          "🍺 'Second contact is where the magic happens!'",
          "🍺 'I know every loophole, every exploit, every-'",
          "🍺 'Actually, that's pretty badass.'",
          "🍺 'Don't overthink it!'",
          "🍺 'We're the Cerritos! We're the best at being the worst!'",
          "🍺 'Classic Starfleet hubris.'"
        ];
        addOutput(marinerQuotes[Math.floor(Math.random() * marinerQuotes.length)], "text-primary");
        break;

      case "calc":
        if (parts.length < 2) {
          addOutput("Usage: calc <expression>", "text-warning");
        } else {
          try {
            const expr = cmd.substring(5).replace(/[^0-9+\-*/().]/g, "");
            const result = eval(expr);
            addOutput(`🔢 ${expr} = ${result}`, "text-success");
          } catch (e) {
            addOutput("❌ Invalid expression", "text-destructive");
          }
        }
        break;

      case "echo":
        const text = cmd.substring(5);
        addOutput(text, "text-foreground");
        break;

      case "redshirt":
        const fates = [
          "💀 Killed by alien life form on away mission",
          "⚡ Vaporized by unknown energy weapon",
          "🪨 Crushed by falling rocks on Class M planet",
          "👾 Assimilated by the Borg",
          "🌌 Lost in transporter malfunction",
          "🔥 Consumed by plasma fire",
          "✨ Actually survived! (Rare outcome)"
        ];
        addOutput("🔴 Beaming down redshirt...", "text-destructive");
        setTimeout(() => {
          const fate = fates[Math.floor(Math.random() * fates.length)];
          setOutput((prev) => [...prev, { 
            text: fate, 
            color: fate.includes("survived") ? "text-success" : "text-destructive" 
          }]);
          setOutput((prev) => [...prev, { text: "", color: "" }]);
        }, 1000);
        break;

      case "khan":
        addOutput("", "");
        addOutput("🗣️  KHAAAAAAAAAAAAAN!", "text-destructive");
        addOutput("   KHAAAAAAAAAAAAAAN!", "text-destructive");
        addOutput("     KHAAAAAAAAAAN!", "text-destructive");
        addOutput("", "");
        addOutput("   - Captain James T. Kirk", "text-muted-foreground");
        addOutput("", "");
        break;

      case "beam":
        addOutput("⚡ Energizing...", "text-warning");
        addOutput("█████████████████████", "text-primary");
        setTimeout(() => {
          setOutput((prev) => [...prev, { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓", color: "text-primary" }]);
        }, 200);
        setTimeout(() => {
          setOutput((prev) => [...prev, { text: "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒", color: "text-primary" }]);
        }, 400);
        setTimeout(() => {
          setOutput((prev) => [...prev, { text: "░░░░░░░░░░░░░░░░░░░░░", color: "text-primary" }]);
        }, 600);
        setTimeout(() => {
          setOutput((prev) => [...prev, { text: "✨ Transport complete!", color: "text-success" }]);
          setOutput((prev) => [...prev, { text: "", color: "" }]);
        }, 800);
        break;

      case "cowsay":
        const message = cmd.substring(7).trim() || "Moo!";
        addOutput("", "");
        addOutput(" " + "_".repeat(message.length + 2), "text-foreground");
        addOutput("< " + message + " >", "text-foreground");
        addOutput(" " + "-".repeat(message.length + 2), "text-foreground");
        addOutput("        \\   ^__^", "text-foreground");
        addOutput("         \\  (oo)\\_______", "text-foreground");
        addOutput("            (__)\\       )\\/\\", "text-foreground");
        addOutput("                ||----w |", "text-foreground");
        addOutput("                ||     ||", "text-foreground");
        addOutput("", "");
        break;

      default:
        addOutput(`Unknown command: '${command}'`, "text-destructive");
        addOutput("Type 'help' for available commands", "text-muted-foreground");
        break;
    }

    addOutput("", "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary lcars-glow flex items-center gap-2" data-testid="text-page-title">
          <TerminalIcon className="h-8 w-8" />
          Terminal
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Command-line interface
        </p>
      </div>

      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary font-mono">LCARS CLI</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={outputRef}
            className="bg-black/50 rounded-md p-4 font-mono text-sm h-96 overflow-y-auto mb-4 border border-primary/30"
            data-testid="terminal-output"
          >
            {output.map((line, i) => (
              <div key={i} className={line.color}>
                {line.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <span className="text-primary font-mono">{">"}</span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono"
                placeholder="Enter command..."
                autoFocus
                data-testid="input-terminal"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lcars-scanner">
        <CardHeader>
          <CardTitle className="text-primary">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Use <span className="text-primary">↑</span> and <span className="text-primary">↓</span> arrow keys to navigate command history</div>
            <div>• Type <span className="text-primary">help</span> to see all available commands</div>
            <div>• Commands are case-insensitive</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
