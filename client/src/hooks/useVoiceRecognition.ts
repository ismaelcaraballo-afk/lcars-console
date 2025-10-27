import { useState, useEffect, useCallback } from "react";

interface VoiceRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

export function useVoiceRecognition(
  onCommand: (command: string) => void
): VoiceRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript.trim();
        
        console.log("🎤 Voice heard:", transcriptText);
        setTranscript(transcriptText);

        // Check if command starts with "Computer" (Star Trek style!)
        if (transcriptText.toLowerCase().startsWith("computer")) {
          const command = transcriptText.substring(8).trim();
          console.log("⚡ Processing command:", command);
          
          // Play acknowledgment beep
          if ((window as any).playBeep) {
            (window as any).playBeep(900);
          }
          
          onCommand(command);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("❌ Voice recognition error:", event.error);
        if (event.error === "no-speech") {
          console.log("No speech detected, continuing to listen...");
        } else {
          setIsListening(false);
        }
      };

      recognitionInstance.onend = () => {
        // Auto-restart if still supposed to be listening
        if (isListening) {
          try {
            recognitionInstance.start();
          } catch (e) {
            console.log("Recognition restart failed:", e);
            setIsListening(false);
          }
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn("⚠️ Voice recognition not supported in this browser");
      setIsSupported(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        
        // Play activation beep
        if ((window as any).playBeep) {
          (window as any).playBeep(800);
          setTimeout(() => (window as any).playBeep(1000), 100);
        }
        
        console.log("🎤 Voice recognition activated");
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
        
        // Play deactivation beep
        if ((window as any).playBeep) {
          (window as any).playBeep(400);
        }
        
        console.log("🔇 Voice recognition deactivated");
      } catch (e) {
        console.error("Failed to stop recognition:", e);
      }
    }
  }, [recognition, isListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
  };
}
