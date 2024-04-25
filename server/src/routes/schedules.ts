import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function schedulesRoutes(app: FastifyInstance) {
  app.get("/schedules", async (request) => {
    const schedules = await prisma.scheduling.findMany();

    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        userId: schedule.userId,
        appointmentDate: schedule.appointmentDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        resourceUsed: schedule.resourceUsed,
        roomUsed: schedule.roomUsed,
        status: schedule.status,
        createdAt: schedule.createdAt,
      };
    });
  });

  app.post("/schedule", async (request, response) => {
    const bodySchema = z.object({
      userId: z.string(),
      appointmentDate: z.date(),
      startTime: z.string(),
      endTime: z.string(),
      resourceUsed: z.string().optional(),
      roomUsed: z.string().optional(),
      isActive: z.boolean(),
    });

    const {
      userId,
      appointmentDate,
      startTime,
      endTime,
      resourceUsed,
      roomUsed,
      isActive,
    } = bodySchema.parse(request.body);

    const schedule = await prisma.scheduling.create({
      data: {
        userId,
        appointmentDate,
        startTime,
        endTime,
        resourceUsed,
        roomUsed,
        isActive,
      },
    });

    return schedule;
  });

  app.delete("/schedule/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.scheduling.delete({
      where: {
        id,
      },
    });
  });
}
