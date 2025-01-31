"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ban, ChevronLeftIcon, ChevronRightIcon, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import NewSchedule from "./new-schedule";
import { Button } from "./ui/button";

export default function Calendar({ user }: { user: User }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baseDate, setBaseDate] = useState(new Date());

  const startDay = startOfWeek(startOfMonth(baseDate));
  const endDay = endOfWeek(endOfMonth(baseDate));

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const days = Array.from(
    { length: differenceInDays(endDay, startDay) + 1 },
    (_, i) => {
      const day = addDays(startDay, i);
      const dayOfWeek = day.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        return day;
      }
    }
  ).filter(Boolean);

  const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const addMonth = (date: Date, amount: any) => {
    let newDate = new Date(date);
    newDate.setMonth(date.getMonth() + amount);
    return newDate;
  };

  const hasClickableDays = (date: any) => {
    const startDay = startOfMonth(date);
    const endDay = endOfMonth(date);
    const days = Array.from(
      { length: endDay.getDate() - startDay.getDate() + 1 },
      (_, i) => addDays(startDay, i)
    );
    return days.some(
      (day) =>
        isToday(day) ||
        isWithinInterval(day, {
          start: new Date(),
          end: addDays(new Date(), 14),
        })
    );
  };

  const getSchedules = async () => {
    try {
      const { data } = await api.get("/schedule");
      setSchedules(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <div className="container flex flex-col gap-2 mb-8">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          className="text-red-600 bg-zinc-900 hover:bg-zinc-900 rounded-md transition-colors hover:bg-red-600/20 cursor-pointer"
          disabled={!hasClickableDays(addMonth(baseDate, -1))}
          onClick={() => {
            const newDate = addMonth(baseDate, -1);
            if (hasClickableDays(newDate)) {
              setBaseDate(newDate);
            }
          }}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <h1 className="text-sm text-zinc-200 capitalize">
          {format(baseDate, "MMMM", { locale: ptBR })}
        </h1>

        <Button
          size="icon"
          className="text-red-600 bg-zinc-900 hover:bg-zinc-900 rounded-md transition-colors hover:bg-red-600/20 cursor-pointer"
          disabled={!hasClickableDays(addMonth(baseDate, 1))}
          onClick={() => {
            const newDate = addMonth(baseDate, 1);
            if (hasClickableDays(newDate)) {
              setBaseDate(newDate);
            }
          }}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
      <div className="w-full grid grid-cols-5 border-2 border-zinc-800 rounded-lg">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="flex justify-center items-center py-4 border-b border-zinc-800 text-sm font-medium text-zinc-600"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isSelectable =
            isToday(day!) ||
            isWithinInterval(day!, {
              start: new Date(),
              end: addDays(new Date(), 18),
            });

          const isCurrentMonth = isSameMonth(day!, baseDate);

          const dayFormatted = format(day!, "yyyy-MM-dd");
          const daySchedules = schedules?.filter(
            (schedule) => schedule.appointmentDate === dayFormatted
          );

          return (
            <Dialog key={index}>
              <DialogTrigger disabled={!isSelectable}>
                <div
                  className={`h-32 p-4 text-right border border-zinc-800 ${
                    !isCurrentMonth && "text-zinc-700 opacity-50"
                  } text-zinc-400 ${
                    format(day!, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd") && "bg-zinc-800"
                  } ${
                    !isSelectable
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-zinc-800/25"
                  } ${!isCurrentMonth ? "opacity-75" : ""}`}
                  onClick={() => {
                    if (isSelectable) {
                      setSelectedDate(day!);
                    }
                  }}
                >
                  {/* days */}
                  {isToday(day!) ? (
                    <div className="w-full inline-flex justify-end">
                      <span className="size-10 flex justify-center items-center p-1 rounded-full font-medium text-red-600 border-2 border-red-600">
                        {format(day!, "dd")}
                      </span>
                    </div>
                  ) : isSelectable ? (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <span className="w-full inline-flex justify-end">
                        {format(day!, "dd")}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col text-zinc-800">
                      <span className="w-full inline-flex justify-end items-center gap-2">
                        <Ban className="size-4 text-red-600/40" />
                        {format(day!, "dd")}
                      </span>
                    </div>
                  )}
                  {/* schedules */}
                  {isSelectable &&
                    daySchedules.slice(0, 2).map((schedule, i) => (
                      <div
                        key={schedule.id}
                        className={`w-full flex items-center gap-2 text-sm ${
                          schedule.title ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        <Circle
                          className="size-2 text-red-600"
                          fill="#DC2626"
                        />
                        {schedule.title.length > 26
                          ? schedule.title.substring(0, 26 - 3) + "..."
                          : schedule.title
                          ? schedule.title
                          : "Sem título"}
                      </div>
                    ))}
                  {isSelectable && daySchedules.length > 2 && (
                    <div className="w-full flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span className="text-sm text-red-600 font-medium">
                        + {daySchedules.length - 2}{" "}
                        {daySchedules.length - 2 > 1
                          ? "agendamentos"
                          : "agendamento"}
                      </span>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-none flex flex-col gap-3">
                <DialogHeader>
                  <DialogTitle className="text-zinc-500 inline-flex items-center gap-2">
                    Novo agendamento em{" "}
                    {format(selectedDate, "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </DialogTitle>
                </DialogHeader>

                <NewSchedule user={user} selectedDate={selectedDate} />
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
