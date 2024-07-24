import Header from "@/components/header";
import MySchedules from "@/components/my-schedules";
import Schedule from "@/components/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/auth";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const user = getUser();
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900">
      <Toaster position="top-center" />
      <Header />
      <Tabs
        defaultValue="schedule"
        className="w-full flex flex-col justify-center items-center"
      >
        <TabsList
          className={`grid z-10 ${
            user.role == "coordination"
              ? "w-[600px] grid-cols-3"
              : "w-[400px] grid-cols-2"
          }`}
        >
          <TabsTrigger value="schedule">Agendar</TabsTrigger>
          <TabsTrigger value="my-schedules">Meus agendamentos</TabsTrigger>
          {user.role == "coordination" && (
            <TabsTrigger value="coodination">Coordenação</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="schedule" className="w-full">
          <Schedule user={user} />
        </TabsContent>
        <TabsContent value="my-schedules">
          <MySchedules user={user} />
        </TabsContent>
        <TabsContent value="coordination"></TabsContent>
      </Tabs>
    </main>
  );
}
