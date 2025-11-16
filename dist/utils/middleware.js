"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.validate = void 0;
exports.errorHandler = errorHandler;
exports.authenticate = authenticate;
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("./logger"));
const jwt = __importStar(require("jsonwebtoken"));
// Validate JWT_SECRET on startup
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger_1.default.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return secret;
})();
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
    max: 100, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authRateLimiter = authRateLimiter;
function authenticate(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: "Authorization header was not found" });
        }
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid authorization format. Expected: Bearer <token>" });
        }
        const payload = jwt.verify(token, JWT_SECRET);
        if (typeof payload === 'string') {
            return res.status(401).json({ message: "Invalid token format" });
        }
        req.body.payload = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "You are not authorised to access this page" });
    }
}
