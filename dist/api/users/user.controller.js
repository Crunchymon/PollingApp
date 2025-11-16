"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUserInfo = void 0;
const user_service_1 = require("./user.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const handleGetUserInfo = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await (0, user_service_1.getUserInfo)(req.body.payload.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatarUrl": user.avatarUrl,
    });
});
exports.handleGetUserInfo = handleGetUserInfo;
