import { z } from 'zod';

const UserUpdateSchema = z.object({
    name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
});

export { UserUpdateSchema };
