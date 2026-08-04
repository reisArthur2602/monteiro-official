import type { PropsWithChildren } from "react";

import { UserRole } from "@/app/generated/prisma/enums";
import { redirectRole } from "@/utils/auth";

const UsersLayout = async ({ children }: PropsWithChildren) => {
  await redirectRole([UserRole.ADMINISTRADOR]);

  return <>{children}</>;
};

export default UsersLayout;
