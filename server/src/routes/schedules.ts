import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function schedulesRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const schedules = await prisma.scheduling.findMany({
      include: {
        user: true,
      },
    });

    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        user_id: schedule.user_id,
        user_name: schedule.user.name,
        title: schedule.title,
        appointment_date: schedule.appointment_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        resource_id: schedule.resource_id,
        room_id: schedule.room_id,
        created_at: schedule.created_at,
      };
    });
  });

  app.get("/user/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const schedules = await prisma.scheduling.findMany({
      where: {
        user_id: id,
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        user_id: schedule.user_id,
        user_name: schedule.user.name,
        appointment_date: schedule.appointment_date,
        title: schedule.title,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        resource_id: schedule.resource_id,
        room_id: schedule.room_id,
        created_at: schedule.created_at,
      };
    });
  });

  app.post("/", async (request) => {
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
        user_id: userId,
        appointment_date: appointmentDate,
        title,
        start_time: startTime,
        end_time: endTime,
        resource_id: resourceUsed,
        room_id: roomUsed,
      },
    });

    return schedule;
  });

  app.delete("/:id", async (request) => {
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
