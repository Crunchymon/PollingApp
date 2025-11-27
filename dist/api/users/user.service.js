"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
exports.updateUserInfo = updateUserInfo;
const prisma_1 = require("../../utils/prisma");
async function getUserInfo(id) {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    }
    catch (error) {
        console.error("Something went wrong while getting the user Info", error);
        throw new Error("Something went wrong while getting the user Info");
    }
}
async function updateUserInfo(id, name) {
    try {
        const newUser = await prisma_1.prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });
        return newUser;
    }
    catch (error) {
        console.error("Something went wrong while updating the user Info", error);
        throw new Error("Something went wrong while updating the user Info");
    }
}
