import { Poll, Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma'


async function createPoll(pollQuestion: string, pollOptions: string[]): Promise<Poll> {
    try {
        const newPoll = await prisma.$transaction(async (tx) => {
            const poll = await tx.poll.create({
                data: {
                    question: pollQuestion
                }
            })
            const optionsData = pollOptions.map((option, indx) => {
                return {
                    text: option,
                    pollId: poll.id
                }
            })
            await tx.option.createMany({
                data: optionsData
            });

            return poll;
        })

        return newPoll;
    }
    catch (error) {
        console.error("Failed to create poll:", error);
        throw new Error("Database error: Could not create the poll.");
    }

}

type PollWithOptionsMenu = Prisma.PollGetPayload<{
    include: {
        options: true
    }
}>

async function readPoll(pollId: number): Promise<PollWithOptionsMenu | null> {
    try {
        const pollWithOptionsMenu = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: true
            }
        })

        if (!pollWithOptionsMenu) {
            console.log(`Poll with ID ${pollId} not found.`);
            return null
        }

        return pollWithOptionsMenu;
    }
    catch (error) {
        console.error("Error occured while reading the poll", error)
        throw new Error("Somthing went wrong while reading the poll");
    }
}


async function updatePoll(optionId: number, pollId: number): Promise<PollWithOptionsMenu | null> {
    try {
        await prisma.option.update({
            where: {
                id: optionId
            },
            data: {
                votes: {
                    increment: 1
                }
            }
        })

        return readPoll(pollId)
    }
    catch (error) {
        console.error("Error occurred while updating the poll:", error);
        throw new Error("Something went wrong while updating the poll.");
    }

}

export {createPoll , readPoll , updatePoll};
