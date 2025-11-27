"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePollSchema = exports.createPollSchema = void 0;
const zod_1 = require("zod");
const createPollSchema = zod_1.z.object({
    question: zod_1.z.string().min(1),
    options: zod_1.z.string().min(1).array().min(2)
});
exports.createPollSchema = createPollSchema;
const updatePollSchema = zod_1.z.object({
    question: zod_1.z.string().min(1)
});
exports.updatePollSchema = updatePollSchema;
