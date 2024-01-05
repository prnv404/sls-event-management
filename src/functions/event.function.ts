import type { Router } from "express";
import express from "express";

import type { STATUS } from "@/lib/types";
import type { AttendeInterface, EventInterface } from "@/models";
import { EventUseCase } from "@/usecase/event";
import { UserUsecase } from "@/usecase/users/user";
import { currentUser } from "@/lib/middleware/auth";

const router: Router = express.Router();

const eventUseCase = new EventUseCase();
const userUseCase = new UserUsecase();

router.post("/create",currentUser, async (req, res) => {
  const data = req.body as EventInterface;
  const userId = req.user!.id;
  const event = await eventUseCase.create(userId, data);
  res.status(200).json(event);
});

router.get("/:id",currentUser, async (req, res) => {
  const eventId = req.params.id!;
  const events = await eventUseCase.findById(eventId);
  res.status(200).json(events);
});

// get all events of a user
router.get("/user",currentUser, async (req, res) => {
  const userId = req.user!.id
  const event = await eventUseCase.findBdyUserId(userId);
  res.status(200).json(event);
});

router.patch("/:id",currentUser, async (req, res) => {
  const eventId = req.params.id!;
  const data = req.body as Partial<EventInterface>;
  const event = await eventUseCase.update(eventId, data);
  res.status(200).json(event);
});

router.delete("/:id", currentUser,async (req, res) => {
  const eventId = req.params.id!;
  const event = await eventUseCase.delete(eventId);
  res.status(200).json(event);
});

router.post("/attend/:id",currentUser, async (req, res) => {
  const data = req.body as AttendeInterface;
  const attendee = await userUseCase.attendEvent(data);
  res.status(200).json(attendee);
});

router.patch("/attend/:id", currentUser,async (req, res) => {
  const attendId = req.params.id!;
  const userId = req.user!.id
   const status = req.query.status as STATUS
  const attendee = await userUseCase.updateParticipation(
    attendId,
    userId,
    status
  );
  res.status(200).json(attendee);
});

export { router as EventRouter };
