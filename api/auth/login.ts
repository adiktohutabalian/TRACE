import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DBService } from "../_utils/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  const normalizedEmail = (email || "").trim().toLowerCase();

  try {
    const user = await DBService.findUserByEmail(normalizedEmail);

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
      token: `tok_${user.id}`,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: `Login error: ${err.message}` });
  }
}
