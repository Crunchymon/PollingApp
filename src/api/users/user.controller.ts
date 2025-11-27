import { Request, Response } from "express";
import { getUserInfo, updateUserInfo } from "./user.service";
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

const handleUpdateUserInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const { name } = req.body;
    const user = await getUserInfo(req.body.payload.id);

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return
    }

    const updatedUser = await updateUserInfo(user.id, name);

    res.status(200).json({
        "id": updatedUser.id,
        "name": updatedUser.name,
        "email": updatedUser.email,
        "avatarUrl": updatedUser.avatarUrl,
    });

})


export { handleGetUserInfo, handleUpdateUserInfo };