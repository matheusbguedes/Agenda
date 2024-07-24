import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function coordinationRoutes(app: FastifyInstance) {
  app.get("/coordination/schedules", async (request) => {
    const schedules = await prisma.scheduling.findMany({
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
}
