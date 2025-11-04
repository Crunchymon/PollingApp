import { Router } from 'express';
import { handleCreateUser, handleVerifyUser } from './auth.controller';
import { validate, authRateLimiter } from '../../utils/middleware';
import { UserSignUp, UserLoginSchema } from './auth.schema';

const authRoutes = Router();

authRoutes.post('/signup', authRateLimiter, validate(UserSignUp), handleCreateUser);
authRoutes.post('/login', authRateLimiter, validate(UserLoginSchema), handleVerifyUser);

export {authRoutes};