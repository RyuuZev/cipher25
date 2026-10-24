import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return user;
}
