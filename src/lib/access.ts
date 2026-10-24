import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  accessToken,
  isValidToken,
} from "@/lib/access-core";

export { safeNext, verifyCode } from "@/lib/access-core";

export async function hasAccess(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(ACCESS_COOKIE)?.value);
}

export async function grantAccess(): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, await accessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
}
