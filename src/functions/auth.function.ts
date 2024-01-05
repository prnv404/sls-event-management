import { currentUser } from "@/lib/middleware/auth";
import { UserInterface } from "@/models";
import { UserAuthUseCase } from "@/usecase/users/auth";
import { UserUsecase } from "@/usecase/users/user";
import type { Router } from "express";
import express from "express";

const router: Router = express.Router();

const authService = new UserAuthUseCase(new UserUsecase());

router.post("/signup", async (req, res) => {
  try {
    const data = req.body as UserInterface;
    const {status,message} = await authService.create(data);
    res.status(200).json({message,status});
  } catch (e) {
    console.log(e);
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token as string
    const { accessToken } = await authService.verifyEmail(token);
    res.status(200).json({ accessToken });
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const { accessToken } = await authService.Login(email, password);
    res.status(201).json({
      accessToken,
    });
  } catch (e) {}
});

router.post("/logout",currentUser, async (req, res) => {
  try {
    const userId = req.user!.id
    const status = await authService.logout(userId);
    res.status(201).json({
      status,
    });
  } catch (e) {
    console.log(e);
  }
});

export { router as AuthRouter };
