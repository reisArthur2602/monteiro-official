import type { PropsWithChildren } from "react";
import { redirectIfAuthenticated } from "@/utils";

const PublicLayout = async ({ children }: PropsWithChildren) => {
  await redirectIfAuthenticated("/");
  return children;
};

export default PublicLayout;
