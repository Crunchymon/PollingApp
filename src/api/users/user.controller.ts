import { Request, Response } from "express";
import { getUserInfo } from "./user.service";
import logger from "../../utils/logger";
import asyncHandler from 'express-async-handler';
const handleGetUserInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const user = await getUserInfo(req.body.payload.id);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    res.status(200).json({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatarUrl": user.avatarUrl,
    });

})


export { handleGetUserInfo };