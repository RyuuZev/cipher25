import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ nim: string }> }
) {
  const { nim } = await params;
  const trimmedNim = nim.trim();

  if (!trimmedNim) {
    return NextResponse.json({ error: "NIM required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("get_student", { p_nim: trimmedNim });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>;
  return NextResponse.json(rows[0] ?? null);
}