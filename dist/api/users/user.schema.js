"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateSchema = void 0;
const zod_1 = require("zod");
const UserUpdateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
});
exports.UserUpdateSchema = UserUpdateSchema;
