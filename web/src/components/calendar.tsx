"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isWithinInterval,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Cookie from "js-cookie";
import {
  CalendarPlus,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Calendar({ user }: { user: User }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baseDate, setBaseDate] = useState(new Date());

  const startDay = startOfWeek(startOfMonth(baseDate));
  const endDay = endOfWeek(endOfMonth(baseDate));

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomUsed, setRoomUsed] = useState("");
  const [resourceUsed, setResourceUsed] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const token = Cookie.get("token");

    const convertDate = (date: string) => {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      return format(parsedDate, "yyyy-MM-dd");
    };

    if (!startTime) {
      return toast.error("Selecione o horário de início!", {
        style: {
          background: "",
          color: "",
        },
        iconTheme: {
          primary: "",
          secondary: "",
        },
      });
    }

    if (!endTime) {
      return toast.error("Selecione o horário de término!", {
        style: {
          background: "",
          color: "",
        },
        iconTheme: {
          primary: "",
          secondary: "",
        },
      });
    }

    if (!roomUsed && !resourceUsed) {
      return toast.error("Selecione uma sala ou recurso!", {
        style: {
          background: "",
          color: "",
        },
        iconTheme: {
          primary: "",
          secondary: "",
        },
      });
    }

    try {
      setIsLoading(true);
      await api.post(
        "/schedule",
        {
          userId: user.id,
          appointmentDate: convertDate(data.appointmentDate),
          startTime,
          endTime,
          resourceUsed,
          roomUsed,
          isActive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log(e);
      toast.error("Algo deu errado!", {
        style: {
          background: "",
          color: "",
        },
        iconTheme: {
          primary: "",
          secondary: "",
        },
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="container flex flex-col gap-2 mb-4">
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
                  {isToday(day!) ? (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="w-full inline-flex justify-end">
                        <span className="size-10 flex justify-center items-center p-1 rounded-full font-medium text-red-600 border-2 border-red-600">
                          {format(day!, "dd")}
                        </span>
                      </div>
                    </div>
                  ) : isSelectable ? (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <span className="w-full inline-flex justify-end">
                        {format(day!, "dd")}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col text-zinc-800">
                      <span className="w-full inline-flex justify-end items-center gap-1">
                        <X className="size-3 text-red-600/40" />{" "}
                        {format(day!, "dd")}
                      </span>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-none flex flex-col gap-3">
                <DialogHeader>
                  <DialogTitle className="text-zinc-400 inline-flex items-center gap-2">
                    Agendar <CalendarPlus className="size-4" />
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 flex flex-col gap-3"
                >
                  <Input
                    readOnly
                    type="text"
                    value={selectedDate.toLocaleDateString()}
                    placeholder="Data de agendamento"
                    {...register("appointmentDate")}
                  />

                  <div className="flex justify-center items-center gap-3">
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Horário de início" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1º aula</SelectItem>
                        <SelectItem value="2">2º aula</SelectItem>
                        <SelectItem value="3">3º aula</SelectItem>
                        <SelectItem value="4">4º aula</SelectItem>
                        <SelectItem value="5">5º aula</SelectItem>
                        <SelectItem value="6">6º aula</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Horário de término" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1º aula</SelectItem>
                        <SelectItem value="2">2º aula</SelectItem>
                        <SelectItem value="3">3º aula</SelectItem>
                        <SelectItem value="4">4º aula</SelectItem>
                        <SelectItem value="5">5º aula</SelectItem>
                        <SelectItem value="6">6º aula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <Select value={roomUsed} onValueChange={setRoomUsed}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Recurso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nivonei">Sala nivonei</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={resourceUsed}
                      onValueChange={setResourceUsed}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sala" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Notbook">Notbook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="default"
                    type="submit"
                    className="w-full hover:bg-zinc-950/80 bg-zinc-950 transition-colors"
                  >
                    {isLoading ? (
                      <div className="inline-flex gap-2 animate-pulse">
                        Agendando
                        <Loader2 className="size-5 animate-spin" />
                      </div>
                    ) : (
                      "Agendar"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
