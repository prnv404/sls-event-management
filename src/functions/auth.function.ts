import type { Router } from 'express';
import express from 'express';

import { currentUser } from '@/lib/middleware/auth';
import type { UserInterface } from '@/models';
import { UserAuthUseCase } from '@/usecase/users/auth';
import { UserUsecase } from '@/usecase/users/user';

const router: Router = express.Router();

const authService = new UserAuthUseCase(new UserUsecase());

router.post('/signup', async (req, res) => {
  try {
    const data = req.body as UserInterface;
    const { status, message, link } = await authService.create(data);
    res.status(200).json({ message, status, verificationLink: link });
  } catch (e) {
    console.log(e);
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const token = req.query.token as string;
    const { accessToken, refreshToken } = await authService.verifyEmail(token);
    // sending client side session
    req.session = {
      accessToken,
      refreshToken,
    };
    res.status(200).json({
      status: true,
      message: 'email verified successfully',
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const { accessToken, refreshToken } = await authService.Login(
      email,
      password,
    );
    // sending client side session
    req.session = {
      accessToken,
      refreshToken,
    };
    res.status(200).json({
      status: true,
      message: 'logedIn successfully',
    });
  } catch (e) {}
});

router.post('/logout', currentUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    const status = await authService.logout(userId);
    req.session = null;
    res.status(201).json({
      status,
    });
  } catch (e) {
    console.log(e);
  }
});

export { router as AuthRouter };
