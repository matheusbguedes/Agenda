import { getUser } from "@/lib/auth";
import Calendar from "./calendar";

export default function Schedule() {
  const user = getUser();
  return <Calendar user={user} />;
}
