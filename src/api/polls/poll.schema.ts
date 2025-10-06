import {z} from 'zod';

const createPollSchema = z.object({
    pollQuestion : z.string().min(1),
    pollOptions: z.string().min(1).array().min(2)
});

export {createPollSchema};