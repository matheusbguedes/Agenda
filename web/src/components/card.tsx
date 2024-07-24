import { api } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Cookie from "js-cookie";
import {
  BrickWall,
  Calendar,
  Clock,
  Laptop,
  Loader2,
  Pencil,
  Trash,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Card({
  userRole,
  schedule,
  active,
}: {
  userRole: string;
  schedule: Schedule;
  active?: boolean;
}) {
  const appointmentDate = parseISO(schedule.appointmentDate);

  const [isLoading, setIsLoading] = useState(false);

  const token = Cookie.get("token");

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete(
        `/schedule/${schedule.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={schedule.id}
      className="flex flex-col justify-between gap-1 border-2 border-zinc-800 border-l-red-600 rounded-md relative"
    >
      <div className="w-full flex flex-col p-3 gap-2">
        <div
          className={`w-full flex justify-between items-center gap-6  ${
            schedule.title ? "text-red-600" : "text-red-600/45"
          }`}
        >
          <p className="text-lg font-medium">
            {schedule.title ? schedule.title : "Sem título"}
          </p>

          {active && (
            <div className="flex">
              <Button
                size="icon"
                className="rounded-md rounded-tr-none rounded-br-none border-r border-l-2 border-t-2 border-b-2 border-zinc-800 hover:border-red-600/10 bg-zinc-900 hover:text-red-600 text-zinc-700 hover:bg-red-600/20"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                onClick={handleDelete}
                size="icon"
                className="rounded-md rounded-tl-none rounded-bl-none border-l border-r-2 border-t-2 border-b-2 border-zinc-800 hover:border-red-600/10 bg-zinc-900 hover:text-red-600 text-zinc-700 hover:bg-red-600/20"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash className="size-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {userRole == "coordination" && (
          <p className="w-full flex items-center gap-2 text-sm text-zinc-400">
            <UserRound className="size-4 text-red-600" />
            {schedule.userName}
          </p>
        )}

        <p
          className={`w-full flex items-center gap-2 text-sm capitalize ${
            schedule.roomUsed ? "text-zinc-400" : "text-zinc-700"
          }`}
        >
          <BrickWall
            className={`size-4 ${
              schedule.roomUsed ? "text-red-600" : "text-zinc-700"
            }`}
          />
          {schedule.roomUsed ? schedule.roomUsed : "Ambiente"}
        </p>

        <p
          className={`w-full flex items-center gap-2 text-sm capitalize ${
            schedule.resourceUsed ? "text-zinc-400" : "text-zinc-700"
          }`}
        >
          <Laptop
            className={`size-4 ${
              schedule.resourceUsed ? "text-red-600" : "text-zinc-700"
            }`}
          />
          {schedule.resourceUsed ? schedule.resourceUsed : "Recurso"}
        </p>
      </div>

      <div className="w-full flex flex-col items-center border-t-2 border-zinc-800 p-2 gap-2">
        <div className="w-full flex gap-2">
          <div className="w-full h-10 flex justify-center items-center border-2 border-zinc-800 px-3 gap-2 rounded-md">
            <Clock className="size-4 text-red-600" />
            <p className="text-zinc-400 text-sm text-nowrap">
              {schedule.startTime}º aula - {schedule.endTime}º aula
            </p>
          </div>
          <div className="w-full h-10 flex justify-center items-center border-2 border-zinc-800 px-3 gap-2 rounded-md">
            <Calendar className="size-4 text-red-600" />
            <p className="text-zinc-400 text-sm text-nowrap">
              {format(appointmentDate, "dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        {/* {active && (
          <div className="w-full flex gap-2">
            <Button className="w-full bg-zinc-900 text-zinc-700 hover:text-red-600 hover:bg-red-600/20">
              <Pencil className="size-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={handleDelete}
              className="w-full bg-zinc-900 text-zinc-700 hover:text-red-600 hover:bg-red-600/20"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Trash className="size-4 mr-2" /> Excluir
                </>
              )}
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}
