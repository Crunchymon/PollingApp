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
exports.handleGoogleLogin = exports.handleVerifyUser = exports.handleCreateUser = void 0;
const auth_service_1 = require("./auth.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../utils/logger"));
// Validate JWT_SECRET on startup
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger_1.default.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return secret;
})();
// Validate Google Config on startup
(() => {
    const missing = [];
    if (!process.env.GOOGLE_CLIENT_ID)
        missing.push('GOOGLE_CLIENT_ID');
    if (!process.env.GOOGLE_CLIENT_SECRET)
        missing.push('GOOGLE_CLIENT_SECRET');
    if (!process.env.GOOGLE_REDIRECT_URI)
        missing.push('GOOGLE_REDIRECT_URI');
    if (missing.length > 0) {
        logger_1.default.error(`FATAL ERROR: Missing Google OAuth config: ${missing.join(', ')}`);
        process.exit(1);
    }
})();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
// Dummy hash for timing attack prevention (valid bcrypt hash format that will never match)
// This ensures constant-time comparison even when user doesn't exist
const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghijk';
// Utility function to generate JWT token
function generateToken(userId) {
    const payload = { id: userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
// Utility function to format user response
function formatUserResponse(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
    };
}
const handleCreateUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    const ifUserExits = await (0, auth_service_1.findUserByEmail)(email);
    if (ifUserExits != null) {
        res.status(409).json({
            message: "A user with this email address already exists."
        });
        return;
    }
    const user = await (0, auth_service_1.createUser)(name, email, password);
    const token = generateToken(user.id);
    res.status(201).json({
        token: token,
        user: formatUserResponse(user)
    });
});
exports.handleCreateUser = handleCreateUser;
const handleVerifyUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await (0, auth_service_1.findUserByEmail)(email);
    // Timing attack prevention: always perform bcrypt comparison
    // Use dummy hash if user doesn't exist to maintain constant time
    const hashToCompare = user?.password || DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);
    // Only succeed if user exists AND password is valid
    if (!user || !isPasswordValid) {
        res.status(401).json({
            message: "Invalid email or password."
        });
        return;
    }
    const token = generateToken(user.id);
    res.status(200).json({
        token: token,
        user: formatUserResponse(user)
    });
});
exports.handleVerifyUser = handleVerifyUser;
const handleGoogleLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { code } = req.body;
    // 1. Verify token and get payload
    const googleUser = await (0, auth_service_1.verifyGoogleToken)(code);
    if (!googleUser) {
        res.status(400).json({ message: "Failed to retrieve user data from Google." });
        return;
    }
    // 2. Find or create user
    const user = await (0, auth_service_1.findOrCreateGoogleUser)(googleUser);
    // 3. Generate Token
    const token = generateToken(user.id);
    // 4. Send response
    res.status(200).json({
        token,
        user: formatUserResponse(user)
    });
});
exports.handleGoogleLogin = handleGoogleLogin;
