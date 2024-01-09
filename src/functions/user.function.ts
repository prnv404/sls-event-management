/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
import type { Router } from "express";
import express from "express";

import { currentUser } from "@/lib/middleware/auth";
import type { UserInterface } from "@/models";
import { UserUsecase } from "@/usecase/users/user";
import { AWS } from "@/services/aws.service";

const router: Router = express.Router();

const userUseCase = new UserUsecase();
const awsService = new AWS();

router.get("/", currentUser, async (req, res) => {
  const userId = req.user!.id;
  const user = await userUseCase.findById(userId);
  res.status(200).json(user);
});

router.patch("/:id", currentUser, async (req, res) => {
  const userId = req.params.id as string;
  const data = req.body as Partial<UserInterface>;
  const user = await userUseCase.updateUser(userId, data);
  res.status(200).json(user);
});

router.delete("/:id", currentUser, async (req, res) => {
  const userId = req.params.id as string;
  await userUseCase.deleteUser(userId);
  res.status(200).json({ message: "user deleted successfully" });
});

router.get("/signed-url-upload", async (req, res) => {
  const key = req.query as {
    fileName: string;
    extension: string;
    mediaType: string;
  };
  const url = await awsService.s3GetSignedUrl(key);
  res.json({ url });
});

router.get("/signed-url-access", async (req, res) => {
  const key = req.query.key as string;
  const url = await awsService.signedUrlAcess(key);
  res.json({ uploadUrl: url });
});

export { router as UserRouter };
