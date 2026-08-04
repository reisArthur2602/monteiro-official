import { createHash, randomBytes } from "node:crypto";

/**
 * Token de convite: opaco, gerado aleatoriamente, nunca guardado em texto
 * puro — só o hash vai para o banco (`UserInvitation.tokenHash`), pelo
 * mesmo motivo de uma senha. O valor em si só existe no link enviado por
 * e-mail e na memória da requisição que o valida.
 */
export const generateInvitationToken = () => randomBytes(32).toString("hex");

export const hashInvitationToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
