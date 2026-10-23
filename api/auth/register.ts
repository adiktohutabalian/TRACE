import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DBService } from "../_utils/db";
import type { DBUser } from "../_utils/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await DBService.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const newUser: DBUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: name.trim(),
      password_hash: password,
      created_at: new Date().toISOString(),
    };

    await DBService.createUser(newUser);

    return res.status(201).json({
      user: { id: newUser.id, email: newUser.email, name: newUser.name, created_at: newUser.created_at },
      token: `tok_${newUser.id}`,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: `Registration error: ${err.message}` });
  }
}
