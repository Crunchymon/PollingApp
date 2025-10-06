import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validate = (schema: z.Schema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (e: any) {
            return res.status(400).json({ errors: e.errors });
        }
    }

function errorHandler(
    error : Error,
    req : Request,
    res : Response,
    next : NextFunction
){
    console.error("An unexpected error occurred:", error.message);
    res.status(500).json({ message: "Something went wrong on the server." });
}

export {validate , errorHandler};