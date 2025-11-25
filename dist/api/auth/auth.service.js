"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.createGoogleUser = createGoogleUser;
exports.updateUserProfile = updateUserProfile;
exports.verifyGoogleToken = verifyGoogleToken;
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
const bcrypt = __importStar(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const client_1 = require("@prisma/client");
const prisma_1 = require("../../utils/prisma");
const logger_1 = __importDefault(require("../../utils/logger"));
// Validate salt rounds on startup
const saltRounds = (() => {
    const rounds = parseInt(process.env.SALTROUNDS || '10', 10);
    if (isNaN(rounds) || rounds < 10 || rounds > 15) {
        logger_1.default.warn('Invalid SALTROUNDS value, defaulting to 10', {
            providedValue: process.env.SALTROUNDS
        });
        return 10;
    }
    return rounds;
})();
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
async function createUser(name, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        return user;
    }
    catch (error) {
        logger_1.default.error("Error in create user", error instanceof Error ? error : new Error(String(error)), {
            email,
            operation: 'createUser'
        });
        // Handle Prisma unique constraint violation
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const errorMessage = error.meta?.target
                    ? `User with this ${error.meta.target.join(', ')} already exists`
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
async function createGoogleUser(name, email, picture) {
    try {
        const user = await prisma_1.prisma.user.create({
            data: {
                name: name,
                email: email,
                avatarUrl: picture
            }
        });
        return user;
    }
    catch (error) {
        logger_1.default.error("Error in create user", error instanceof Error ? error : new Error(String(error)), {
            email,
            operation: 'createUser'
        });
        // Handle Prisma unique constraint violation
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const errorMessage = error.meta?.target
                    ? `User with this ${error.meta.target.join(', ')} already exists`
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
async function findUserByEmail(email) {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return user;
    }
    catch (error) {
        logger_1.default.error("Error in finding user by email", error instanceof Error ? error : new Error(String(error)), {
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
async function verifyGoogleToken(code) {
    try {
        const { tokens } = await googleClient.getToken(code);
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    }
    catch (error) {
        logger_1.default.error("Error verifying Google token", error instanceof Error ? error : new Error(String(error)), {
            operation: 'verifyGoogleToken'
        });
        throw new Error('Invalid Google token');
    }
}
async function findOrCreateGoogleUser(payload) {
    if (!payload.email) {
        throw new Error('Google user must have an email');
    }
    let user = await findUserByEmail(payload.email);
    if (!user) {
        user = await createGoogleUser(payload.name || 'Google User', payload.email, payload.picture || null);
    }
    else if (!user.avatarUrl && payload.picture) {
        user = await updateUserProfile(user.id, payload.picture);
    }
    return user;
}
async function updateUserProfile(id, picture) {
    try {
        const user = await prisma_1.prisma.user.update({
            where: { id: id },
            data: { avatarUrl: picture }
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}
