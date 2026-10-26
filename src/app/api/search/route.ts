import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const q = body?.q?.trim() ?? "";

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_students", { q });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}