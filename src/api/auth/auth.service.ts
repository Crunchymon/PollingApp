import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
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

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

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

async function createGoogleUser(name: string, email: string, picture: string | null): Promise<User> {
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                avatarUrl: picture
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

async function verifyGoogleToken(code: string) {
    try {
        const { tokens } = await googleClient.getToken(code);
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        logger.error("Error verifying Google token", error instanceof Error ? error : new Error(String(error)), {
            operation: 'verifyGoogleToken'
        });
        throw new Error('Invalid Google token');
    }
}

async function findOrCreateGoogleUser(payload: { name?: string; email?: string; picture?: string | null }): Promise<User> {
    if (!payload.email) {
        throw new Error('Google user must have an email');
    }

    let user = await findUserByEmail(payload.email);

    if (!user) {
        user = await createGoogleUser(payload.name || 'Google User', payload.email, payload.picture || null);
    } else if (!user.avatarUrl && payload.picture) {
        user = await updateUserProfile(user.id, payload.picture);
    }

    return user;
}

async function updateUserProfile(id: number, picture: string): Promise<User> {
    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { avatarUrl: picture }
        });
        return user;
    } catch (error) {
        throw error;
    }
}

export { createUser, findUserByEmail, createGoogleUser, updateUserProfile, verifyGoogleToken, findOrCreateGoogleUser };
