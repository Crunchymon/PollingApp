"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const middleware_1 = require("../../utils/middleware");
const user_schema_1 = require("./user.schema");
const user_controller_1 = require("./user.controller");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
// Get current user info (authenticated endpoint)
userRoutes.get('/me', middleware_1.authenticate, user_controller_1.handleGetUserInfo);
userRoutes.patch('/me', (0, middleware_1.validate)(user_schema_1.UserUpdateSchema), middleware_1.authenticate, user_controller_1.handleUpdateUserInfo);
