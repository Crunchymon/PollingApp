"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.validate = void 0;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("./logger"));
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: e.issues });
        }
        return res.status(400).json({ message: 'Validation error' });
    }
};
exports.validate = validate;
function errorHandler(error, req, res, next) {
    logger_1.default.error('An unexpected error occurred', error, {
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    res.status(500).json({ message: "Something went wrong on the server." });
}
// Rate limiting for auth endpoints
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authRateLimiter = authRateLimiter;
