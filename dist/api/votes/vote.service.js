"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVote = createVote;
exports.deleteVote = deleteVote;
const prisma_1 = require("../../utils/prisma");
async function createVote(pollId, optionId, userId) {
    try {
        const voteCreated = await prisma_1.prisma.$transaction(async (tx) => {
            // Verify that the option belongs to the poll
            const option = await tx.option.findFirst({
                where: {
                    id: optionId,
                    pollId: pollId
                }
            });
            if (!option) {
                throw new Error("Option does not belong to this poll");
            }
            // Check if user already voted for this poll
            const existingVote = await tx.vote.findFirst({
                where: {
                    userId: userId,
                    pollId: pollId
                }
            });
            if (existingVote) {
                // User already voted, update the vote
                if (existingVote.optionId === optionId) {
                    // User is voting for the same option, return existing vote
                    return existingVote;
                }
                // Decrement old option vote count
                await tx.option.update({
                    where: { id: existingVote.optionId },
                    data: {
                        votes: {
                            decrement: 1
                        }
                    }
                });
                // Increment new option vote count
                await tx.option.update({
                    where: { id: optionId },
                    data: {
                        votes: {
                            increment: 1
                        }
                    }
                });
                // Update the vote record
                const updatedVote = await tx.vote.update({
                    where: {
                        id: existingVote.id
                    },
                    data: {
                        optionId: optionId
                    }
                });
                return updatedVote;
            }
            else {
                // New vote - increment option vote count and create vote
                await tx.option.update({
                    where: { id: optionId },
                    data: {
                        votes: {
                            increment: 1
                        }
                    }
                });
                const newVote = await tx.vote.create({
                    data: {
                        pollId: pollId,
                        optionId: optionId,
                        userId: userId
                    }
                });
                return newVote;
            }
        });
        return voteCreated;
    }
    catch (error) {
        console.error("Error creating/updating vote:", error);
        // Preserve the original error message if it's a known error
        if (error.message === "Option does not belong to this poll") {
            throw error;
        }
        throw new Error("Failed to create or update vote");
    }
}
async function deleteVote(pollId, userId) {
    try {
        const deletedVote = await prisma_1.prisma.$transaction(async (tx) => {
            // Find the vote
            const vote = await tx.vote.findFirst({
                where: {
                    userId: userId,
                    pollId: pollId
                }
            });
            if (!vote) {
                throw new Error("Vote not found");
            }
            // Decrement the option vote count
            await tx.option.update({
                where: { id: vote.optionId },
                data: {
                    votes: {
                        decrement: 1
                    }
                }
            });
            // Delete the vote record
            const deleted = await tx.vote.delete({
                where: {
                    id: vote.id
                }
            });
            return deleted;
        });
        return deletedVote;
    }
    catch (error) {
        console.error("Error deleting vote:", error);
        // Preserve the original error message if it's a known error
        if (error.message === "Vote not found") {
            throw error;
        }
        throw new Error("Failed to delete vote");
    }
}
