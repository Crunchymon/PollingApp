"use strict";
// Simple logger utility - can be replaced with Winston/Pino later
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
function formatLog(level, message, error, metadata) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(metadata && { metadata })
    };
    if (error instanceof Error) {
        // It's a real Error, serialize it
        entry.error = { name: error.name, message: error.message, stack: error.stack };
    }
    else if (error) {
        // It's not an Error, but it's something. Log it.
        entry.caughtValue = error;
    }
    return JSON.stringify(entry);
}
const logger = {
    error: (message, error, metadata) => {
        console.error(formatLog(LogLevel.ERROR, message, error, metadata));
    },
    warn: (message, metadata) => {
        console.warn(formatLog(LogLevel.WARN, message, undefined, metadata));
    },
    info: (message, metadata) => {
        console.log(formatLog(LogLevel.INFO, message, undefined, metadata));
    },
    debug: (message, metadata) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(formatLog(LogLevel.DEBUG, message, undefined, metadata));
        }
    }
};
exports.default = logger;
