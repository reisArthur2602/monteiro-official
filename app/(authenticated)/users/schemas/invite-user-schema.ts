import { z } from "zod";

import { UserRole } from "@/app/generated/prisma/enums";

export const inviteUserSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(150),
  email: z.email("Informe um e-mail válido").max(254),
  role: z.enum(UserRole),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
