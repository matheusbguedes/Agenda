"use client";

import api from "@/lib/api";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { CalendarFold, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "./card";
import { Button } from "./ui/button";

export default function MySchedules({ user }: { user: User }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showAllPastSchedules, setShowAllPastSchedules] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getSchedules = async () => {
    try {
      setIsLoading(true);
      const response =
        user.role === "coordination"
          ? await api.get(`/coordination/schedules`)
          : await api.get(`/schedule/user/${user.id}`);

      setSchedules(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos", error);
    } finally {
      setIsLoading(false);
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

  const displayedNonActiveSchedules = showAllPastSchedules
    ? nonActiveSchedules
    : nonActiveSchedules.slice(0, 4);

  useEffect(() => {
    getSchedules();
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen flex justify-center items-center pt-10">
        <Loader2 className="text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center gap-6 py-10">
      {activeSchedules.length > 0 && (
        <div className="container flex flex-col gap-2">
          <span className="w-full inline-flex text-zinc-600">
            Próximos agendamentos
          </span>
          <div className="w-full flex flex-wrap gap-4">
            {activeSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                userRole={user.role}
                schedule={schedule}
                active
              />
            ))}
          </div>
        </div>
      )}

      {nonActiveSchedules.length > 0 && (
        <div className="container flex flex-col gap-4">
          <span className="w-full inline-flex text-zinc-600">
            Últimos agendamentos
          </span>
          <div className="w-full flex flex-wrap gap-4">
            {displayedNonActiveSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                userRole={user.role}
                schedule={schedule}
              />
            ))}
          </div>

          {nonActiveSchedules.length > 4 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAllPastSchedules(!showAllPastSchedules)}
                className="flex items-center gap-2 bg-transparent border-none text-zinc-400 hover:text-zinc-400 hover:bg-zinc-950/20"
              >
                {showAllPastSchedules ? (
                  <>
                    Ver menos <ChevronUp size={20} />
                  </>
                ) : (
                  <>
                    Ver mais <ChevronDown size={20} />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {schedules.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 text-zinc-500">
          <CalendarFold strokeWidth={1} className="h-10 w-10 text-zinc-500" />
          <p className="text-center">Você não tem nenhum agendamento</p>
        </div>
      )}
    </div>
  );
}
