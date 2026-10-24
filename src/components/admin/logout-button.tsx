"use client";

import { LogOut } from "lucide-react";

import { logout } from "@/app/login/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="button-ghost text-xs">
        <LogOut className="size-3.5" />
        Keluar
      </button>
    </form>
  );
}
