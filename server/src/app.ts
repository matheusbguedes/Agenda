import "dotenv/config";

import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { schedulesRoutes } from "./routes/schedules";
import { uploadRoutes } from "./routes/upload";
import { env } from "./env";

export const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: env.SERVER_SECRET,
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(schedulesRoutes, { prefix: "/schedule" });
