import { SUPABASE_URL, SUPABASE_KEY } from "./database.ts";

// Generic fetch wrapper — swap "Restaurant" for any table name
export async function fromTable<T>(
  table: string,
  query: string = "*"
): Promise<T[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${query}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error(`Supabase error: ${res.statusText}`);
  return res.json();
}

// For filtered queries e.g. search by name
export async function fromTableFiltered<T>(
  table: string,
  filters: Record<string, string>, 
  query: string = "*"
): Promise<T[]> {
  const params = new URLSearchParams({ select: query, ...filters });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error(`Supabase error: ${res.statusText}`);
  return res.json();
}