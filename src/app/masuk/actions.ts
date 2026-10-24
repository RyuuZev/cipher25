"use server";

import { redirect } from "next/navigation";

import { grantAccess, safeNext, verifyCode } from "@/lib/access";

export type UnlockState = {
  error?: string;
  code?: string;
};

export async function unlock(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const code = String(formData.get("code") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));

  if (!code.trim()) {
    return { error: "Kode angkatan belum diisi." };
  }

  if (!(await verifyCode(code))) {
    return {
      error: "Kode angkatan tidak cocok. Periksa lagi dari pengurus.",
      code,
    };
  }

  await grantAccess();
  redirect(next);
}
