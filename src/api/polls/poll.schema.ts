import {z} from 'zod';

const createPollSchema = z.object({
    question : z.string().min(1),
    options: z.string().min(1).array().min(2)
});

const updatePollSchema = z.object({
    question : z.string().min(1)
})

export {createPollSchema , updatePollSchema};