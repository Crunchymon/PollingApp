import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import logger from './logger';

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

export { validate, errorHandler, authRateLimiter };