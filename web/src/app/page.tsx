import Header from "@/components/header";
import Schedule from "@/components/schedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900">
      <Toaster position="top-center" />
      <Header />
      <Tabs
        defaultValue="schedule"
        className="w-full flex flex-col justify-center items-center"
      >
        <TabsList className="w-[400px] grid grid-cols-2 z-10">
          <TabsTrigger value="schedule">Agendar</TabsTrigger>
          <TabsTrigger value="my-schedules">Meus agendamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="w-full">
          <Schedule />
        </TabsContent>
        <TabsContent value="my-schedules"></TabsContent>
      </Tabs>
    </main>
  );
}
