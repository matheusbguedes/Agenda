"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import logo from "/public/logo.svg";

interface Inputs {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (!email || !password) {
      return toast.error("Preencha usúario e senha!", {
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

    setIsLoading(true);

    try {
      const params = {
        email,
        password,
      };

      await axios.get("/api/auth/login", { params });
      router.push("/");
    } catch (e) {
      return toast.error("Usuário ou senha incorreto!", {
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
      reset();
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center gap-6 bg-zinc-900 text-zinc-200">
      <Toaster position="top-center" />
      <Image draggable="false" src={logo} alt="logo-agenda" className="w-60" />
      <form
        className="w-96 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input type="text" placeholder="Email" {...register("email")} />
        <Input type="password" placeholder="Senha" {...register("password")} />
        <Button variant="default" type="submit">
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Entrar <LogIn className="ml-2 size-4" />
            </>
          )}
        </Button>
        <p className="w-full flex justify-center items-center gap-2 text-sm text-zinc-200">
          Não tem uma conta?
          <span className="cursor-pointer font-medium text-red-600 hover:text-red-800">
            Cadastre-se
          </span>
        </p>
      </form>
    </main>
  );
}
