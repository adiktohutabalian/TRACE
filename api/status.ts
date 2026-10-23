import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isSupabaseConfigured } from "./_utils/supabase";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    status: "ok",
    app: "TRACE",
    database_mode: isSupabaseConfigured() ? "Supabase (PostgreSQL Cloud)" : "Not configured",
    supabase_connected: isSupabaseConfigured(),
  });
}
