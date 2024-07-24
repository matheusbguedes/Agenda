import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function schedulesRoutes(app: FastifyInstance) {
  app.get("/schedules", async (request) => {
    const schedules = await prisma.scheduling.findMany({
      include: {
        user: true,
      },
    });

    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        userId: schedule.userId,
        userName: schedule.user.name,
        title: schedule.title,
        appointmentDate: schedule.appointmentDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        resourceUsed: schedule.resourceUsed,
        roomUsed: schedule.roomUsed,
        createdAt: schedule.createdAt,
      };
    });
  });

  app.get("/schedules/:userId", async (request) => {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const { userId } = paramsSchema.parse(request.params);

    const schedules = await prisma.scheduling.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        userId: schedule.userId,
        userName: schedule.user.name,
        appointmentDate: schedule.appointmentDate,
        title: schedule.title,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        resourceUsed: schedule.resourceUsed,
        roomUsed: schedule.roomUsed,
        createdAt: schedule.createdAt,
      };
    });
  });

  app.post("/schedule", async (request, response) => {
    const bodySchema = z.object({
      userId: z.string(),
      appointmentDate: z.string().date(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      resourceUsed: z.string().optional(),
      roomUsed: z.string().optional(),
    });

    const {
      userId,
      appointmentDate,
      title,
      startTime,
      endTime,
      resourceUsed,
      roomUsed,
    } = bodySchema.parse(request.body);

    const schedule = await prisma.scheduling.create({
      data: {
        userId,
        appointmentDate,
        title,
        startTime,
        endTime,
        resourceUsed,
        roomUsed,
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
