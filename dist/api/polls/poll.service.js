"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = createPoll;
exports.readPoll = readPoll;
exports.getMyPolls = getMyPolls;
exports.deletePoll = deletePoll;
exports.updatePoll = updatePoll;
const prisma_1 = require("../../utils/prisma");
async function createPoll(pollQuestion, pollOptions, id) {
    try {
        const newPoll = await prisma_1.prisma.$transaction(async (tx) => {
            const poll = await tx.poll.create({
                data: {
                    question: pollQuestion,
                    authorId: id
                }
            });
            const optionsData = pollOptions.map((option) => {
                return {
                    text: option,
                    pollId: poll.id
                };
            });
            await tx.option.createMany({
                data: optionsData
            });
            return poll;
        });
        return newPoll;
    }
    catch (error) {
        console.error("Failed to create poll:", error);
        throw new Error("Database error: Could not create the poll.");
    }
}
async function readPoll(pollId) {
    try {
        const pollWithOptionsMenu = await prisma_1.prisma.poll.findUnique({
            where: {
                id: pollId
            },
            select: {
                id: true,
                question: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
                options: {
                    select: {
                        id: true,
                        text: true,
                        votes: true,
                        voters: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatarUrl: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!pollWithOptionsMenu) {
            console.log(`Poll with ID ${pollId} not found.`);
            return null;
        }
        // Transform the response to flatten voters array
        const transformedPoll = {
            id: pollWithOptionsMenu.id,
            question: pollWithOptionsMenu.question,
            author: pollWithOptionsMenu.author,
            options: pollWithOptionsMenu.options.map(option => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
                voters: option.voters.map(vote => vote.user)
            }))
        };
        return transformedPoll;
    }
    catch (error) {
        console.error("Error occured while reading the poll", error);
        throw new Error("Somthing went wrong while reading the poll");
    }
}
async function getMyPolls(id) {
    try {
        const pollsWithOptionsMenu = await prisma_1.prisma.poll.findMany({
            where: {
                authorId: id
            },
            select: {
                id: true,
                question: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
                options: {
                    select: {
                        id: true,
                        text: true,
                        votes: true,
                        voters: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatarUrl: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return pollsWithOptionsMenu.map(poll => ({
            id: poll.id,
            question: poll.question,
            author: poll.author,
            options: poll.options.map(option => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
                voters: option.voters.map(vote => vote.user)
            }))
        }));
    }
    catch (error) {
        console.error("Error occured while reading the poll", error);
        throw new Error("Somthing went wrong while reading the poll");
    }
}
async function deletePoll(userId, id) {
    try {
        const deletedPoll = await prisma_1.prisma.poll.delete({
            where: {
                id: id,
                authorId: userId
            }
        });
        return deletedPoll;
    }
    catch (error) {
        console.error("Error occurred while deleting the poll", error);
        throw new Error("Something went wrong while deleting the poll");
    }
}
async function updatePoll(userId, id, question) {
    try {
        const updatedPoll = await prisma_1.prisma.poll.update({
            where: {
                id: id,
                authorId: userId
            },
            data: {
                question: question
            }
        });
        return updatedPoll;
    }
    catch (error) {
        console.error("Error occurred while updating the poll", error);
        throw new Error("Something went wrong while updating the poll");
    }
}
