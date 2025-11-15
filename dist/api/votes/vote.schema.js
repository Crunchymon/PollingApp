"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoteSchema = void 0;
const zod_1 = require("zod");
const createVoteSchema = zod_1.z.object({
    pollId: zod_1.z.number(),
    optionId: zod_1.z.number()
});
exports.createVoteSchema = createVoteSchema;
