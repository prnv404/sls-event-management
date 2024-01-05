import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  isVerified:boolean
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.split("Bearer ")[1]
    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as UserPayload
    req.user = payload
    next()
  } catch (e) {
    
    res.status(401).json({message:"not authorized please login"})
    
  } 
};