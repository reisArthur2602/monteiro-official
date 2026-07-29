import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

const alg = "HS256";

export const SESSION_COOKIE_NAME = "session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionTokenPayload = {
  sub: string;
};

export const signSessionToken = async (payload: SessionTokenPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
};

export const verifySessionToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify<SessionTokenPayload>(token, secret);

    if (!payload.sub) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
