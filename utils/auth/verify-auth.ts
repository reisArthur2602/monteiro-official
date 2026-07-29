import { getSession } from "./get-session";

export const verifyAuth = async () => {
  const user = await getSession();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
};
