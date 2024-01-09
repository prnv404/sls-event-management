/* eslint-disable consistent-return */
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthService } from '@/services/auth.service';

interface UserPayload {
  id: string;
  email: string;
  isVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.session?.accessToken;
    if (token) {
      const payload = jwt.verify(
        token!,
        process.env.JWT_SECRET!,
      ) as UserPayload;
      req.user = payload;
      next();
    } else {
      return res.status(401).json({ message: 'not authorized please login' });
    }
  } catch (e) {
    console.log(e);

    const refreshToken = req.session?.refreshToken;
    console.log('refresh', refreshToken);

    if (refreshToken) {
      const { accessToken } = (await AuthService.refreshAuth(refreshToken)) as {
        accessToken: string;
      };
      if (accessToken) {
        req.session = {
          accessToken,
          refreshToken,
        };
        return res.redirect(req.path);
      }
    } else {
      return res.status(401).json({ message: 'not authorized please login' });
    }
  }
};
