import type { Router } from 'express';
import express from 'express';

import { currentUser } from '@/lib/middleware/auth';
import type { UserInterface } from '@/models';
import { UserUsecase } from '@/usecase/users/user';

const router: Router = express.Router();

const userUseCase = new UserUsecase();

router.get('/', currentUser, async (req, res) => {
  const userId = req.user!.id;
  const user = await userUseCase.findById(userId);
  res.status(200).json(user);
});

router.patch('/:id', currentUser, async (req, res) => {
  const userId = req.params.id as string;
  const data = req.body as Partial<UserInterface>;
  const user = await userUseCase.updateUser(userId, data);
  res.status(200).json(user);
});

router.delete('/:id', currentUser, async (req, res) => {
  const userId = req.params.id as string;
  await userUseCase.deleteUser(userId);
  res.status(200).json({ message: 'user deleted successfully' });
});

export { router as UserRouter };
