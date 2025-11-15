"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
const prisma_1 = require("../../utils/prisma");
async function getUserInfo(id) {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return user;
}
