import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export function getUser(): User {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthenticated");
  }

  const user: User = jwtDecode(token);

  return user;
}
