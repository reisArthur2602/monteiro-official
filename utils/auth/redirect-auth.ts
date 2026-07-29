import { redirect } from "next/navigation";

import { getSession } from "./get-session";

export const redirectAuth = async () => {
  const user = await getSession();

  if (!user) {
    redirect("/auth");
  }

  return user;
};

export const redirectIfAuthenticated = async (destination = "/") => {
  const user = await getSession();

  if (user) {
    redirect(destination);
  }
};
