import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import logger from './logger';
import * as jwt from 'jsonwebtoken';


// Validate JWT_SECRET on startup
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return secret;
})();

const validate = (schema: z.Schema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (e: unknown) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ errors: e.issues });
            }
            return res.status(400).json({ message: 'Validation error' });
        }
    }

function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error('An unexpected error occurred', error, {
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    res.status(500).json({ message: "Something went wrong on the server." });
}

// Rate limiting for auth endpoints
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});



function authenticate(req: Request, res: Response, next: NextFunction) {
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

        req.payload = payload as CustomJwtPayload;
        next();
    } catch (error) {
        res.status(401).json({ message: "You are not authorised to access this page" });
    }
}

export { validate, errorHandler, authRateLimiter , authenticate};