"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { format, parse } from "date-fns";
import Cookie from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NewSchedule({
  user,
  selectedDate,
}: {
  user: User;
  selectedDate: Date;
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomUsed, setRoomUsed] = useState("");
  const [resourceUsed, setResourceUsed] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const token = Cookie.get("token");

  const onSubmit = async (data: any) => {
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
      return toast.error("Selecione um ambiente ou recurso!", {
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
          title: data.title,
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
      reset();
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-2 flex flex-col gap-3"
    >
      <Input
        hidden
        className="hidden"
        value={selectedDate.toLocaleDateString()}
        {...register("appointmentDate")}
      />

      <Input type="text" placeholder="Título" {...register("title")} />

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
            <SelectValue placeholder="Ambiente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nivonei">Nivonei</SelectItem>
          </SelectContent>
        </Select>

        <Select value={resourceUsed} onValueChange={setResourceUsed}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Recurso" />
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
        {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Agendar"}
      </Button>
    </form>
  );
}
