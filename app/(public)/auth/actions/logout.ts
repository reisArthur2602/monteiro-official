"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME } from "@/utils/auth";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);

  redirect("/auth");
};
