import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthenticatedUser } from "../_utils/auth";
import { DBService } from "../_utils/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  const checkpointId = req.query.id as string;
  if (!checkpointId) {
    return res.status(400).json({ error: "Checkpoint ID is required." });
  }

  const { where_left_off, whats_important, whats_next } = req.body || {};

  const now = new Date().toISOString();
  const updates: any = { updated_at: now };
  if (where_left_off && where_left_off.trim()) updates.where_left_off = where_left_off.trim();
  if (whats_important !== undefined) {
    updates.whats_important = whats_important && whats_important.trim() ? whats_important.trim() : null;
  }
  if (whats_next && whats_next.trim()) updates.whats_next = whats_next.trim();

  try {
    const updatedCheckpoint = await DBService.updateCheckpoint(checkpointId, updates);

    if (!updatedCheckpoint) {
      return res.status(404).json({ error: "Checkpoint not found." });
    }

    return res.json({ checkpoint: updatedCheckpoint });
  } catch (err: any) {
    console.error("Edit checkpoint error:", err);
    return res.status(500).json({ error: err.message });
  }
}
