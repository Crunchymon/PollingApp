import { Router } from 'express';
import { handleCreateUser, handleVerifyUser, handleGoogleLogin } from './auth.controller';
import { validate, authRateLimiter } from '../../utils/middleware';
import { UserSignUp, UserLoginSchema, GoogleLoginSchema } from './auth.schema';

const authRoutes = Router();

authRoutes.post('/signup', authRateLimiter, validate(UserSignUp), handleCreateUser);
authRoutes.post('/login', authRateLimiter, validate(UserLoginSchema), handleVerifyUser);
authRoutes.post('/google', validate(GoogleLoginSchema), handleGoogleLogin);

export { authRoutes };