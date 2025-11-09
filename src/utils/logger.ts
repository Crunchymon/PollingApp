// Simple logger utility - can be replaced with Winston/Pino later

enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}
interface SerializedError {
    name: string;
    message: string;
    stack?: string;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    error?: SerializedError;
    caughtValue?: unknown;
    metadata?: Record<string, unknown>;
}

function formatLog(level: LogLevel, message: string, error?: unknown, metadata?: Record<string, unknown>): string {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(metadata && { metadata })
    };

    if (error instanceof Error) {
        // It's a real Error, serialize it
        entry.error = { name: error.name, message: error.message, stack: error.stack };
    } else if (error) {
        // It's not an Error, but it's something. Log it.
        entry.caughtValue = error;
    }
    return JSON.stringify(entry);
}

const logger = {
    error: (message: string, error?: unknown, metadata?: Record<string, unknown>) => {
        console.error(formatLog(LogLevel.ERROR, message, error, metadata));
    },
    warn: (message: string, metadata?: Record<string, unknown>) => {
        console.warn(formatLog(LogLevel.WARN, message, undefined, metadata));
    },
    info: (message: string, metadata?: Record<string, unknown>) => {
        console.log(formatLog(LogLevel.INFO, message, undefined, metadata));
    },
    debug: (message: string, metadata?: Record<string, unknown>) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(formatLog(LogLevel.DEBUG, message, undefined, metadata));
        }
    }
};

export default logger;



