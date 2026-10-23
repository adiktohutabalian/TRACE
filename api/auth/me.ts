import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
    });
  } catch (err: any) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: err.message });
  }
}
