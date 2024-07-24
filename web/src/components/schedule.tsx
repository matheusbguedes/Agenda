import Calendar from "./calendar";

export default function Schedule({ user }: { user: User }) {
  return <Calendar user={user} />;
}
