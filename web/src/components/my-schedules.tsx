"use client";

import { api } from "@/lib/api";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import Card from "./card";

export default function MySchedules({ user }: { user: User }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const token = Cookie.get("token");
  const getSchedules = async () => {
    if (user.role == "coordination") {
      const response = await api.get(`/coordination/schedules`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSchedules(response.data);
    } else {
      const response = await api.get(`/schedules/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSchedules(response.data);
    }
  };

  const activeSchedules = schedules?.filter((schedule) => {
    const appointmentDate = parseISO(schedule.appointmentDate);
    const today = startOfDay(new Date());
    return (
      isAfter(appointmentDate, today) ||
      appointmentDate.getTime() === today.getTime()
    );
  });

  const nonActiveSchedules = schedules?.filter((schedule) => {
    const appointmentDate = parseISO(schedule.appointmentDate);
    const today = startOfDay(new Date());
    return isBefore(appointmentDate, today);
  });

  useEffect(() => {
    getSchedules();
  });

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center gap-6 py-8">
      <div className="container flex flex-col gap-2">
        <span className="w-full inline-flex text-zinc-600">
          Próximos agendamentos
        </span>
        <div className="w-full flex flex-wrap gap-4">
          {activeSchedules.map((schedule) => {
            return (
              <Card
                key={schedule.id}
                userRole={user.role}
                schedule={schedule}
                active
              />
            );
          })}
        </div>
      </div>

      <div className="container flex flex-col gap-4">
        <span className="w-full inline-flex text-zinc-600">
          Últimos agendamentos
        </span>
        <div className="w-full flex gap-4">
          {nonActiveSchedules.map((schedule) => {
            return (
              <Card
                key={schedule.id}
                userRole={user.role}
                schedule={schedule}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
