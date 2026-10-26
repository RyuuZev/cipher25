import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Student } from "@/lib/types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function searchStudents(query: string): Promise<Student[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  return fetchJson<Student[]>("/api/search", {
    method: "POST",
    body: JSON.stringify({ q }),
  });
}

export const getStudentByNim = cache(
  async (nim: string): Promise<Student | null> => {
    const trimmed = nim.trim();
    if (!trimmed) return null;

    const student = await fetchJson<Student | null>(
      `/api/student/${encodeURIComponent(trimmed)}`,
    );
    return student;
  },
);

export async function listStudents(query?: string): Promise<Student[]> {
  const supabase = await createClient();
  let builder = supabase.from("students").select("*").order("nama");

  const q = query?.replace(/[,()%]/g, " ").trim();
  if (q) {
    builder = builder.or(`nim.ilike.%${q}%,nama.ilike.%${q}%`);
  }

  const { data, error } = await builder;
  if (error) throw new Error(error.message);
  return (data ?? []) as Student[];
}

export type StudentStats = {
  total: number;
  withPhoto: number;
  withInstagram: number;
};

export async function getStudentStats(): Promise<StudentStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("foto_path, instagram_url");

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<
    Pick<Student, "foto_path" | "instagram_url">
  >;

  return {
    total: rows.length,
    withPhoto: rows.filter((row) => row.foto_path).length,
    withInstagram: rows.filter((row) => row.instagram_url).length,
  };
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Student | null) ?? null;
}