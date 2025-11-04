"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginSchema = exports.UserSignUp = void 0;
const zod_1 = require("zod");
const UserSignUp = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
    email: zod_1.z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address')
        .max(255, 'Email must be less than 255 characters'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});
exports.UserSignUp = UserSignUp;
const UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .trim()
        .toLowerCase()
        .email('Invalid email address'),
    password: zod_1.z.string()
        .min(1, 'Password is required')
        .max(128, 'Password must be less than 128 characters')
});
exports.UserLoginSchema = UserLoginSchema;
