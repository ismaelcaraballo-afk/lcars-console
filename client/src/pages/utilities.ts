// utilities.ts
// Security, Performance, and API Utilities for LCARS Console

/**
 * SECURITY UTILITIES
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML entities by converting to text content
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validates message input with length and type checks
 */
export const validateMessage = (
  text: string, 
  maxLength: number = 1000
): { valid: boolean; error?: string; sanitized?: string } => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Invalid input type' };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Message too long (max ${maxLength} characters)` };
  }
  
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Message contains invalid content' };
    }
  }
  
  return { valid: true, sanitized: sanitizeInput(trimmed) };
};

/**
 * PERFORMANCE UTILITIES
 */

/**
 * Rate Limiter Class
 * Prevents API spam and protects against excessive requests
 */
export class RateLimiter {
  private calls: number[] = [];
  
  constructor(
    private maxCalls: number = 10,
    private timeWindow: number = 60000
  ) {}
  
  canMakeCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    
    if (this.calls.length < this.maxCalls) {
      this.calls.push(now);
      return true;
    }
    
    return false;
  }
  
  getRemainingCalls(): number {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxCalls - this.calls.length);
  }
  
  getTimeUntilNextCall(): number {
    if (this.calls.length < this.maxCalls) {
      return 0;
    }
    
    const now = Date.now();
    const oldestCall = Math.min(...this.calls);
    const timeUntilExpiry = (oldestCall + this.timeWindow) - now;
    
    return Math.max(0, timeUntilExpiry);
  }
  
  reset(): void {
    this.calls = [];
  }
  
  getStatus(): { 
    used: number; 
    remaining: number; 
    maxCalls: number;
    timeWindow: number;
    nextAvailable: number;
  } {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    
    return {
      used: this.calls.length,
      remaining: this.getRemainingCalls(),
      maxCalls: this.maxCalls,
      timeWindow: this.timeWindow,
      nextAvailable: this.getTimeUntilNextCall(),
    };
  }
}

/**
 * Fetch with timeout protection
 */
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    
    throw new Error('Unknown error occurred');
  }
};

/**
 * Safe JSON fetch with timeout and error handling
 */
export const safeFetchJSON = async <T = any>(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<T> => {
  const response = await fetchWithTimeout(url, options, timeout);
  
  try {
    return await response.json();
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = 100
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * SENTIMENT ANALYSIS
 */

const POSITIVE_WORDS = new Set([
  "good", "great", "awesome", "amazing", "excellent", 
  "happy", "love", "perfect", "wonderful", "fantastic",
  "brilliant", "outstanding", "superb", "terrific", "marvelous",
  "delightful", "fabulous", "spectacular", "phenomenal", "incredible",
  "nice", "pleasant", "enjoyable", "satisfying", "pleased"
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "hate", "worst", 
  "horrible", "sad", "angry", "disappointing", "poor",
  "awful", "dreadful", "atrocious", "abysmal", "appalling",
  "miserable", "pathetic", "useless", "frustrating", "annoying",
  "upset", "unhappy", "dissatisfied", "displeased"
]);

export interface SentimentResult {
  mood: 'positive' | 'neutral' | 'negative';
  score: number;
  icon: string;
  confidence: number;
}

export const analyzeSentiment = (text: string): SentimentResult => {
  let score = 0;
  let wordCount = 0;
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  for (const word of words) {
    wordCount++;
    if (POSITIVE_WORDS.has(word)) score += 10;
    if (NEGATIVE_WORDS.has(word)) score -= 10;
  }
  
  const sentimentWordsFound = Math.abs(score) / 10;
  const confidence = Math.min(sentimentWordsFound / Math.max(wordCount, 1), 1);
  
  let mood: 'positive' | 'neutral' | 'negative' = "neutral";
  let icon = "😐";
  
  if (score > 30) {
    mood = "positive";
    icon = score > 60 ? "😄" : "😊";
  } else if (score > 10) {
    mood = "positive";
    icon = "🙂";
  } else if (score < -30) {
    mood = "negative";
    icon = score < -60 ? "😢" : "😔";
  } else if (score < -10) {
    mood = "negative";
    icon = "😕";
  }
  
  return { mood, score, icon, confidence };
};

/**
 * ERROR HANDLING UTILITIES
 */

export interface ErrorInfo {
  message: string;
  type: 'validation' | 'network' | 'rate_limit' | 'timeout' | 'server' | 'unknown';
  userMessage: string;
  retryable: boolean;
}

export const parseError = (error: unknown): ErrorInfo => {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return {
        message: error.message,
        type: 'timeout',
        userMessage: 'Request timed out. Please try again.',
        retryable: true,
      };
    }
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        message: error.message,
        type: 'network',
        userMessage: 'Network error. Please check your connection.',
        retryable: true,
      };
    }
    
    if (error.message.includes('HTTP')) {
      return {
        message: error.message,
        type: 'server',
        userMessage: 'Server error. Please try again later.',
        retryable: true,
      };
    }
    
    return {
      message: error.message,
      type: 'unknown',
      userMessage: error.message,
      retryable: false,
    };
  }
  
  return {
    message: 'Unknown error',
    type: 'unknown',
    userMessage: 'An unexpected error occurred',
    retryable: false,
  };
};

/**
 * FORMAT UTILITIES
 */

export const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return 'now';
  
  const seconds = Math.ceil(ms / 1000);
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

export const formatRateLimitStatus = (limiter: RateLimiter): string => {
  const status = limiter.getStatus();
  
  if (status.remaining > 0) {
    return `${status.remaining}/${status.maxCalls} requests available`;
  }
  
  const timeRemaining = formatTimeRemaining(status.nextAvailable);
  return `Rate limit reached. Try again in ${timeRemaining}`;
};

/**
 * CONFIGURATION PRESETS
 */

export const RATE_LIMITS = {
  CLAUDE_AI: { maxCalls: 5, timeWindow: 60000 },
  FREE_AI: { maxCalls: 10, timeWindow: 60000 },
  LOCAL: { maxCalls: 30, timeWindow: 60000 },
  PREMIUM: { maxCalls: 2, timeWindow: 60000 },
} as const;

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000,
} as const;

export const MESSAGE_LIMITS = {
  SHORT: 100,
  MEDIUM: 500,
  LONG: 1000,
  VERY_LONG: 5000,
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMITS;
export type TimeoutPreset = keyof typeof TIMEOUTS;
export type MessageLimitPreset = keyof typeof MESSAGE_LIMITS;
