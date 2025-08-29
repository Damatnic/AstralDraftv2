/**
 * Centralized Logging Service
 * Replaces console statements with proper logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  category?: string;
}

class LoggingService {
  private logLevel: LogLevel;
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || process.env.NODE_ENV !== 'production';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private log(level: LogLevel, message: string, data?: unknown, category?: string): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      category,
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Only output to console in development
    if (this.isDevelopment) {
      this.outputToConsole(entry);
    }

    // In production, send critical errors to error reporting service
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.reportError(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const prefix = entry.category ? `[${entry.category}]` : '';
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(`${timestamp} ${prefix} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(`${timestamp} ${prefix} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(`${timestamp} ${prefix} ${entry.message}`, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(`${timestamp} ${prefix} ${entry.message}`, entry.data || '');
        break;
    }
  }

  private reportError(_entry: LogEntry): void {
    // In production, send to error reporting service (Sentry, etc.)
    // For now, just store it
    try {
      // Example: Sentry.captureException(new Error(entry.message), { extra: entry.data });
    } catch {
      // Fallback - don't let logging errors break the app
    }
  }

  // Public API
  debug(message: string, data?: unknown, category?: string): void {
    this.log(LogLevel.DEBUG, message, data, category);
  }

  info(message: string, data?: unknown, category?: string): void {
    this.log(LogLevel.INFO, message, data, category);
  }

  warn(message: string, data?: unknown, category?: string): void {
    this.log(LogLevel.WARN, message, data, category);
  }

  error(message: string, data?: unknown, category?: string): void {
    this.log(LogLevel.ERROR, message, data, category);
  }

  // Oracle-specific logging methods
  oracleInfo(message: string, data?: unknown): void {
    this.info(message, data, 'Oracle');
  }

  oracleError(message: string, data?: unknown): void {
    this.error(message, data, 'Oracle');
  }

  oracleDebug(message: string, data?: unknown): void {
    this.debug(message, data, 'Oracle');
  }

  // Performance logging
  performance(message: string, data?: unknown): void {
    this.debug(message, data, 'Performance');
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new LoggingService();
export default logger;
