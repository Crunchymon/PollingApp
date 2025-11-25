import { createUser, findUserByEmail, verifyGoogleToken, findOrCreateGoogleUser } from './auth.service';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import logger from '../../utils/logger';

// Validate JWT_SECRET on startup
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return secret;
})();

// Validate Google Config on startup
(() => {
    const missing = [];
    if (!process.env.GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
    if (!process.env.GOOGLE_CLIENT_SECRET) missing.push('GOOGLE_CLIENT_SECRET');
    if (!process.env.GOOGLE_REDIRECT_URI) missing.push('GOOGLE_REDIRECT_URI');

    if (missing.length > 0) {
        logger.error(`FATAL ERROR: Missing Google OAuth config: ${missing.join(', ')}`);
        process.exit(1);
    }
})();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Dummy hash for timing attack prevention (valid bcrypt hash format that will never match)
// This ensures constant-time comparison even when user doesn't exist
const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcdefghijk';

// Utility function to generate JWT token
function generateToken(userId: number): string {
    const payload = { id: userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// Utility function to format user response
function formatUserResponse(user: { id: number; name: string; email: string; avatarUrl: string | null }) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
    };
}

const handleCreateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const ifUserExits = await findUserByEmail(email);
    if (ifUserExits != null) {
        res.status(409).json({
            message: "A user with this email address already exists."
        });
        return;
    }

    const user = await createUser(name, email, password);
    const token = generateToken(user.id);

    res.status(201).json({
        token: token,
        user: formatUserResponse(user)
    });
});

const handleVerifyUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

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



const handleGoogleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    // 1. Verify token and get payload
    const googleUser = await verifyGoogleToken(code);

    if (!googleUser) {
        res.status(400).json({ message: "Failed to retrieve user data from Google." });
        return;
    }

    // 2. Find or create user
    const user = await findOrCreateGoogleUser(googleUser);

    // 3. Generate Token
    const token = generateToken(user.id);

    // 4. Send response
    res.status(200).json({
        token,
        user: formatUserResponse(user)
    });
});

export { handleCreateUser, handleVerifyUser, handleGoogleLogin };