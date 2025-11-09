import { JwtPayload } from 'jsonwebtoken';

// This file tells TypeScript to add a 'payload' property to
// the global Express.Request type.



declare global {
  interface CustomJwtPayload extends JwtPayload {
    id: number;
  }

  namespace Express {
    export interface Request {
      // You can use 'any' if you don't want to type-check it
      // payload?: any; 

      // Or, be more specific:
      payload: CustomJwtPayload;
    }
  }
}

// This empty export is needed to make the file a "module"
export {};