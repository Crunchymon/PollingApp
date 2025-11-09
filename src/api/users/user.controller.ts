import { Request, Response } from "express";
import { getUserInfo } from "./user.service";
import logger from "../../utils/logger";

async function handleGetUserInfo(req: Request, res: Response): Promise<void> {
    try {
        const user = await getUserInfo(req.payload.id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        res.status(200).json(user);
    } catch (error) {
        logger.error("Error fetching user info", error, {
            userId: req.payload.id,
            path: req.path
        });
        res.status(500).json({ message: "Failed to fetch user information" });

    }
}

export { handleGetUserInfo };