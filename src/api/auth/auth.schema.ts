import { z } from 'zod';

const UserSignUp = z.object({
    name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address')
        .max(255, 'Email must be less than 255 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

const UserLoginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .max(128, 'Password must be less than 128 characters')
});

const GoogleLoginSchema = z.object({
    code: z.string().min(1, "Authorization code is required")
});

export { UserSignUp, UserLoginSchema, GoogleLoginSchema };