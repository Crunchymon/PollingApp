import { Router } from 'express';
import { validate, authenticate } from '../../utils/middleware';
import { UserUpdateSchema } from './user.schema';
import { handleGetUserInfo, handleUpdateUserInfo } from './user.controller';

const userRoutes = Router();

// Get current user info (authenticated endpoint)
userRoutes.get('/me', authenticate, handleGetUserInfo);
userRoutes.patch('/me', validate(UserUpdateSchema), authenticate , handleUpdateUserInfo);

export { userRoutes };