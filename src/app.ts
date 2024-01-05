import "express-async-errors";

import type { Application } from "express";
import express, { json } from "express";
import helmet from "helmet";

import { EventRouter } from "./functions/event.function";
import { UserRouter } from "./functions/user.function";
import { AuthRouter } from "./functions/auth.function";

const app: Application = express();

app.use(json());

app.use(helmet());

app.use("/users", UserRouter);
app.use("/event", EventRouter);
app.use("/auth", AuthRouter);
app.all("*", async (_, res) => {
  res.status(404).send("route not found");
});

export { app };
