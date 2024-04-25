import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    let user = await prisma.user.findFirstOrThrow({
      where: {
        email,
        password,
      },
    });

    const token = app.jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "10 days",
      }
    );

    return {
      token,
    };
  });
}
