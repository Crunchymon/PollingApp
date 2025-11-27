import { Poll, Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma'


async function createPoll(pollQuestion: string, pollOptions: string[], id: number): Promise<Poll> {
    try {
        const newPoll = await prisma.$transaction(async (tx) => {
            const poll = await tx.poll.create({
                data: {
                    question: pollQuestion,
                    authorId: id
                }
            })
            const optionsData = pollOptions.map((option) => {
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

type PollWithOptionsMenu = {
    id: number;
    question: string;
    createdAt : Date;
    author: {
        id: number;
        name: string;
        avatarUrl: string | null;
    };
    options: {
        id: number;
        text: string;
        votes: number;
        voters: {
            id: number;
            name: string;
            avatarUrl: string | null;
        }[];
    }[];
}



async function readPoll(pollId: number): Promise<PollWithOptionsMenu | null> {
    try {
        const pollWithOptionsMenu = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            select: {
                id: true,
                question: true,
                createdAt : true,
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
        })

        if (!pollWithOptionsMenu) {
            console.log(`Poll with ID ${pollId} not found.`);
            return null
        }

        // Transform the response to flatten voters array
        const transformedPoll: PollWithOptionsMenu = {
            id: pollWithOptionsMenu.id,
            createdAt : pollWithOptionsMenu.createdAt,
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
        console.error("Error occured while reading the poll", error)
        throw new Error("Somthing went wrong while reading the poll");
    }
}


interface getPollsParams {
    userId: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'question';
    order?: 'asc' | 'desc';
}

type PollsResponse = {
    data: PollWithOptionsMenu[],
    meta: {
        totalPolls: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

async function getMyPolls({ userId, search, page = 1, limit = 5, sortBy = "createdAt", order = "desc" }: getPollsParams): Promise<PollsResponse> {
    try {
        // 1. Calculate Pagination logic
        const skip = (page - 1) * limit;

        // 2. Build the "Where" clause (Filtering)
        // We always filter by authorId (My Polls). 
        // If a search term exists, we ALSO filter by the question text.
        const whereClause: Prisma.PollWhereInput = {
            authorId: userId,
            ...(search && {
                question: {
                    contains: search, // Search for text INSIDE the question
                    // mode: 'insensitive' // Optional: if you want case-insensitive search (Postgres only usually, check MySQL support)
                }
            })
        };

        // 3. Run two queries in a transaction: Get Data + Get Total Count
        const [polls, totalCount] = await prisma.$transaction([
            prisma.poll.findMany({
                where: whereClause,
                orderBy: {
                    [sortBy]: order // Dynamic sorting
                },
                take: limit, // Limit results
                skip: skip,  // Skip previous pages
                include: {
                    author: {
                        select: { id: true, name: true, avatarUrl: true } // Only get public fields
                    },
                    options: {
                        include: {
                            voters: { // Get the votes...
                                include: {
                                    user: { // ...and the user who voted
                                        select: { id: true, name: true, avatarUrl: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            prisma.poll.count({ where: whereClause }) // Count TOTAL matching items for pagination
        ]);

        // 4. Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        const formattedData: PollWithOptionsMenu[] = polls.map(poll => ({
            id: poll.id,
            question: poll.question,
            createdAt: poll.createdAt,
            author: poll.author, // Matches your type
            options: poll.options.map(option => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
                // Flatten the structure: Vote -> User becomes just User
                voters: option.voters.map(vote => vote.user)
            }))
        }));
        // 5. Return the structured response
        return {
            data: formattedData,
            meta: {
                totalPolls: totalCount,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        };

    }
    catch (error) {
        console.error("Error occured while reading the poll", error)
        throw new Error("Somthing went wrong while reading the poll");
    }
}

async function deletePoll(userId: number, id: number): Promise<Poll> {
    try {
        const deletedPoll = await prisma.poll.delete({
            where: {
                id: id,
                authorId: userId
            }
        })

        return deletedPoll;
    }
    catch (error) {
        console.error("Error occurred while deleting the poll", error);
        throw new Error("Something went wrong while deleting the poll");
    }
}

async function updatePoll(userId: number, id: number, question: string): Promise<Poll> {
    try {
        const updatedPoll = await prisma.poll.update({
            where: {
                id: id,
                authorId: userId
            },
            data: {
                question: question
            }
        })

        return updatedPoll;
    }
    catch (error) {
        console.error("Error occurred while updating the poll", error);
        throw new Error("Something went wrong while updating the poll");
    }
}

export { createPoll, readPoll, getMyPolls, deletePoll, updatePoll };
