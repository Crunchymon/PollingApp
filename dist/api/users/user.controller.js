"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUserInfo = handleGetUserInfo;
const user_service_1 = require("./user.service");
const logger_1 = __importDefault(require("../../utils/logger"));
async function handleGetUserInfo(req, res) {
    try {
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
    }
    catch (error) {
        logger_1.default.error("Error fetching user info", error, {
            userId: req.payload.id,
            path: req.path
        });
        res.status(500).json({ message: "Failed to fetch user information" });
    }
}
