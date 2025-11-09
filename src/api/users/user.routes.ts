import { Router } from 'express';
import { authenticate } from '../../utils/middleware';
import { handleGetUserInfo } from './user.controller';

const userRoutes = Router();

// Get current user info (authenticated endpoint)
userRoutes.get('/me', authenticate, handleGetUserInfo);

export { userRoutes };