import {z} from 'zod';

const createVoteSchema = z.object({
    pollId : z.number(),
    optionId: z.number()
});

export {createVoteSchema};