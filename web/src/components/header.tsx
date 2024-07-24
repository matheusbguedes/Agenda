import { getUser } from "@/lib/auth";
import { LogOut, User2 } from "lucide-react";
import Image from "next/image";
import logo from "/public/logo.svg";

export default function Header() {
  const user = getUser();

  return (
    <header className="h-max w-full flex justify-between py-4 px-3 md:px-8">
      <Image draggable="false" src={logo} alt="logo-agenda" className="w-32" />
      <div className="flex gap-4 justify-center items-center">
        <div className="flex flex-col items-end gap-1">
          <p className="text-sm font-medium text-zinc-200">{user.name}</p>
          <a
            href="/api/auth/logout"
            className="flex gap-1 justify-center items-center text-sm cursor-pointer text-zinc-400 hover:text-red-500"
          >
            sair <LogOut className="size-3" />
          </a>
        </div>

        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl!}
            width={200}
            height={200}
            draggable={false}
            alt="profile-image"
            className="size-11 rounded-full outline outline-2 outline-red-600"
          />
        ) : (
          <div className="size-11 flex justify-center items-center rounded-full outline outline-2 outline-red-600">
            <User2 className="size-6 text-red-600" />
          </div>
        )}
      </div>
    </header>
  );
}
