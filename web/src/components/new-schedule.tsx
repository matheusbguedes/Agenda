"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { format, parse } from "date-fns";
import { Dot, Loader2, PlusCircle, Trash2 } from "lucide-react";
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
  const [resources, setResources] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const addResource = () => {
    if (resources.length < 3) {
      setResources([...resources, ""]);
    } else {
      toast.error("Máximo de 3 recursos permitidos!", {
        style: {
          background: "#FF6B6B",
          color: "white",
        },
      });
    }
  };

  const removeResource = (indexToRemove: number) => {
    setResources(resources.filter((_, index) => index !== indexToRemove));
  };

  const updateResource = (index: number, value: string) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  const onSubmit = async (data: any) => {
    const convertDate = (date: string) => {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      return format(parsedDate, "yyyy-MM-dd");
    };

    if (!startTime) {
      return toast.error("Selecione o horário de início!", {
        style: { background: "#FF6B6B", color: "white" },
      });
    }

    if (!endTime) {
      return toast.error("Selecione o horário de término!", {
        style: { background: "#FF6B6B", color: "white" },
      });
    }

    const filteredResources = resources.filter(
      (resource) => resource.trim() !== ""
    );

    if (!roomUsed && filteredResources.length === 0) {
      return toast.error("Selecione um ambiente ou recurso!", {
        style: { background: "#FF6B6B", color: "white" },
      });
    }

    try {
      setIsLoading(true);
      await api.post("/schedule", {
        userId: user.id,
        appointmentDate: convertDate(data.appointmentDate),
        title: data.title,
        startTime,
        endTime,
        resourceUsed: filteredResources.join(", "),
        roomUsed,
        isActive: true,
      });
      reset();
      setResources([]);
      setStartTime("");
      setEndTime("");
      setRoomUsed("");
    } catch (e) {
      console.log(e);
      toast.error("Algo deu errado!", {
        style: { background: "#FF6B6B", color: "white" },
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
      className="mt-2 flex flex-col gap-3 py-3"
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
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center gap-1 text-white">
                  1º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">07:00</p>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-1 text-white">
                  2º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">07:50</p>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-1 text-white">
                  3º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">08:40</p>
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-1 text-white">
                  4º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">09:50</p>
                </div>
              </SelectItem>
              <SelectItem value="5">
                <div className="flex items-center gap-1 text-white">
                  5º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">10:40</p>
                </div>
              </SelectItem>
              <SelectItem value="6">
                <div className="flex items-center gap-1 text-white">
                  6º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">11:30</p>
                </div>
              </SelectItem>
              <SelectItem value="7">
                <div className="flex items-center gap-1 text-white">
                  7º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">13:50</p>
                </div>
              </SelectItem>
              <SelectItem value="8">
                <div className="flex items-center gap-1 text-white">
                  8º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">14:40</p>
                </div>
              </SelectItem>
              <SelectItem value="9">
                <div className="flex items-center gap-1 text-white">
                  9º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">15:30</p>
                </div>
              </SelectItem>
            </SelectContent>
          </SelectContent>
        </Select>

        <Select value={endTime} onValueChange={setEndTime}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Horário de término" />
          </SelectTrigger>
          <SelectContent>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center gap-1 text-white">
                  1º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">07:00</p>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-1 text-white">
                  2º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">07:50</p>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-1 text-white">
                  3º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">08:40</p>
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-1 text-white">
                  4º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">09:50</p>
                </div>
              </SelectItem>
              <SelectItem value="5">
                <div className="flex items-center gap-1 text-white">
                  5º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">10:40</p>
                </div>
              </SelectItem>
              <SelectItem value="6">
                <div className="flex items-center gap-1 text-white">
                  6º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">11:30</p>
                </div>
              </SelectItem>
              <SelectItem value="7">
                <div className="flex items-center gap-1 text-white">
                  7º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">13:50</p>
                </div>
              </SelectItem>
              <SelectItem value="8">
                <div className="flex items-center gap-1 text-white">
                  8º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">14:40</p>
                </div>
              </SelectItem>
              <SelectItem value="9">
                <div className="flex items-center gap-1 text-white">
                  9º aula
                  <Dot color="#52525b" size={24} />
                  <p className="text-zinc-600">15:30</p>
                </div>
              </SelectItem>
            </SelectContent>
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
      </div>

      {resources.map((resource, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={resource}
            onValueChange={(value) => updateResource(index, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Recurso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Notbook">Notbook</SelectItem>
              <SelectItem value="TV">TV</SelectItem>
              <SelectItem value="Projetor">Projetor</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-zinc-950/20"
            size="icon"
            onClick={() => removeResource(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}

      {resources.length < 3 && (
        <Button
          type="button"
          className="w-full hover:bg-zinc-950/40 bg-zinc-900 transition-colors"
          onClick={addResource}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Recurso
        </Button>
      )}

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
