import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import logger from '../../utils/logger';

// Validate salt rounds on startup
const saltRounds = (() => {
    const rounds = parseInt(process.env.SALTROUNDS || '10', 10);
    if (isNaN(rounds) || rounds < 10 || rounds > 15) {
        logger.warn('Invalid SALTROUNDS value, defaulting to 10', { 
            providedValue: process.env.SALTROUNDS 
        });
        return 10;
    }
    return rounds;
})();

async function createUser(name: string, email: string, password: string): Promise<User> {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        return user;
    }
    catch (error) {
        logger.error("Error in create user", error instanceof Error ? error : new Error(String(error)), {
            email,
            operation: 'createUser'
        });
        
        // Handle Prisma unique constraint violation
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const errorMessage = error.meta?.target 
                    ? `User with this ${(error.meta.target as string[]).join(', ')} already exists`
                    : 'User with this email already exists';
                throw new Error(errorMessage);
            }
        }
        
        // Re-throw with original error context
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error(`Failed to create user: ${String(error)}`);
    }
}

async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return user;
    }
    catch (error) {
        logger.error("Error in finding user by email", error instanceof Error ? error : new Error(String(error)), {
            email,
            operation: 'findUserByEmail'
        });
        
        // Re-throw with original error context
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error(`Failed to find user: ${String(error)}`);
    }
}

export { createUser, findUserByEmail };
